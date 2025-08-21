export interface CreatePlantillaDTO {
  nombre: string;
  descripcion: string;
  tipo: string;
  contenido: string;
}

export interface IPlantillaCreateResponse {
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