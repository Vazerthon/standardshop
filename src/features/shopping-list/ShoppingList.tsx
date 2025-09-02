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
} from "./useShoppingList";
import Icons from "../components/icons";

const ShoppingList: React.FC = () => {
  const { shoppingList, loading, error } = useShoppingList();
  const createItem = useCreateShoppingListItem();
  const updateOrder = useUpdateShoppingListOrder();
  const deleteItem = useDeleteShoppingListItem();
  const checkItem = useCheckShoppingListItem();
  const uncheckItem = useUncheckShoppingListItem();
  const updateItemQuantity = useUpdateShoppingListItemQuantity();
  const setExtraContentRenderFunction = useSetExtraContentRenderFunction();
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    setExtraContentRenderFunction(() => (
      <Flex color="text.secondary" gap={4}>
        <Icons.Edit />
        <Switch.Root>
          <Switch.HiddenInput
            checked={locked}
            onChange={() => setLocked(!locked)}
          />
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
    />
  );
};

export default ShoppingList;
