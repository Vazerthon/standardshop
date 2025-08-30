import { AppSchema, db, id, lookup, UpdateParams } from "@/lib/db";

interface TemplateItem {
  id: string;
  name: string;
  quantity: number;
}

export interface Template {
  id: string;
  name: string;
  createdAt: Date;
  items: TemplateItem[];
}

const mapTemplates = (data: any): Template[] => {
  return (
    data?.templates.map((item: any) => ({
      id: item.id,
      name: item.name,
      createdAt: new Date(item.createdAt),
      items: item.templateItems.map((templateItem: any) => ({
        id: templateItem.id,
        name: templateItem.item.name,
        quantity: templateItem.quantity,
      })),
    })) || []
  );
};

export const useTemplates = () => {
  const { isLoading, error, data } = db.useQuery({
    templates: {
      $: {
        where: {
          deletedAt: { $isNull: true },
        },
      },
      templateItems: {
        $: {
          where: {
            deletedAt: { $isNull: true },
          },
        },
        item: {},
      },
    },
  });

  return {
    templates: mapTemplates(data),
    loading: isLoading,
    error: error as Error | null,
  };
};

export const useCreateTemplate = () => (name: string, owner: string) =>
  db.transact(
    db.tx.templates[id()]
      .create({ name, createdAt: new Date() })
      .link({ owner })
  );

const updateTemplateProperty =
  (updateObj: UpdateParams<AppSchema, "templates">) => (itemId: string) => {
    db.transact([
      db.tx.templates[lookup("id", itemId)].update(updateObj, {
        upsert: false,
      }),
    ]);
  };

export const useDeleteTemplate = () =>
  updateTemplateProperty({ deletedAt: new Date() });
