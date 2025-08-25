import { db, id, lookup } from "@/lib/db";

export interface ShoppingListItem {
  id: string;
  itemId: string;
  name: string;
  quantity: number;
  sortOrder: number;
}

const mapShoppingList = (data: any): ShoppingListItem[] => {
  return data?.shopListItem.map((item: any) => ({
    id: item.id,
    itemId: item?.item.id,
    name: item?.item.name,
    quantity: item?.quantity,
    sortOrder: item?.sortOrder
  })) || [];
};

export const useShoppingList = () => {
  const { isLoading, error, data } = db.useQuery({
    shopListItem: {
      item: {}
    }
  });

  return {
    shoppingList: mapShoppingList(data),
    loading: isLoading,
    error: error as Error | null,
  };
};

const useNextSortOrder = () => {
  const { shoppingList } = useShoppingList();
  const maxSortOrder = Math.max(...shoppingList.map(item => item.sortOrder), 0);
  return maxSortOrder + 1;
}
export const useAddShoppingListItem = () => {
  const nextSortOrder = useNextSortOrder();

  return (name: string) => {
    const shopListItemId = id();

    db.transact([
      db.tx.item[lookup('name', name)]
        .update({ createdAt: new Date() })
        .link({ shopListItems: [shopListItemId] }),
      db.tx.shopListItem[shopListItemId].update({ sortOrder: nextSortOrder }),
    ]);
  };
};