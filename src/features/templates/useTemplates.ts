import { db, id } from "@/lib/db";

export interface TemplateItem {
  id: string;
  name: string;
  quantity: number;
}

export interface Template {
  id: string;
  name: string;
  createdAt: Date;
  items: TemplateItem[];
  };

export const useTemplates = (): {
  templates: Template[] | undefined;
  loading: boolean;
  error: Error | null;
} => {
  const query = { template: {
    templateItem: {
      item: {}
    }
  } };
  const { isLoading, error, data } = db.useQuery(query);

  const mapTemplates = (data: any): Template[] => {
    return data?.template.map((item: any) => ({
      id: item.id,
      name: item.name,
      createdAt: new Date(item.createdAt),
      items: item.templateItem.map((templateItem: any) => ({
        id: templateItem.id,
        name: templateItem.item.name,
        quantity: templateItem.quantity
      }))
    })) || [];
  };

  return {
    templates: mapTemplates(data),
    loading: isLoading,
    error: error as Error | null,
  };
}

export const useCreateTemplate = () =>
  (name: string) =>
    db.transact(db.tx.template[id()].create({ name, createdAt: new Date() }));

export const useDeleteTemplate = () =>
  (id: string) =>
    db.transact(db.tx.template[id].delete());
