import { AppSchema, db, id, lookup, UpdateParams } from "@/lib/db";

interface TemplateItem {
  id: string;
  name: string;
  quantity: number;
  itemId: string;
  sortOrder?: number;
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
        itemId: templateItem?.item?.id,
        sortOrder: templateItem.sortOrder,
        name: templateItem.item?.name,
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
          order: { sortOrder: "asc" },
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

export const useTemplate = (templateId: string) => {
  const { isLoading, error, data } = db.useQuery({
    templates: {
      $: {
        where: {
          id: templateId,
          deletedAt: { $isNull: true },
        },
        limit: 1,
      },
      templateItems: {
        $: {
          where: {
            deletedAt: { $isNull: true },
          },
          order: { sortOrder: "asc" },
        },
        item: {},
      },
    },
  });

  return {
    template: mapTemplates(data)[0] || null,
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

const useNextSortOrder = (templateId: string) => {
  const {
    template
  } = useTemplate(templateId);

  if (!template) return 1;

  const maxSortOrder = Math.max(
    ...template.items.map((item) => item.sortOrder || 0),
    0
  );

  return maxSortOrder + 1;
};

export const useCreateTemplateItem = (templateId: string) => {
  const nextSortOrder = useNextSortOrder(templateId);

  return (name: string, owner: string) => {
    const templateItemId = id();

    db.transact([
      db.tx.templateItems[templateItemId]
        .update({
          sortOrder: nextSortOrder,
          quantity: 1,
          createdAt: new Date(),
        })
        .link({ owner })
        .link({ template: templateId }),
      db.tx.items[lookup("nameAndUserId", `${name}:${owner}`)]
        .update({ name, createdAt: new Date() })
        .link({ templateItems: [templateItemId] })
        .link({ owner }),
    ]);
  };
};

const updateTemplateProperty =
  (updateObj: UpdateParams<AppSchema, "templates">) => (id: string) => {
    db.transact([
      db.tx.templates[lookup("id", id)].update(updateObj, {
        upsert: false,
      }),
    ]);
  };

export const useDeleteTemplate = () =>
  updateTemplateProperty({ deletedAt: new Date() });

const updateTemplateItemProperty =
  (updateObj: UpdateParams<AppSchema, "templateItems">) => (id: string) => {
    db.transact([
      db.tx.templateItems[lookup("id", id)].update(updateObj, {
        upsert: false,
      }),
    ]);
  };

export const useUpdateTemplateItemQuantity =
  () => (id: string, quantity: number) => {
    updateTemplateItemProperty({ quantity })(id);
  };

export const useDeleteTemplateItem = () =>
  updateTemplateItemProperty({ deletedAt: new Date() });

export const useUpdateTemplateListOrder = () => (itemId: string, newSortOrder: number) => {
  updateTemplateItemProperty({ sortOrder: newSortOrder })(itemId);
};