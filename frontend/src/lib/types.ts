export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  behanceUrl: string;
  type?: 'design' | 'technology';
  sort_order?: number;
  created_at?: string;
}

export interface Logo {
  id: number;
  imageUrl: string;
  name?: string;
  created_at?: string;
}

export interface SiteSettings {
  [key: string]: string;
}

export interface ExperienceItem {
  label: string;
  title: string;
}
