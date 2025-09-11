export interface DeletePlantillaDTO {
  id: number;
}

export interface IPlantillaDeleteResponse {
  id: number;
  fechaIns: Date;
  usuarioInsert: number;
  fechaUpd: Date;
  usuarioUpdate: any;
}