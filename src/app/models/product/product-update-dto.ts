export interface ProductUpdateDTO {
    name: string;
    store_ids: number[];
    affiliate_urls: string[];
    seo_keyword?: string;
    rating?: number;
    in_stock?: boolean;
    full_name?: string;
    description?: string;
    specifications?: { [key: string]: string };
    image_urls?: string[];
    image_ids?: number[];
    review?: string;
    pros?: string[];
    cons?: string[];
  }
  