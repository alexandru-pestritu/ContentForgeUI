export interface ProductCreateDTO {
    name: string;
    store_ids: number[];
    affiliate_urls: string[];
    seo_keyword?: string;
    rating?: number;
  }