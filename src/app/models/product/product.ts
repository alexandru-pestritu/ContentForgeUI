export interface Product {
    id: number;
    store_ids: number[];
    name: string;
    full_name?: string;
    affiliate_urls: string[];
    in_stock?: boolean;
    description?: string;
    specifications?: { [key: string]: string };
    seo_keyword?: string;
    pros?: string[];
    cons?: string[];
    review?: string;
    rating?: number;
    image_urls?: string[];
    image_ids?: number[];
  }
  