export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  sortOrder: number;
} 

export interface Item {
  id: string;
  name: string;
}

export interface ShopListItemCreate {
  id: string;
  quantity: number;
  sortOrder: number;
  itemId: Item['id'];
}