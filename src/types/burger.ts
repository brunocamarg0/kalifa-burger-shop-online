// Tipos para customização de hambúrgueres

export type MeatDoneness = 'medium' | 'rare' | 'well-done';

export interface BurgerAddon {
  id: string;
  name: string;
  price: number;
}

export interface BurgerSauce {
  id: string;
  name: string;
  price: number;
}

export interface BurgerSachet {
  id: string;
  name: string;
}

export interface BurgerCustomization {
  meatDoneness?: MeatDoneness;
  addons: BurgerAddon[];
  extraSauces: BurgerSauce[];
  sachets: BurgerSachet[];
  observations?: string;
}

// Opções de customização disponíveis
export const BURGER_ADDONS: BurgerAddon[] = [
  { id: 'hamburger', name: 'HAMBURGUER', price: 10.00 },
  { id: 'cheddar', name: 'CHEDDAR FATIADO', price: 5.00 },
  { id: 'requeijao', name: 'REQUEIJÃO EMPANADO', price: 18.00 },
  { id: 'tomate', name: 'TOMATE', price: 3.00 },
  { id: 'cebola-roxa', name: 'CEBOLA ROXA', price: 2.00 },
  { id: 'alface', name: 'ALFACE AMERICANA', price: 2.00 },
  { id: 'rucula', name: 'RÚCULA', price: 2.00 },
  { id: 'bacon', name: 'BACON', price: 8.00 },
  { id: 'ovo', name: 'OVO', price: 4.00 },
];

export const BURGER_EXTRA_SAUCES: BurgerSauce[] = [
  { id: 'maionese-defumada', name: 'MAIONESE DEFUMADA', price: 5.00 },
  { id: 'barbecue', name: 'BARBECUE', price: 4.00 },
  { id: 'geleia-pimenta', name: 'GELEIA DE PIMENTA', price: 5.00 },
];

export const BURGER_SACHETS: BurgerSachet[] = [
  { id: 'ketchup', name: 'KETCHUP' },
  { id: 'maionese', name: 'MAIONESE' },
  { id: 'mostarda', name: 'MOSTARDA' },
];

export const MEAT_DONENESS_OPTIONS: { value: MeatDoneness; label: string }[] = [
  { value: 'medium', label: 'Ao ponto' },
  { value: 'rare', label: 'Mal passado' },
  { value: 'well-done', label: 'Bem passado' },
];

