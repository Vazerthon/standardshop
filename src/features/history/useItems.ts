import { db } from "@/lib/db";
import { formatDistanceToNow, max } from "date-fns";
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
  purchaseCount: number;
  typicalPurchaseInterval?: string;
  typicalQuantity: number;
}

const distanceSinceLastPurchase = (items: ShoppingListItem[]) => {
  if (!items || items.length === 0) return undefined;
  const mostRecentPurchaseDate = max(
    items.map((item) => item.checkedAt).filter(Boolean) as Date[],
  );
  return formatDistanceToNow(mostRecentPurchaseDate, { addSuffix: true });
};

const getTypicalQuantity = (history: HistoryRecord[]) => {
  if (history.length === 0) return 0;
  const totalQuantity = history.reduce((sum, record) => sum + record.quantity, 0);
  return Math.round(totalQuantity / history.length);
};

const calculateTypicalPurchaseInterval = (history: HistoryRecord[]) => {
  if (history.length < 2) return undefined;
  const sortedHistory = history.sort((a, b) => a.purchaseDate.getTime() - b.purchaseDate.getTime());
  const intervals = sortedHistory.slice(1).map((record, index) => {
    const previousRecord = sortedHistory[index];
    return record.purchaseDate.getTime() - previousRecord.purchaseDate.getTime();
  });
  const averageInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
  const averageIntervalInDays = Math.round(averageInterval / (1000 * 60 * 60 * 24));
  return averageIntervalInDays;
};

const mapItemsWithHistory = (data: any): Item[] =>
  data?.items.map((item: any) => {
    const history = item?.shopListItems?.map((shopListItem: any) => ({
      id: shopListItem.id,
      purchaseDate: new Date(shopListItem.checkedAt),
      quantity: shopListItem.quantity,
    })) || [];

    return ({
      id: item.id,
      name: item?.name,
      distanceSinceLastPurchase: distanceSinceLastPurchase(item?.shopListItems),
      purchaseCount: item?.shopListItems?.length || 0,
      typicalPurchaseInterval: calculateTypicalPurchaseInterval(history),
      typicalQuantity: getTypicalQuantity(history),
      history,
    })
  }
  ) || [];

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
          /* @ts-ignore */
          order: { checkedAt: "desc" },
        },
      },
    },
  });

  const items = mapItemsWithHistory(data).filter(
    (item) => item.history.length > 0,
  );

  return {
    items,
    loading: isLoading,
    error: error as Error | null,
  };
};

export const useRenameItem = () => {
  return (itemId: string, name: string) => {
    db.transact(
      db.tx.items[itemId].update({ name }),
    );
  }
};

export const useItemNames = () => {
  const { isLoading, data, error } = db.useQuery({
    items: {
      $: {
        order: { name: "asc" },
      },
    },
  });

  return {
    items:
      data?.items.map((item: any) => ({
        id: item.id,
        label: item.name,
        value: item.name,
      })) || [],
    loading: isLoading,
    error: error as Error | null,
  };
};
