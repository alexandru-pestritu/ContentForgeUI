export interface ArticleCreateDTO {
    title: string;
    slug: string;
    categories_id_list?: number[];
    author_id?: number;
    status?: string;
    seo_keywords?: string[];
    meta_title?: string;
    meta_description?: string;
    main_image_url?: string;
    buyers_guide_image_url?: string;
    products_id_list?: number[];
  }