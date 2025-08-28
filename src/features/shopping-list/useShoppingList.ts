import { db, id, lookup, UpdateParams, AppSchema} from "@/lib/db";

export interface ShoppingListItem {
  id: string;
  itemId: string;
  name: string;
  quantity: number;
  sortOrder: number;
  checkedAt?: Date | null;
}

const mapShoppingList = (data: any): ShoppingListItem[] => {
  return (
    data?.shopListItems.map((item: any) => ({
      id: item.id,
      itemId: item?.item?.id,
      name: item?.item?.name,
      quantity: item?.quantity,
      sortOrder: item?.sortOrder,
      checkedAt: item?.checkedAt ? new Date(item.checkedAt) : null,
    })) || []
  );
};

export const useShoppingList = () => {
  const { isLoading, error, data } = db.useQuery({
    shopListItems: {
      $: {
        where: {
          deletedAt: { $isNull: true },
        },
        order: { sortOrder: "asc" },
      },
      item: {},
    },
  });

  return {
    shoppingList: mapShoppingList(data),
    loading: isLoading,
    error: error as Error | null,
  };
};

const useNextSortOrder = () => {
  const { shoppingList } = useShoppingList();
  const maxSortOrder = Math.max(
    ...shoppingList.map((item) => item.sortOrder),
    0
  );
  return maxSortOrder + 1;
};

export const useCreateShoppingListItem = () => {
  const nextSortOrder = useNextSortOrder();

  return (name: string, owner: string) => {
    const shopListItemId = id();

    db.transact([
      db.tx.items[lookup("nameAndUserId", `${name}:${owner}`)]
        .update({ name, createdAt: new Date() })
        .link({ shopListItems: [shopListItemId] })
        .link({ owner }),
      db.tx.shopListItems[shopListItemId]
        .update({
          sortOrder: nextSortOrder,
          quantity: 1,
          createdAt: new Date(),
        })
        .link({ owner }),
    ]);
  };
};

const updateShopListItemProperty = (updateObj: UpdateParams<AppSchema, "shopListItems">) => (itemId: string) => {
    db.transact([
      db.tx.shopListItems[lookup("id", itemId)].update(
        updateObj,
        { upsert: false }
      ),
    ]);
  };

export const useCheckShoppingListItem = () => 
    updateShopListItemProperty({ checkedAt: new Date() })
  
export const useUncheckShoppingListItem = () => 
    updateShopListItemProperty({ checkedAt: null })

export const useDeleteShoppingListItem = () => 
   updateShopListItemProperty({ deletedAt: new Date() });

export const useUpdateShoppingListOrder = () => {
  return (itemId: string, newSortOrder: number) => {
    updateShopListItemProperty({ sortOrder: newSortOrder })(itemId);
  };
};

  