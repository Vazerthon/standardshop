import { useEffect, useState } from "react";
import { Flex, Switch } from "@chakra-ui/react";
import { useSetExtraContentRenderFunction } from "../app/useMenuBarStore";
import SharedItemList from "../components/SharedItemList";
import {
  useShoppingList,
  useCreateShoppingListItem,
  useUpdateShoppingListOrder,
  useDeleteShoppingListItem,
  useCheckShoppingListItem,
  useUncheckShoppingListItem,
  useUpdateShoppingListItemQuantity,
  useDeleteShoppingListItems,
} from "./useShoppingList";
import Icons from "../components/Icons";
import { useItemNames } from "../history/useItems";

const ShoppingList: React.FC = () => {
  const { shoppingList, loading, error } = useShoppingList();
  const createItem = useCreateShoppingListItem();
  const updateOrder = useUpdateShoppingListOrder();
  const deleteItem = useDeleteShoppingListItem();
  const deleteCheckedItems = useDeleteShoppingListItems();
  const checkItem = useCheckShoppingListItem();
  const uncheckItem = useUncheckShoppingListItem();
  const updateItemQuantity = useUpdateShoppingListItemQuantity();
  const setExtraContentRenderFunction = useSetExtraContentRenderFunction();
  const { items: autocompleteItems } = useItemNames();
  const [locked, setLocked] = useState(false);

  const onDeleteCheckedItems = !locked ? () => {
    const { checkedItems } = shoppingList;
    const checkedItemIds = checkedItems.map(item => item.id);
    deleteCheckedItems(checkedItemIds);
  } : undefined;

  useEffect(() => {
    setExtraContentRenderFunction(() => (
      <Flex color="text.secondary" gap={4}>
        <Icons.Edit />
        <Switch.Root checked={locked}
            onCheckedChange={() => setLocked(!locked)}>
          <Switch.HiddenInput />
          <Switch.Control boxShadow="neuomorphicLarge">
            <Switch.Thumb boxShadow="neuomorphicLarge" />
          </Switch.Control>
        </Switch.Root>
        <Icons.Lock />
      </Flex>
    ));
    return () => setExtraContentRenderFunction(undefined);
  }, [setExtraContentRenderFunction, locked, setLocked]);

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
      showCheckedItems
      allowCheckboxChange
      allowQuantityChange={!locked}
      allowReordering={!locked}
      allowDeleteItems={!locked}
      autocompleteItems={autocompleteItems}
      onDeleteCheckedItems={onDeleteCheckedItems}
    />
  );
};

export default ShoppingList;
