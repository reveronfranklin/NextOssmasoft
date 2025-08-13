export interface UpdatePlantillaDTO {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  contenido: string;
}

export interface IPlantillaUpdateResponse {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: string;
  contenido: string;
  fechaIns: Date;
  usuarioInsert: number;
  fechaUpd: Date;
  usuarioUpdate: any;
}