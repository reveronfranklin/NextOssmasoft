import {IPlantillaCreateResponse} from 'src/formulacion/interfaces/plantilla/Create.interfaces';

export interface DTOReorderPlantilla {
  nuevoOrden: PlantillaReorder[];
}

export interface PlantillaReorder {
  id: number;
  procesoDetalleId: number;
  variableId: number;
  redondeo: number;
  acumular: boolean;
  formulaId: number;
  ordenCalculo: number;
  value: number;
  usuarioUpdate: number;
  codigoEmpresa: number;
}

export interface IPlantillaReorderResponse {
  data: IPlantillaCreateResponse[];
}