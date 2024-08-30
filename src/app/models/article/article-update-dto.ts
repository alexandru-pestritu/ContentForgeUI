export interface ArticleUpdateDTO {
    wp_id?: number;
    title: string;
    slug: string;
    categories_id_list?: number[];
    author_id?: number;
    status?: string;
    seo_keywords?: string[];
    meta_title?: string;
    meta_description?: string;
    main_image_url?: string;
    main_image_wp_id?: number;
    buyers_guide_image_url?: string;
    buyers_guide_image_wp_id?: number;
    products_id_list?: number[];
    content?: string;
    introduction?: string;
    buyers_guide?: string;
    faqs?: { title: string; description: string }[];
    conclusion?: string;
  }