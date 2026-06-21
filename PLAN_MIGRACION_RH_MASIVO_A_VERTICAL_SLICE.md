# Plan de migracion de `/apps/rh/masivo/` hacia `OssmmasoftVerticalSlice`

## Objetivo

Migrar las llamadas API de la pagina frontend:

`/apps/rh/masivo/`

desde el backend actual:

`/Users/freveron/Developer/Projects/MM/Ossmmsoft_convertidor-main`

hacia el backend vertical slice:

`/Users/freveron/Developer/Projects/MM/OssmmasoftVerticalSlice`

manteniendo el comportamiento funcional actual de la pantalla: filtros, consulta del historico masivo, grid y exportacion.

## Estado actual detectado

La pagina `src/pages/apps/rh/masivo/index.tsx` renderiza dos componentes principales:

- `src/rh/historico/masivo/component/FilterHistoricoNominaMasivo.tsx`
- `src/rh/historico/components/TableServerSideHistoricoMasivo.tsx`

La llamada principal del grid esta en:

`src/rh/historico/components/TableServerSideHistoricoMasivo.tsx`

Actualmente llama a backend `a` con:

```ts
ossmmasofApi.post('/HistoricoMovimiento/GetHistoricoFecha', filterHistorico)
```

El filtro tambien depende de backend `a` para:

```ts
ossmmasofApi.post('/RhTipoNomina/GetTipoNominaByCodigoPersona', filterTipoNomina)
ossmmasofApi.post('/RhConceptos/GetConceptosByPersonas', filter)
```

En backend `b` ya existe este endpoint:

```http
POST /api/RhMovNominaMasivo/create
```

pero ese endpoint es para crear movimientos masivos. No reemplaza la consulta de historico usada por `/apps/rh/masivo/`.

Por lo tanto, la migracion correcta necesita crear un endpoint equivalente a:

```http
POST /api/HistoricoMovimiento/GetHistoricoFecha
```

en `OssmmasoftVerticalSlice`.

## Contrato actual que debe conservarse

### Request actual del grid

```ts
interface FilterHistorico {
  desde: Date
  hasta: Date
  tipoQuery: string
  codigoTipoNomina: IListTipoNominaDto[]
  codigoPersona: number
  codigoConcepto: IListConceptosDto[]
  page: number
  pageSize: number
  tipoSort: 'asc' | 'desc' | undefined | null
  sortColumn: string
  codigoProceso: number
}
```

Para esta pagina, el request se envia con:

```ts
{
  desde,
  hasta,
  tipoQuery: 'MASIVO',
  codigoTipoNomina,
  codigoConcepto,
  codigoPersona: 0,
  page,
  pageSize,
  tipoSort,
  sortColumn,
  codigoProceso: 0
}
```

### Response esperado por el frontend

El frontend espera:

```ts
response.data.data
```

donde `data` es una lista compatible con `IHistoricoMovimiento`.

La forma general de respuesta debe mantenerse parecida a:

```ts
{
  data: IHistoricoMovimiento[],
  isValid: boolean,
  message: string,
  linkData: string,
  page: number,
  cantidadRegistros: number
}
```

## Fase 1: Migrar la consulta principal del grid

Estado: aplicada en codigo.

Archivos creados/modificados:

- Backend: `OssmmasoftVerticalSlice/Features/RhHistoricoMovimiento/RhHistoricoMovimientoGetHistoricoFecha.cs`
- Backend SQL: `OssmmasoftVerticalSlice/Features/RhHistoricoMovimiento/SP_RH_HISTORICO_MOV_MASIVO_GET.sql`
- Frontend: `NextOssmasoft/src/rh/historico/components/TableServerSideHistoricoMasivo.tsx`

### 1.1 Crear vertical slice para historico masivo

Crear en backend `b` una feature nueva:

```text
OssmmasoftVerticalSlice/Features/RhHistoricoMovimiento/RhHistoricoMovimientoGetHistoricoFecha.cs
```

La ruta propuesta es:

```http
POST /api/RhHistoricoMovimiento/GetHistoricoFecha
```

Esta feature debe incluir:

- Record/query de entrada equivalente a `FilterHistorico`.
- Records de respuesta equivalentes a los campos usados por `IHistoricoMovimiento`.
- Handler con la logica de consulta.
- Controller con `[ApiController]` y `[Route("api/RhHistoricoMovimiento")]`.

### 1.2 Portar la logica desde el backend `a`

Tomar como referencia:

```text
Ossmmsoft_convertidor-main/Convertidor/Controllers/HistoricoMovimientoController.cs
Ossmmsoft_convertidor-main/Convertidor/Services/Rh/RhHistoricoMovimientoService.cs
```

Migrar inicialmente solo el caso usado por esta pantalla:

```cs
case "MASIVO":
    result = await _historicoNominaService.GetByMasivo(filter);
    break;
```

La logica minima a conservar:

- Validar `desde`.
- Validar `hasta`.
- Consultar historico por rango de fechas.
- Filtrar por tipos de nomina seleccionados.
- Filtrar por conceptos seleccionados.
- Ordenar por fecha de nomina.
- Devolver `ResultDto` con `data`, `isValid`, `message`, `page` y `cantidadRegistros`.

### 1.3 Decidir sobre la generacion de Excel

El backend `a` genera un archivo Excel y devuelve `linkData`, pero el frontend actual de esta pantalla tambien genera Excel en cliente usando `xlsx` y `file-saver`.

Para reducir riesgo en fase 1:

- No migrar todavia la generacion server-side de Excel.
- Devolver `linkData: ""`.
- Mantener la exportacion actual del frontend.

Si despues se necesita conservar el Excel server-side, migrarlo como tarea separada.

### 1.4 Cambiar el frontend para usar backend `b`

En:

```text
NextOssmasoft/src/rh/historico/components/TableServerSideHistoricoMasivo.tsx
```

cambiar el import:

```ts
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
```

por:

```ts
import { ossmmasofApiVertical } from 'src/MyApis/ossmmasofApiVertical'
```

y cambiar la llamada:

```ts
const responseAll = await ossmmasofApi.post<any>('/HistoricoMovimiento/GetHistoricoFecha', filterHistorico)
```

por:

```ts
const responseAll = await ossmmasofApiVertical.post<any>('/RhHistoricoMovimiento/GetHistoricoFecha', filterHistorico)
```

### 1.5 Mejorar manejo de errores en el grid

Agregar manejo defensivo para evitar que la pantalla falle si el backend devuelve error:

```ts
const historico = responseAll.data?.data ?? []
setAllRows(historico)
setTotal(historico.length)
setRows(loadServerRows(page, historico))
```

Si `isValid` viene en `false`, mostrar `message` en `mensaje`.

### 1.6 Validacion de fase 1

Validar backend:

```bash
dotnet run
```

Validar frontend:

```bash
npm run dev
```

Pruebas manuales:

- Abrir `/apps/rh/masivo/`.
- Cambiar fecha desde/hasta.
- Seleccionar tipo de nomina.
- Seleccionar concepto.
- Confirmar que el grid carga datos.
- Confirmar que busqueda local sigue funcionando.
- Confirmar que paginacion local sigue funcionando.
- Confirmar que exportar Excel desde el boton actual sigue funcionando.

Resultado esperado de fase 1:

La tabla principal de `/apps/rh/masivo/` ya consulta historico masivo desde `OssmmasoftVerticalSlice`.

## Fase 2: Migrar dependencias restantes del filtro

Estado: aplicada en codigo. Reglas verificadas contra el backend `a`.

Archivos creados/modificados:

- Backend: `OssmmasoftVerticalSlice/Features/RhTipoNomina/RhTipoNominaGetByPersona.cs`
- Backend SQL: `OssmmasoftVerticalSlice/Features/RhTipoNomina/SP_RH_TIPO_NOMINA_BY_PERSONA_GET.sql`, crea `RH.SP_RH_TN_BY_PERSONA_GET`
- Backend: `OssmmasoftVerticalSlice/Features/RhConceptos/RhConceptosGetByPersonas.cs`
- Backend SQL: `OssmmasoftVerticalSlice/Features/RhConceptos/SP_RH_CONCEPTOS_BY_PERSONA_GET.sql`
- Frontend: `NextOssmasoft/src/rh/historico/masivo/component/FilterHistoricoNominaMasivo.tsx`

### 2.1 Migrar tipos de nomina usados por el filtro

Actualmente el filtro llama:

```http
POST /api/RhTipoNomina/GetTipoNominaByCodigoPersona
```

desde backend `a`.

### 2.1.1 Regla real del backend `a`

La implementacion actual esta en:

```text
Ossmmsoft_convertidor-main/Convertidor/Controllers/RhTipoNominaController.cs
Ossmmsoft_convertidor-main/Convertidor/Services/Rh/RhTipoNominaService.cs
Ossmmsoft_convertidor-main/Convertidor/Data/Repository/Rh/RhTipoNominaRepository.cs
```

El endpoint recibe:

```ts
{
  codigoPersona: number,
  desde: Date,
  hasta: Date
}
```

Para `/apps/rh/masivo/`, el frontend envia una persona default con:

```ts
codigoPersona: 0
```

Con `codigoPersona = 0`, el backend `a` consulta:

```cs
RH_V_HISTORICO_MOVIMIENTOS
  .Where(h => h.FECHA_NOMINA_MOV >= desde && h.FECHA_NOMINA_MOV <= hasta)
  .OrderByDescending(h => h.FECHA_NOMINA_MOV)
  .ThenBy(h => h.CEDULA)
```

Luego agrupa por:

```cs
CODIGO_TIPO_NOMINA
TIPO_NOMINA
```

Y por cada grupo busca el registro completo en:

```sql
RH_TIPOS_NOMINA
```

usando `CODIGO_TIPO_NOMINA`.

No hay fallback para tipos de nomina cuando `codigoPersona > 0` y no hay historico en rango; simplemente queda vacio.

### 2.1.2 Endpoint recomendado en backend `b`

Para minimizar cambios frontend, crear ruta compatible:

```http
POST /api/RhTipoNomina/GetTipoNominaByCodigoPersona
```

Archivo sugerido:

```text
OssmmasoftVerticalSlice/Features/RhTipoNomina/RhTipoNominaGetByPersona.cs
```

Request:

```cs
public record RhTipoNominaGetByPersonaQuery(
    int CodigoPersona,
    DateTime Desde,
    DateTime Hasta
);
```

Response compatible:

```cs
public record RhTipoNominaByPersonaResponse(
    int CodigoTipoNomina,
    string Descripcion,
    string SiglasTipoNomina,
    int FrecuenciaPagoId,
    string FrecuenciaPago,
    decimal SueldoMinimo
);
```

### 2.1.3 Stored procedure sugerido

Nombre:

```sql
RH.SP_RH_TN_BY_PERSONA_GET
```

Parametros:

```sql
p_codigo_persona IN NUMBER,
p_desde          IN DATE,
p_hasta          IN DATE,
p_ResultSet      OUT SYS_REFCURSOR,
p_Message        OUT VARCHAR2,
p_TotalRecords   OUT NUMBER
```

SQL base:

```sql
CREATE OR REPLACE PROCEDURE RH.SP_RH_TN_BY_PERSONA_GET (
    p_codigo_persona IN NUMBER,
    p_desde          IN DATE,
    p_hasta          IN DATE,
    p_ResultSet      OUT SYS_REFCURSOR,
    p_Message        OUT VARCHAR2,
    p_TotalRecords   OUT NUMBER
) AS
BEGIN
    p_Message := 'Success';

    SELECT COUNT(1)
      INTO p_TotalRecords
      FROM (
          SELECT DISTINCT h.CODIGO_TIPO_NOMINA
            FROM RH.RH_V_HISTORICO_MOVIMIENTOS h
           WHERE h.FECHA_NOMINA_MOV >= p_desde
             AND h.FECHA_NOMINA_MOV < p_hasta + 1
             AND (NVL(p_codigo_persona, 0) = 0 OR h.CODIGO_PERSONA = p_codigo_persona)
      );

    OPEN p_ResultSet FOR
        SELECT DISTINCT
            tn.CODIGO_TIPO_NOMINA,
            tn.DESCRIPCION,
            tn.SIGLAS_TIPO_NOMINA,
            tn.FRECUENCIA_PAGO_ID,
            '' AS FRECUENCIA_PAGO,
            tn.SUELDO_MINIMO
        FROM RH.RH_TIPOS_NOMINA tn
        INNER JOIN (
            SELECT DISTINCT h.CODIGO_TIPO_NOMINA
              FROM RH.RH_V_HISTORICO_MOVIMIENTOS h
             WHERE h.FECHA_NOMINA_MOV >= p_desde
               AND h.FECHA_NOMINA_MOV < p_hasta + 1
               AND (NVL(p_codigo_persona, 0) = 0 OR h.CODIGO_PERSONA = p_codigo_persona)
        ) hist ON hist.CODIGO_TIPO_NOMINA = tn.CODIGO_TIPO_NOMINA
        ORDER BY tn.DESCRIPCION;
EXCEPTION
    WHEN OTHERS THEN
        p_Message := SQLERRM;
        p_TotalRecords := 0;
        OPEN p_ResultSet FOR SELECT * FROM RH.RH_TIPOS_NOMINA WHERE 1 = 0;
END;
/
```

Nota: `FrecuenciaPago` en backend `a` se resuelve usando descriptivas. Para esta pantalla no se usa visualmente; puede devolverse `''` en fase 2 o resolverse con la tabla de descriptivas si se quiere contrato completo.

### 2.1.4 Relacion con endpoint existente en backend `b`

En backend `b` ya existe una feature relacionada:

```http
POST /api/RhTipoNominaGetAll/GetAll
```

Pero `GetAll` no reemplaza el comportamiento actual, porque el combo de `/apps/rh/masivo/` debe salir del historico del rango de fechas, no del catalogo completo.

### 2.2 Migrar conceptos usados por el filtro

Actualmente el filtro llama:

```http
POST /api/RhConceptos/GetConceptosByPersonas
```

desde backend `a`.

### 2.2.1 Regla real del backend `a`

La implementacion actual esta en:

```text
Ossmmsoft_convertidor-main/Convertidor/Controllers/RhConceptosController.cs
Ossmmsoft_convertidor-main/Convertidor/Services/Rh/RhConceptosService.cs
Ossmmsoft_convertidor-main/Convertidor/Data/Repository/Rh/RhConceptosRepository.cs
```

El endpoint recibe:

```ts
{
  codigoPersona: number,
  desde: Date,
  hasta: Date
}
```

Para `/apps/rh/masivo/`, el frontend envia:

```ts
codigoPersona: 0
```

Con `codigoPersona = 0`, backend `a` consulta:

```cs
RH_V_HISTORICO_MOVIMIENTOS
  .Where(h => h.FECHA_NOMINA_MOV >= desde && h.FECHA_NOMINA_MOV <= hasta)
  .OrderByDescending(h => h.FECHA_NOMINA_MOV)
  .ThenBy(h => h.CEDULA)
```

Luego agrupa por:

```cs
CODIGO_TIPO_NOMINA
CODIGO
DENOMINACION
```

Y por cada grupo busca en:

```sql
RH_CONCEPTOS
```

usando:

```sql
CODIGO_TIPO_NOMINA
CODIGO
```

Finalmente el controller ordena por:

```cs
Denominacion
```

Caso especial del backend `a`: si `codigoPersona > 0` y no consigue historico en el rango de fechas, hace fallback a todo el historico de esa persona sin fecha. Para `/apps/rh/masivo/` esto no aplica porque `codigoPersona = 0`.

### 2.2.2 Endpoint recomendado en backend `b`

Crear en backend `b` una feature equivalente y compatible:

```text
Features/RhConceptos/RhConceptosGetByPersonas.cs
```

Ruta:

```http
POST /api/RhConceptos/GetConceptosByPersonas
```

Request:

```cs
public record RhConceptosGetByPersonasQuery(
    int CodigoPersona,
    DateTime Desde,
    DateTime Hasta
);
```

Response compatible con:

```ts
IListConceptosDto
```

Campos minimos usados por `/apps/rh/masivo/`:

- `codigo`
- `codigoConcepto`
- `codigoTipoNomina`
- `denominacion`
- `automatico`

Campos adicionales que devuelve backend `a` y conviene preservar:

- `tipoNominaDescripcion`
- `descripcion`
- `tipoConcepto`
- `moduloId`
- `moduloDescripcion`
- `codigoPuc`
- `codigoPucConcat`
- `status`
- `frecuenciaId`
- `frecuenciaDescripcion`
- `dedusible`
- `idModeloCalculo`
- `extra1`

### 2.2.3 Stored procedure sugerido

Nombre:

```sql
RH.SP_RH_CONCEPTOS_BY_PERSONA_GET
```

Parametros:

```sql
p_codigo_persona IN NUMBER,
p_desde          IN DATE,
p_hasta          IN DATE,
p_ResultSet      OUT SYS_REFCURSOR,
p_Message        OUT VARCHAR2,
p_TotalRecords   OUT NUMBER
```

SQL base para modo masivo y compatible con persona:

```sql
CREATE OR REPLACE PROCEDURE RH.SP_RH_CONCEPTOS_BY_PERSONA_GET (
    p_codigo_persona IN NUMBER,
    p_desde          IN DATE,
    p_hasta          IN DATE,
    p_ResultSet      OUT SYS_REFCURSOR,
    p_Message        OUT VARCHAR2,
    p_TotalRecords   OUT NUMBER
) AS
    v_count NUMBER := 0;
BEGIN
    p_Message := 'Success';

    SELECT COUNT(1)
      INTO v_count
      FROM RH.RH_V_HISTORICO_MOVIMIENTOS h
     WHERE h.FECHA_NOMINA_MOV >= p_desde
       AND h.FECHA_NOMINA_MOV < p_hasta + 1
       AND (NVL(p_codigo_persona, 0) = 0 OR h.CODIGO_PERSONA = p_codigo_persona);

    SELECT COUNT(1)
      INTO p_TotalRecords
      FROM (
          SELECT DISTINCT h.CODIGO_TIPO_NOMINA, h.CODIGO
            FROM RH.RH_V_HISTORICO_MOVIMIENTOS h
           WHERE (
                 h.FECHA_NOMINA_MOV >= p_desde
                 AND h.FECHA_NOMINA_MOV < p_hasta + 1
                 AND (NVL(p_codigo_persona, 0) = 0 OR h.CODIGO_PERSONA = p_codigo_persona)
             )
              OR (
                 NVL(p_codigo_persona, 0) > 0
                 AND v_count = 0
                 AND h.CODIGO_PERSONA = p_codigo_persona
             )
      );

    OPEN p_ResultSet FOR
        SELECT DISTINCT
            c.CODIGO_CONCEPTO,
            c.CODIGO,
            c.CODIGO_TIPO_NOMINA,
            tn.DESCRIPCION AS TIPO_NOMINA_DESCRIPCION,
            c.DENOMINACION,
            c.DESCRIPCION,
            c.TIPO_CONCEPTO,
            c.MODULO_ID,
            '' AS MODULO_DESCRIPCION,
            c.CODIGO_PUC,
            '' AS CODIGO_PUC_CONCAT,
            c.STATUS,
            c.FRECUENCIA_ID,
            '' AS FRECUENCIA_DESCRIPCION,
            c.DEDUSIBLE,
            c.AUTOMATICO,
            NVL(c.ID_MODELO_CALCULO, 0) AS ID_MODELO_CALCULO,
            NVL(c.EXTRA1, '') AS EXTRA1
        FROM RH.RH_CONCEPTOS c
        INNER JOIN RH.RH_TIPOS_NOMINA tn
            ON tn.CODIGO_TIPO_NOMINA = c.CODIGO_TIPO_NOMINA
        INNER JOIN (
            SELECT DISTINCT h.CODIGO_TIPO_NOMINA, h.CODIGO
              FROM RH.RH_V_HISTORICO_MOVIMIENTOS h
             WHERE (
                   h.FECHA_NOMINA_MOV >= p_desde
                   AND h.FECHA_NOMINA_MOV < p_hasta + 1
                   AND (NVL(p_codigo_persona, 0) = 0 OR h.CODIGO_PERSONA = p_codigo_persona)
               )
                OR (
                   NVL(p_codigo_persona, 0) > 0
                   AND v_count = 0
                   AND h.CODIGO_PERSONA = p_codigo_persona
               )
        ) hist
            ON hist.CODIGO_TIPO_NOMINA = c.CODIGO_TIPO_NOMINA
           AND hist.CODIGO = c.CODIGO
        ORDER BY c.DENOMINACION;
EXCEPTION
    WHEN OTHERS THEN
        p_Message := SQLERRM;
        p_TotalRecords := 0;
        OPEN p_ResultSet FOR SELECT * FROM RH.RH_CONCEPTOS WHERE 1 = 0;
END;
/
```

Nota: `ModuloDescripcion`, `CodigoPucConcat` y `FrecuenciaDescripcion` en backend `a` se enriquecen usando otros servicios/tablas. Para la pantalla `/apps/rh/masivo/`, no son usados directamente por los autocompletes. En fase 2 pueden devolverse vacios para migrar sin ampliar dependencias; si otro flujo comparte este endpoint y necesita esos campos, hay que sumar las tablas de descriptivas y PUC.

### 2.3 Cambiar el filtro del frontend a `ossmmasofApiVertical`

En:

```text
NextOssmasoft/src/rh/historico/masivo/component/FilterHistoricoNominaMasivo.tsx
```

cambiar:

```ts
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
```

por:

```ts
import { ossmmasofApiVertical } from 'src/MyApis/ossmmasofApiVertical'
```

y reemplazar las llamadas:

```ts
ossmmasofApi.post<any>('/RhTipoNomina/GetTipoNominaByCodigoPersona', filterTipoNomina)
ossmmasofApi.post<any>('/RhConceptos/GetConceptosByPersonas', filter)
```

por:

```ts
ossmmasofApiVertical.post<any>('/RhTipoNomina/GetTipoNominaByCodigoPersona', filterTipoNomina)
ossmmasofApiVertical.post<any>('/RhConceptos/GetConceptosByPersonas', filter)
```

si se crean rutas compatibles.

### 2.3.1 Flujo actual del filtro en frontend

En `FilterHistoricoNominaMasivo.tsx`:

1. Al montar o cambiar fechas:
   - Setea `tipoQuery = 'MASIVO'`.
   - Crea persona default con `codigoPersona = 0`.
   - Llama `dataTipoNomina(persona)`.
   - Llama `dataConceptos(persona)`.
   - Guarda `personaSeleccionado`.

2. `dataTipoNomina` llama:

```ts
POST /RhTipoNomina/GetTipoNominaByCodigoPersona
```

con:

```ts
{
  codigoPersona: 0,
  desde: fechaDesde,
  hasta: fechaHasta
}
```

3. `dataConceptos` llama:

```ts
POST /RhConceptos/GetConceptosByPersonas
```

con el mismo payload.

4. Cuando cambia `Tipo Nomina`, `buscarConceptos(value)` filtra en frontend la lista de conceptos por:

```ts
concepto.codigoTipoNomina == tipoNomina.codigoTipoNomina
```

Por eso, para fase 2, el endpoint de conceptos debe devolver conceptos de historico con `codigoTipoNomina` correcto; no basta con devolver catalogo completo si se quiere conservar comportamiento.

### 2.3.2 Ajuste recomendado adicional en frontend

El flujo actual mezcla:

```ts
await dataConceptos(personaSeleccionado)
await fetchDataConceptos(dispatch)
```

dentro de `buscarConceptos`.

`fetchDataConceptos` llama al catalogo completo `/RhConceptos/GetAll` en backend `a`, lo que puede pisar los conceptos filtrados por historico.

Para fase 2 se recomienda:

- Eliminar `fetchDataConceptos(dispatch)` de `FilterHistoricoNominaMasivo.tsx`.
- Usar solamente `dataConceptos(personaSeleccionado)`.
- Filtrar `conceptosPorTipoNomina` desde la respuesta retornada o desde Redux actualizado, evitando depender de una copia vieja de `conceptos`.

Esto mantiene la intencion real de la pantalla: conceptos provenientes del historico del rango de fechas.

### 2.4 Normalizar contratos

Revisar si backend `b` devuelve:

```ts
{ data: [...] }
```

o directamente:

```ts
[...]
```

El componente actual espera `response.data` directamente en los combos. Si se devuelve `ResultDto`, adaptar asi:

```ts
const data = responseAll.data?.data ?? responseAll.data ?? []
```

Idealmente, estandarizar en `ResultDto` para mantener consistencia con el resto del vertical slice.

Para compatibilidad rapida, hay dos opciones:

1. Devolver lista directa desde los nuevos endpoints compatibles, igual que backend `a`.
2. Devolver `ResultDto` y ajustar `FilterHistoricoNominaMasivo.tsx` con `response.data?.data ?? response.data ?? []`.

Recomendacion: usar `ResultDto` en backend `b` y adaptar el frontend, porque el vertical slice ya usa ese patron en las features nuevas.

### 2.5 Limpieza final del frontend

Cuando grid y filtros esten usando backend `b`:

- Revisar que `FilterHistoricoNominaMasivo.tsx` ya no importe `ossmmasofApi`.
- Revisar que `TableServerSideHistoricoMasivo.tsx` ya no importe `ossmmasofApi`.
- Buscar llamadas restantes de la pantalla a backend `a`:

```bash
rg -n "ossmmasofApi|HistoricoMovimiento|RhTipoNomina|RhConceptos" src/rh/historico src/pages/apps/rh/masivo
```

### 2.6 Validacion de fase 2

Pruebas manuales:

- Abrir `/apps/rh/masivo/`.
- Confirmar que cargan tipos de nomina.
- Confirmar que cargan conceptos.
- Confirmar que al limpiar tipo de nomina no se rompe el filtro.
- Confirmar que al cambiar fechas se recalculan los combos.
- Confirmar que el grid sigue consultando backend `b`.

Resultado esperado de fase 2:

La pagina `/apps/rh/masivo/` queda completamente desacoplada de `Ossmmsoft_convertidor-main` para sus llamadas API principales.

### 2.7 Checklist actualizado de fase 2

1. Crear `RhTipoNominaGetByPersona.cs` en backend `b`. Aplicado.
2. Crear `SP_RH_TIPO_NOMINA_BY_PERSONA_GET.sql` con procedure `SP_RH_TN_BY_PERSONA_GET`. Aplicado.
3. Crear `RhConceptosGetByPersonas.cs` en backend `b`. Aplicado.
4. Crear `SP_RH_CONCEPTOS_BY_PERSONA_GET.sql`. Aplicado.
5. Ejecutar ambos SP en Oracle. Pendiente de ambiente.
6. Cambiar `FilterHistoricoNominaMasivo.tsx` a `ossmmasofApiVertical`. Aplicado.
7. Adaptar lectura de respuesta a `response.data?.data ?? response.data ?? []`. Aplicado.
8. Eliminar uso de `fetchDataConceptos(dispatch)` dentro del filtro masivo. Aplicado.
9. Probar cambios de fecha, tipo nomina y concepto en `/apps/rh/masivo/`. Pendiente de ambiente.

## Riesgos y consideraciones

- El endpoint `api/RhMovNominaMasivo/create` existente en backend `b` no reemplaza `HistoricoMovimiento/GetHistoricoFecha`; son casos de uso distintos.
- El backend `a` hace parte del filtrado en memoria despues de consultar historico. Al migrar a `b`, conviene decidir si mantener esa logica en C# o mover filtros directamente al SQL/stored procedure.
- El grid pagina en cliente usando `allRows`; aunque envia `page` y `pageSize`, no depende realmente de paginacion server-side.
- La pantalla usa `response.data.data`; si el contrato cambia, el grid quedara vacio.
- Si se cambia la estructura de fechas, validar serializacion entre Next.js, Axios y ASP.NET.

## Orden recomendado

1. Crear `RhHistoricoMovimientoGetHistoricoFecha` en backend `b`.
2. Probar el endpoint con payload real de la pantalla.
3. Cambiar solo `TableServerSideHistoricoMasivo.tsx` a `ossmmasofApiVertical`.
4. Validar grid.
5. Crear endpoints vertical slice para tipos de nomina y conceptos.
6. Cambiar `FilterHistoricoNominaMasivo.tsx` a `ossmmasofApiVertical`.
7. Validar pantalla completa.

## Anexo: DDL revisado y stored procedures propuestos

Archivo revisado:

```text
NextOssmasoft/plan_migracion_sql.sql
```

### Tablas y vistas disponibles

El DDL incluye lo necesario para iniciar la migracion con stored procedures:

- `RH.RH_V_HISTORICO_MOVIMIENTOS`
- `RH.RH_CONCEPTOS`
- `RH.RH_TIPOS_NOMINA`

La vista `RH_V_HISTORICO_MOVIMIENTOS` ya une:

- `RH_HISTORICO_PERSONAL_CARGO`
- `RH_HISTORICO_NOMINA`
- `RH_CONCEPTOS`

Por eso, para la fase 1 no hace falta consultar directamente las tablas origen si el rendimiento de la vista es aceptable.

### Columnas reales usadas para historico masivo

La vista `RH_V_HISTORICO_MOVIMIENTOS` expone las columnas necesarias para el grid:

```sql
CODIGO_PERSONA
CEDULA
FOTO
NOMBRE
APELLIDO
NACIONALIDAD
DESCRIPCION_NACIONALIDAD
SEXO
STATUS
DESCRIPCION_STATUS
CODIGO_EMPRESA
DESCRIPCION_SEXO
CODIGO_RELACION_CARGO
CODIGO_CARGO
CARGO_CODIGO
CODIGO_ICP
CODIGO_ICP_UBICACION
SUELDO
DESCRIPCION_CARGO
CODIGO_TIPO_NOMINA
TIPO_NOMINA
FRECUENCIA_PAGO_ID
CODIGO_SECTOR
CODIGO_PROGRAMA
TIPO_CUENTA_ID
DESCRIPCION_TIPO_CUENTA
BANCO_ID
DESCRIPCION_BANCO
NO_CUENTA
EXTRA1
EXTRA2
EXTRA3
USUARIO_INS
FECHA_INS
USUARIO_UPD
FECHA_UPD
CODIGO_PERIODO
FECHA_NOMINA
FECHA_INGRESO
FECHA_NOMINA_MOV
COMPLEMENTO
TIPO
MONTO
ESTATUS_MOV
CODIGO
DENOMINACION
CODIGO_CONCEPTO
```

El frontend espera ademas campos calculados o normalizados:

- `codigoHistoricoNomina`: la vista no lo trae. Se puede generar con `ROW_NUMBER() OVER (...)`.
- `full_name`: se puede calcular como `NOMBRE || ' ' || APELLIDO`.
- `avatar`: se puede mapear desde `FOTO` o devolver `''`.
- `unidadEjecutora`: se puede mapear inicialmente desde `CODIGO_SECTOR || '-' || CODIGO_PROGRAMA`, o dejarlo como campo pendiente si se requiere una denominacion real.
- `estadoCivil`: la vista no lo trae. Se puede devolver `''`.
- `searchText`: se puede calcular concatenando campos relevantes.

### SP 1: historico masivo

Nombre propuesto:

```sql
RH.SP_RH_HISTORICO_MOV_MASIVO_GET
```

Parametros:

```sql
p_desde                  IN DATE,
p_hasta                  IN DATE,
p_codigos_tipo_nomina    IN VARCHAR2,
p_codigos_concepto       IN VARCHAR2,
p_ResultSet              OUT SYS_REFCURSOR,
p_Message                OUT VARCHAR2,
p_TotalRecords           OUT NUMBER
```

Convencion:

- `p_codigos_tipo_nomina` recibe CSV: `'1,2,3'`.
- `p_codigos_concepto` recibe CSV de `CODIGO_CONCEPTO`: `'10,11,12'`.
- Si un CSV viene `NULL` o vacio, no aplica filtro.

SQL base:

```sql
CREATE OR REPLACE PROCEDURE RH.SP_RH_HISTORICO_MOV_MASIVO_GET (
    p_desde               IN DATE,
    p_hasta               IN DATE,
    p_codigos_tipo_nomina IN VARCHAR2,
    p_codigos_concepto    IN VARCHAR2,
    p_result              OUT SYS_REFCURSOR
) AS
BEGIN
    OPEN p_result FOR
        SELECT
            ROW_NUMBER() OVER (
                ORDER BY h.FECHA_NOMINA, h.CODIGO_PERSONA, h.CODIGO_TIPO_NOMINA, h.CODIGO_CONCEPTO
            ) AS CODIGO_HISTORICO_NOMINA,
            h.CODIGO_PERSONA,
            h.CEDULA,
            h.FOTO,
            h.NOMBRE,
            h.APELLIDO,
            h.NOMBRE || ' ' || h.APELLIDO AS FULL_NAME,
            h.NACIONALIDAD,
            h.DESCRIPCION_NACIONALIDAD,
            h.SEXO,
            h.STATUS,
            h.DESCRIPCION_STATUS,
            h.DESCRIPCION_SEXO,
            h.CODIGO_RELACION_CARGO,
            h.CODIGO_CARGO,
            h.CARGO_CODIGO,
            h.CODIGO_ICP,
            h.CODIGO_ICP_UBICACION,
            h.SUELDO,
            h.DESCRIPCION_CARGO,
            h.CODIGO_TIPO_NOMINA,
            h.TIPO_NOMINA,
            h.FRECUENCIA_PAGO_ID,
            h.CODIGO_SECTOR,
            h.CODIGO_PROGRAMA,
            h.TIPO_CUENTA_ID,
            h.DESCRIPCION_TIPO_CUENTA,
            h.BANCO_ID,
            h.DESCRIPCION_BANCO,
            h.NO_CUENTA,
            h.EXTRA1,
            h.EXTRA2,
            h.EXTRA3,
            h.CODIGO_PERIODO,
            h.FECHA_NOMINA,
            h.FECHA_INGRESO,
            h.FECHA_NOMINA_MOV,
            h.COMPLEMENTO,
            h.TIPO,
            h.MONTO,
            h.ESTATUS_MOV,
            h.CODIGO,
            h.DENOMINACION,
            h.CODIGO_CONCEPTO,
            NVL(h.FOTO, '') AS AVATAR,
            h.CODIGO_SECTOR || '-' || h.CODIGO_PROGRAMA AS UNIDAD_EJECUTORA,
            '' AS ESTADO_CIVIL,
            LOWER(
                h.NOMBRE || ' ' ||
                h.APELLIDO || ' ' ||
                h.CEDULA || ' ' ||
                h.TIPO_NOMINA || ' ' ||
                h.CODIGO || ' ' ||
                h.DENOMINACION
            ) AS SEARCH_TEXT
        FROM RH.RH_V_HISTORICO_MOVIMIENTOS h
        WHERE h.FECHA_NOMINA >= p_desde
          AND h.FECHA_NOMINA < p_hasta + 1
          AND (
              p_codigos_tipo_nomina IS NULL
              OR p_codigos_tipo_nomina = ''
              OR INSTR(',' || p_codigos_tipo_nomina || ',', ',' || h.CODIGO_TIPO_NOMINA || ',') > 0
          )
          AND (
              p_codigos_concepto IS NULL
              OR p_codigos_concepto = ''
              OR INSTR(',' || p_codigos_concepto || ',', ',' || h.CODIGO_CONCEPTO || ',') > 0
          )
        ORDER BY h.FECHA_NOMINA;
END;
/
```

### SP 2: tipos de nomina

Nombre propuesto:

```sql
RH.SP_RH_TIPOS_NOMINA_GET_ALL
```

Parametros:

```sql
p_result OUT SYS_REFCURSOR
```

SQL base:

```sql
CREATE OR REPLACE PROCEDURE RH.SP_RH_TIPOS_NOMINA_GET_ALL (
    p_result OUT SYS_REFCURSOR
) AS
BEGIN
    OPEN p_result FOR
        SELECT
            CODIGO_TIPO_NOMINA,
            DESCRIPCION,
            SIGLAS_TIPO_NOMINA,
            FRECUENCIA_PAGO_ID,
            SUELDO_MINIMO
        FROM RH.RH_TIPOS_NOMINA
        ORDER BY CODIGO_TIPO_NOMINA;
END;
/
```

Para modo masivo, este SP probablemente es suficiente. Si se debe respetar exactamente `GetTipoNominaByCodigoPersona`, se necesitara revisar la regla actual del backend `a`.

### SP 3: conceptos

Nombre propuesto:

```sql
RH.SP_RH_CONCEPTOS_GET_ALL
```

Parametros:

```sql
p_codigos_tipo_nomina IN VARCHAR2,
p_result              OUT SYS_REFCURSOR
```

SQL base:

```sql
CREATE OR REPLACE PROCEDURE RH.SP_RH_CONCEPTOS_GET_ALL (
    p_codigos_tipo_nomina IN VARCHAR2,
    p_result              OUT SYS_REFCURSOR
) AS
BEGIN
    OPEN p_result FOR
        SELECT
            CODIGO_CONCEPTO,
            CODIGO,
            CODIGO_TIPO_NOMINA,
            DENOMINACION,
            DESCRIPCION,
            TIPO_CONCEPTO,
            MODULO_ID,
            CODIGO_PUC,
            STATUS,
            FRECUENCIA_ID,
            DEDUSIBLE,
            AUTOMATICO,
            ID_MODELO_CALCULO,
            EXTRA1
        FROM RH.RH_CONCEPTOS
        WHERE (STATUS = 'A' OR STATUS IS NULL)
          AND (
              p_codigos_tipo_nomina IS NULL
              OR p_codigos_tipo_nomina = ''
              OR INSTR(',' || p_codigos_tipo_nomina || ',', ',' || CODIGO_TIPO_NOMINA || ',') > 0
          )
        ORDER BY CODIGO_TIPO_NOMINA, CODIGO;
END;
/
```

### Informacion adicional deseable

Para mejorar fidelidad con el backend `a`, todavia conviene ubicar estas reglas:

- Como se calcula realmente `unidadEjecutora`.
- Si `GetTipoNominaByCodigoPersona` para modo masivo debe devolver todos los tipos o solo tipos con historico en rango de fechas.
- Si `GetConceptosByPersonas` para modo masivo debe devolver todos los conceptos o solo conceptos con historico en rango de fechas.
- Si debe filtrarse por `CODIGO_EMPRESA`.

Si esas reglas no son criticas para la primera entrega, se puede avanzar con los 3 SP propuestos y ajustar luego.
