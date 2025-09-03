import { db } from "@/lib/db";
import { formatDistanceToNow, max } from "date-fns"
import { ShoppingListItem } from "../shopping-list/useShoppingList";

interface HistoryRecord {
  id: string;
  purchaseDate: Date;
  quantity: number;
}

export interface Item {
  id: string;
  name: string;
  history: HistoryRecord[];
  distanceSinceLastPurchase?: string;
}

const distanceSinceLastPurchase = (items: ShoppingListItem[]) => {
  if (!items || items.length === 0) return undefined;
  const mostRecentPurchaseDate = max(items.map(item => item.checkedAt).filter(Boolean) as Date[]);
  return formatDistanceToNow(mostRecentPurchaseDate, { addSuffix: true });
};

const mapItemList = (data: any): Item[] => 
  data?.items.map((item: any) => ({
    id: item.id,
    name: item?.name,
    distanceSinceLastPurchase: distanceSinceLastPurchase(item?.shopListItems),
    history: item?.shopListItems?.map((shopListItem: any) => ({
      id: shopListItem.id,
      purchaseDate: new Date(shopListItem.checkedAt),
      quantity: shopListItem.quantity,
    })) || [],
  })) || [];

export const useItemHistory = () => {
  const { isLoading, error, data } = db.useQuery({
    items: {
      $: {
        order: { name: "asc" },
      },
      shopListItems: {
        $: {
          where: {
            checkedAt: { $isNull: false },
          },
          order: { checkedAt: "desc" },
        },
      },
    },
  });

  const items = mapItemList(data).filter((item) => item.history.length > 0);

  console.log("Mapped items:", items);

  return {
    items,
    loading: isLoading,
    error: error as Error | null,
  };
};
