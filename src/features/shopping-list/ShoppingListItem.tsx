import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import NeuomorphicCheckbox from "../../components/NeuomorphicCheckbox";
import { transitions } from "@/theme";
import { type ShoppingListItem } from "./useShoppingList";
import {
  useCheckShoppingListItem,
  useUncheckShoppingListItem,
} from "./useShoppingList";

interface ShoppingListItemProps {
  item: ShoppingListItem;
}

const ShoppingListItem: React.FC<ShoppingListItemProps> = ({ item }) => {
  const checkItem = useCheckShoppingListItem();
  const uncheckItem = useUncheckShoppingListItem();

  const handleCheckboxChange = () => {
    if (item.checkedAt) {
      uncheckItem(item.id);
    } else {
      checkItem(item.id);
    }
  };

  return (
    <Box
      width="100%"
      p={3}
      bg="surface.primary"
      borderRadius="xl"
      boxShadow="neuomorphic"
      _hover={{
        boxShadow: "neuomorphicHover",
        transform: "translateY(-2px)",
      }}
      transition={transitions.default}
    >
      <Flex align="center" gap={3}>
        <NeuomorphicCheckbox
          checked={!!item.checkedAt}
          onCheckedChange={handleCheckboxChange}
        />
        <Text fontSize="md" color="text.primary" fontWeight="medium" flex={1}>
          {item.name}({item.sortOrder})
        </Text>
      </Flex>
    </Box>
  );
};

export default ShoppingListItem;
