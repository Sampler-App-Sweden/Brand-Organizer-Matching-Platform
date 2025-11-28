export interface ProductImage {
  id: string;
  url: string;
  file?: File;
}

export interface SponsorshipProduct {
  id: string;
  name: string;
  images: ProductImage[];
  goals: string;
  quantity: number;
  unit: string;
  details?: string;
  status: 'online' | 'offline';
  order: number;
}

export interface ProductSponsorshipManagerProps {
  initialProducts?: SponsorshipProduct[];
  onSave?: (products: SponsorshipProduct[]) => void;
}
