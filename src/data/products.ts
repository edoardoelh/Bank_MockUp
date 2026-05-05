export type ProductId = 'cuenta_corriente' | 'tarjeta_credito' | 'plan_ahorro' | 'seguro_vida';

export interface Product {
  id: ProductId;
  contracted: boolean;
  contractedSince?: string;
}

export const PRODUCTS: Product[] = [
  { id: 'cuenta_corriente', contracted: true, contractedSince: '2021-03-15' },
  { id: 'tarjeta_credito',  contracted: false },
  { id: 'plan_ahorro',      contracted: false },
  { id: 'seguro_vida',      contracted: false },
];
