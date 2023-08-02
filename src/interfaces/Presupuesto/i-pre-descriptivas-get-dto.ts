export interface IPreDescriptivasGetDto{
  descripcionId :number;
  descripcionIdFk :number;
  tituloId :number;
  descripcionTitulo:string;
  descripcion :string;
  codigo :string;
  extra1 :string;
  extra2 :string;
  extra3 :string;
  listaDescriptiva:IPreDescriptivasGetDto[];
}
