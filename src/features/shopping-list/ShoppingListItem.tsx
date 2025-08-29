import React from "react";
import { Box, BoxProps, Flex, Text } from "@chakra-ui/react";
import NeuomorphicCheckbox from "../../components/NeuomorphicCheckbox";
import { transitions } from "@/theme";
import { type ShoppingListItem } from "./useShoppingList";
import {
  useCheckShoppingListItem,
  useUncheckShoppingListItem,
  useDeleteShoppingListItem,
} from "./useShoppingList";
import NeuomorphicButton from "@/components/NeuomorphicButton";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

interface ShoppingListItemProps extends BoxProps {
  item: ShoppingListItem;
  dragHandleProps?: {
    attributes: DraggableAttributes;
    listeners: SyntheticListenerMap | undefined;
  };
}

const ShoppingListItem: React.FC<ShoppingListItemProps> = ({
  item,
  dragHandleProps,
  ...boxProps
}) => {
  const checkItem = useCheckShoppingListItem();
  const uncheckItem = useUncheckShoppingListItem();
  const deleteItem = useDeleteShoppingListItem();

  const handleCheckboxChange = () => {
    if (item.checkedAt) {
      uncheckItem(item.id);
    } else {
      checkItem(item.id);
    }
  };

  const handleDeleteItem = () => {
    deleteItem(item.id);
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
      {...boxProps}
    >
      <Flex align="center" gap={3}>
        <Text
          color="text.secondary"
          touchAction="none"
          cursor="grab"
          _active={{ cursor: "grabbing" }}
          _hover={{ opacity: 1 }}
          fontSize="lg"
          fontWeight="bold"
          {...dragHandleProps?.attributes}
          {...dragHandleProps?.listeners}
        >
          ⋮⋮
        </Text>
        <NeuomorphicCheckbox
          checked={!!item.checkedAt}
          onCheckedChange={handleCheckboxChange}
        />
        <Text fontSize="md" color="text.primary" fontWeight="medium" flex={1}>
          {item.name}
        </Text>

        <NeuomorphicButton
          size="sm"
          onClick={handleDeleteItem}
          aria-label={`Delete ${item.name}`}
        >
          🗑
        </NeuomorphicButton>
      </Flex>
    </Box>
  );
};

export default ShoppingListItem;
