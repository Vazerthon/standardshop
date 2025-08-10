export interface Template {
  id: string;
  name: string;
  items: TemplateItem[];
}

export interface TemplateItem {
  id: string;
  name: string;
  quantity: number;
}
