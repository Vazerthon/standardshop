export interface Template {
  id: string;
  createdAt: string;
  name: string;
  userId: string;
}

export interface Item {
  id: string;
  createdAt: string;
  name: string;
  quantity: number;
  templateId: string;
  userId: string;
}

export interface TemplateWithItems extends Template {
  items: Item[];
} 