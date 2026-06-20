/**
 * Utilidades para escanear el DOM, detectar formularios activos
 * y autocompletar campos simulando interacciones reales de React/Material-UI.
 */

export interface DetectedField {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder: string;
  value: string;
  element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
}

/**
 * Obtiene la etiqueta textual más apropiada para un elemento input.
 */
function findLabelForInput(input: HTMLElement): string {
  const id = input.id;
  
  // 1. Buscar <label htmlFor="id">
  if (id) {
    const labelEl = document.querySelector(`label[for="${id}"]`);
    if (labelEl && labelEl.textContent) {
      return labelEl.textContent.trim();
    }
  }

  // 2. Buscar si está envuelto en un elemento <label>
  let parent = input.parentElement;
  while (parent) {
    if (parent.tagName === 'LABEL' && parent.textContent) {
      return parent.textContent.trim();
    }

    // Si estamos en un control de formulario MUI (MuiFormControl), buscar la etiqueta dentro
    if (parent.classList.contains('MuiFormControl-root')) {

      const muiLabel = parent.querySelector('.MuiInputLabel-root, .MuiFormLabel-root');
      if (muiLabel && muiLabel.textContent) {
        return muiLabel.textContent.trim();
      }
    }
    parent = parent.parentElement;
  }

  // 3. Atributos de accesibilidad o placeholders
  const ariaLabel = input.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel.trim();

  const placeholder = input.getAttribute('placeholder');
  if (placeholder) return placeholder.trim();

  const name = input.getAttribute('name');
  if (name) return name.trim();

  return id || '';
}

/**
 * Comprueba si un elemento es visible en el DOM.
 */
function isElementVisible(el: HTMLElement): boolean {
  if (!el.isConnected) return false;
  const style = window.getComputedStyle(el);
  if (style.display === 'none') return false;
  if (style.visibility === 'hidden') return false;
  if (parseFloat(style.opacity || '1') === 0) return false;
  
  const rect = el.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return false;

  return true;
}

/**
 * Detecta todos los campos de formulario visibles y editables en la página activa,
 * excluyendo los elementos pertenecientes al chat/asistente flotante.
 */
export function detectFormFields(): DetectedField[] {
  if (typeof window === 'undefined') return [];

  const inputs = Array.from(document.querySelectorAll('input, textarea, select')) as (HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)[];
  const fields: DetectedField[] = [];

  for (const input of inputs) {
    // Excluir campos ocultos
    if (input.type === 'hidden') continue;

    // Excluir elementos que pertenecen al asistente de chat flotante
    let isInChat = false;
    let parent = input.parentElement;
    while (parent) {
      if (parent.classList.contains('MuiDrawer-root') || parent.classList.contains('app-chat') || parent.id === 'assistant-chat-drawer') {
        isInChat = true;
        break;
      }
      parent = parent.parentElement;
    }
    if (isInChat) continue;

    // Verificar visibilidad del elemento
    if (!isElementVisible(input)) continue;

    // Ignorar botones, submits, etc.
    if (['button', 'submit', 'reset', 'image', 'file'].includes(input.type)) continue;

    const label = findLabelForInput(input);

    fields.push({
      id: input.id || '',
      name: input.getAttribute('name') || '',
      type: input.type || input.tagName.toLowerCase(),
      label: label.replace(/\s*\*$/, '').trim(), // Limpiar el asterisco de campo requerido en MUI
      placeholder: input.getAttribute('placeholder') || '',
      value: input.value || '',
      element: input
    });
  }

  return fields;
}

/**
 * Establece de manera segura el valor de un campo input controlado por React
 * despachando los eventos sintéticos adecuados.
 */
export function setReactInputValue(input: HTMLInputElement | HTMLTextAreaElement, value: string): void {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
  const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
  
  const setter = input.tagName === 'TEXTAREA' ? nativeTextAreaValueSetter : nativeInputValueSetter;

  if (setter) {
    setter.call(input, value);
  } else {
    input.value = value;
  }

  // Despachar eventos para activar los manejadores de estado en React/react-hook-form
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
  
  // Simular pérdida de foco para validaciones
  input.dispatchEvent(new Event('blur', { bubbles: true }));
}

/**
 * Establece el estado Checked para un input tipo Checkbox/Radio en React.
 */
export function setReactCheckboxValue(input: HTMLInputElement, checked: boolean): void {
  const nativeInputCheckedSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'checked')?.set;
  
  if (input.checked !== checked) {
    if (nativeInputCheckedSetter) {
      nativeInputCheckedSetter.call(input, checked);
    } else {
      input.checked = checked;
    }
    input.dispatchEvent(new Event('click', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }
}

/**
 * Intenta autocompletar un campo específico basado en su identificador, etiqueta o placeholder.
 */
export function fillField(field: DetectedField, value: any): boolean {
  const el = field.element;
  
  if (!el) return false;

  el.focus();

  // Caso 1: Checkbox o Radio
  if (el instanceof HTMLInputElement && (el.type === 'checkbox' || el.type === 'radio')) {
    const checked = value === true || String(value).toLowerCase() === 'true' || String(value) === '1' || String(value).toLowerCase() === 'si';
    setReactCheckboxValue(el, checked);
    
    return true;
  }

  // Caso 2: Select estándar HTML
  if (el instanceof HTMLSelectElement) {
    el.value = String(value);
    el.dispatchEvent(new Event('change', { bubbles: true }));
    
    return true;
  }

  // Caso 3: Input de Autocomplete de MUI (identificado por clases o roles)
  const isAutocomplete = el.classList.contains('MuiAutocomplete-input') || el.getAttribute('role') === 'combobox';
  if (isAutocomplete) {
    // Si ya se está procesando un llenado en este campo, evitamos duplicar la acción y las peticiones API
    if (el.getAttribute('data-assistant-filling') === 'true') {
      return false; 
    }
    el.setAttribute('data-assistant-filling', 'true');

    const optionText = String(value).trim();
    el.focus();
    el.click();

    // Buscar botón de abrir dropdown en el padre
    const parent = el.parentElement;
    if (parent) {
      const arrowBtn = parent.querySelector('button[title="Open"]') || 
                       parent.querySelector('.MuiAutocomplete-popupIndicator') ||
                       parent.querySelector('.MuiSelect-icon');
      if (arrowBtn) {
        (arrowBtn as HTMLElement).click();
      }
    }

    // Mecanismo de espera y reintentos (Polling) para esperar a que carguen las opciones de la API
    const startTime = Date.now();
    const trySelectOption = () => {
      const options = Array.from(document.querySelectorAll('[role="option"], .MuiAutocomplete-option, .MuiMenuItem-root'));
      
      // Coincidencia flexible de texto (ignorando mayúsculas, minúsculas, espacios y plurales)
      const cleanOptionText = optionText.toLowerCase().replace(/s$/, '').trim();
      
      const targetOption = options.find(opt => {
        const text = (opt.textContent || '').toLowerCase().trim();
        const cleanText = text.replace(/s$/, '');
        
        return (
          text.includes(optionText.toLowerCase()) || 
          optionText.toLowerCase().includes(text) ||
          cleanText.includes(cleanOptionText) ||
          cleanOptionText.includes(cleanText)
        );
      }) as HTMLElement;

      if (targetOption) {
        targetOption.click();
        el.removeAttribute('data-assistant-filling');
        console.log(`[Autofill] Opción seleccionada con éxito: "${targetOption.textContent}" para "${value}"`);
      } else if (Date.now() - startTime < 3000) {
        // Reintentar cada 150ms hasta un máximo de 3 segundos
        setTimeout(trySelectOption, 150);
      } else {
        // Fallback: Si no carga o no se encuentra la opción, escribir el texto directamente
        console.warn(`[Autofill Warning] No se encontró opción para "${value}" después de 3s. Escribiendo valor directamente.`);
        setReactInputValue(el as HTMLInputElement, optionText);
        el.removeAttribute('data-assistant-filling');
      }
    };

    setTimeout(trySelectOption, 150);
    return true;
  }

  // Caso 4: Input de texto normal / Textarea
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    setReactInputValue(el, String(value));
    
    return true;
  }

  return false;
}

/**
 * Busca un valor en la barra de búsqueda del DataGrid y hace clic en el botón "Editar" de la fila coincidente.
 */
let isGridSearchActive = false;

/**
 * Busca un valor en la barra de búsqueda del DataGrid y hace clic en el botón "Editar" de la fila coincidente.
 */
export async function searchAndEditGridRow(searchValue: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  if (isGridSearchActive) {
    console.log('[Grid Search] Ya hay una búsqueda activa. Evitando ejecución concurrente.');
    return false;
  }

  isGridSearchActive = true;
  console.log(`[Grid Search] Iniciando búsqueda y selección para el registro: "${searchValue}"`);

  let hasTyped = false;

  // 2. Polling para esperar a que aparezca el input de búsqueda, rellenarlo y esperar por la fila coincidente
  const startTime = Date.now();
  
  return new Promise<boolean>((resolve) => {
    const tryFindAndClickRow = () => {
      // Intentar rellenar el input si aún no se ha hecho
      if (!hasTyped) {
        const searchInput = document.querySelector('input[placeholder*="Search" i], input[placeholder*="Buscar" i], .MuiDataGrid-toolbarContainer input') as HTMLInputElement;
        if (searchInput) {
          console.log('[Grid Search] Input de búsqueda encontrado. Escribiendo valor...');
          searchInput.focus();
          setReactInputValue(searchInput, searchValue);
          searchInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
          hasTyped = true;
        }
      }

      const rows = Array.from(document.querySelectorAll('.MuiDataGrid-row'));
      console.log(`[Grid Search] Buscando fila en ${rows.length} registros...`);

      for (const row of rows) {
        const cells = Array.from(row.querySelectorAll('.MuiDataGrid-cell'));
        const matches = cells.some(cell => {
          const text = (cell.textContent || '').trim().toLowerCase();
          const cleanText = text.replace(/^0+/, '');
          const cleanSearch = searchValue.toLowerCase().trim().replace(/^0+/, '');
          
          return text.includes(searchValue.toLowerCase().trim()) || cleanText === cleanSearch;
        });

        if (matches) {
          // Fila encontrada. Buscar el botón "Editar"
          const editBtn = row.querySelector('button[aria-label*="Editar" i], button[title*="Editar" i], button[aria-label*="Edit" i], button .mdi-file-document-edit-outline, button .mdi-pencil') as HTMLElement;

          if (editBtn) {
            console.log('[Grid Search] Fila y botón de edición encontrados. Haciendo clic...');
            editBtn.click();
            isGridSearchActive = false;
            resolve(true);
            return;
          }
          
          const firstBtn = row.querySelector('button') as HTMLElement;
          if (firstBtn) {
            console.log('[Grid Search] Botón específico no encontrado. Haciendo clic en el primer botón de la fila...');
            firstBtn.click();
            isGridSearchActive = false;
            resolve(true);
            return;
          }
        }
      }

      // Si ya escribimos en el input, extendemos el límite a 6s para dar tiempo a la carga del API
      const maxTimeout = hasTyped ? 6000 : 4000;
      if (Date.now() - startTime < maxTimeout) {
        setTimeout(tryFindAndClickRow, 250);
      } else {
        console.warn(`[Grid Search] No se pudo encontrar o abrir la fila para "${searchValue}" tras finalizar el tiempo de espera.`);
        isGridSearchActive = false;
        resolve(false);
      }
    };

    setTimeout(tryFindAndClickRow, 250);
  });
}

/**
 * Autocompleta un lote de campos a partir de un objeto clave-valor.
 * Compara las claves del objeto con el id, name, label o placeholder de los campos.
 */
export function fillFormFields(data: Record<string, any>): { successCount: number; totalCount: number } {
  let successCount = 0;

  if (typeof window !== 'undefined') {
    const searchKey = Object.keys(data).find(k => {
      const norm = k.toLowerCase().trim();
      return (
        norm === 'buscar' ||
        norm === 'search' ||
        norm === 'numerosolicitud' ||
        norm === 'solicitud' ||
        norm === 'numero' ||
        norm === 'número' ||
        norm === 'codigo' ||
        norm === 'código'
      );
    });

    if (searchKey && data[searchKey] !== undefined && data[searchKey] !== null) {
      const searchValue = String(data[searchKey]).trim();
      if (searchValue) {
        searchAndEditGridRow(searchValue);
        successCount++;
      }
    }
  }

  const fields = detectFormFields();

  // Mapa de sinónimos comunes en formularios empresariales en español
  const getAliases = (k: string): string[] => {
    const aliases: Record<string, string[]> = {
      estado: ['estado', 'estatus', 'status', 'situacion', 'situación'],
      estatus: ['estado', 'estatus', 'status', 'situacion', 'situación'],
      monto: ['monto', 'cantidad', 'total', 'monto_solicitado', 'valor'],
      descripcion: ['descripcion', 'descripción', 'detalle', 'concepto', 'motivo', 'glosa'],
      presupuesto: ['presupuesto', 'anio', 'año', 'ejercicio'],
      fecha: ['fecha', 'fec', 'date']
    };
    return aliases[k] || [k];
  };

  const removeAccents = (str: string): string => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  for (const [key, value] of Object.entries(data)) {
    const normalizedKey = key.toLowerCase().trim();
    const searchAliases = getAliases(normalizedKey);
    
    // Buscar un campo coincidente
    const matchedField = fields.find(field => {
      const label = removeAccents((field.label || '').toLowerCase());
      const placeholder = removeAccents((field.placeholder || '').toLowerCase());
      const name = removeAccents((field.name || '').toLowerCase());
      const id = removeAccents((field.id || '').toLowerCase());

      return searchAliases.some(alias => {
        const normAlias = removeAccents(alias.toLowerCase());
        return (
          label.includes(normAlias) ||
          normAlias.includes(label) ||
          name.includes(normAlias) ||
          id.includes(normAlias) ||
          placeholder.includes(normAlias)
        );
      });
    });

    if (matchedField) {
      const ok = fillField(matchedField, value);
      if (ok) successCount++;
    }
  }

  return { successCount, totalCount: Object.keys(data).length };
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .trim();
}

// function escapeRegExp(string: string) {
//   return string.replace(/[.*+?^${}()|[\mathi\]]/g, '\\$&');
// }

/**
 * Procesa localmente comandos de voz o texto para rellenar campos de formulario.
 * Retorna true si detectó y procesó el comando localmente.
 */
export function processLocalFormVoiceCommand(transcript: string): boolean {
  const fields = detectFormFields();
  if (fields.length === 0) return false;

  const normalizedTranscript = normalizeText(transcript);
  
  // Dividir por conectores comunes como " y ", " e ", comas o puntos y comas
  const parts = normalizedTranscript.split(/\s+y\s+|\s+e\s+|,\s*|;\s*/i);
  const dataToFill: Record<string, any> = {};
  let matchedCount = 0;

  for (const part of parts) {
    const trimmedPart = part.trim();
    if (!trimmedPart) continue;

    for (const field of fields) {
      const normLabel = normalizeText(field.label);
      if (!normLabel) continue;
      
      const escapedLabel = normLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      // 1. "completa [label] con [value]"
      const patternCompleta = new RegExp(`completa(?:\\s+\\w+)*\\s+${escapedLabel}\\s+con\\s+(.+)`, 'i');
      const matchCompleta = trimmedPart.match(patternCompleta);
      if (matchCompleta) {
        dataToFill[field.label] = matchCompleta[1].trim();
        matchedCount++;
        break;
      }

      // 2. "escribe/ingresa [value] en [label]"
      const patternEscribe = new RegExp(`(?:escribe|ingresa|coloca)\\s+(.+?)\\s+en(?:\\s+\\w+)*\\s+${escapedLabel}`, 'i');
      const matchEscribe = trimmedPart.match(patternEscribe);
      if (matchEscribe) {
        dataToFill[field.label] = matchEscribe[1].trim();
        matchedCount++;
        break;
      }

      // 3. "[label] [value]" (ej. "monto 500")
      const patternSimple = new RegExp(`^(?:el\\s+|la\\s+|campo\\s+)*${escapedLabel}\\s+(.+)`, 'i');
      const matchSimple = trimmedPart.match(patternSimple);
      if (matchSimple) {
        dataToFill[field.label] = matchSimple[1].trim();
        matchedCount++;
        break;
      }
    }
  }

  if (matchedCount > 0) {
    console.log('Local form matching found fields:', dataToFill);
    fillFormFields(dataToFill);
    
return true;
  }

  return false;
}
