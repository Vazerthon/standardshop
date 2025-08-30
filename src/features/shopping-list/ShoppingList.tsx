
import SharedItemList from "../components/SharedItemList";
import {
  useShoppingList,
  useCreateShoppingListItem,
  useUpdateShoppingListOrder,
  useDeleteShoppingListItem,
  useCheckShoppingListItem,
  useUncheckShoppingListItem,
  useUpdateShoppingListItemQuantity,
} from "./useShoppingList";

const ShoppingList: React.FC = () => {
  const { shoppingList, loading, error } = useShoppingList();
  const createItem = useCreateShoppingListItem();
  const updateOrder = useUpdateShoppingListOrder();
  const deleteItem = useDeleteShoppingListItem();
  const checkItem = useCheckShoppingListItem();
  const uncheckItem = useUncheckShoppingListItem();
  const updateItemQuantity = useUpdateShoppingListItemQuantity();

  const { checkedItems, uncheckedItems } = shoppingList;

  return (
    <SharedItemList
      uncheckedItems={uncheckedItems}
      checkedItems={checkedItems}
      loading={loading}
      error={error}
      onUpdateQuantity={updateItemQuantity}
      onCheckItem={checkItem}
      onUncheckItem={uncheckItem}
      onDeleteItem={deleteItem}
      onAddItem={createItem}
      updateOrder={updateOrder}
    />
  );
};

export default ShoppingList;
