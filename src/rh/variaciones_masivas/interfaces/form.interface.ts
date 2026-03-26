export interface ProductForm {
  name: string;
  description: string;
  price: number;
  categoryId: string;
}

export interface VariationForm {
  color: string;
  size: string;
  stock: number;
}