export interface CarbProduct {
  id: number;
  name: string;
  carbsPer100g: number;
  defaultPortion: number;
  createdAt: string;
}

export interface CarbEntry {
  id: number;
  productId: number;
  product: CarbProduct;
  amount: number;
  totalCarbs: number;
  createdAt: string;
}

export interface AddCarbEntryInput {
  productId: number;
  amount: number;
} 