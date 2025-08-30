import React from "react";
import { Box, BoxProps, Flex, Text } from "@chakra-ui/react";
import NeuomorphicCheckbox from "../components/NeuomorphicCheckbox";
import { transitions } from "@/theme";
import { useUpdateShoppingListItemQuantity, type ShoppingListItem } from "./useShoppingList";
import {
  useCheckShoppingListItem,
  useUncheckShoppingListItem,
  useDeleteShoppingListItem,
} from "./useShoppingList";
import NeuomorphicButton from "@/features/components/NeuomorphicButton";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import NumberStepper from "./NumberStepper";
import Icons from "@/features/components/icons";

export interface ShoppingListItemProps extends BoxProps {
  item: ShoppingListItem;
  dragHandleProps?: {
    attributes: DraggableAttributes;
    listeners: SyntheticListenerMap | undefined;
  };
  allowQuantityChange?: boolean;
  allowCheckboxChange?: boolean;
}

const ShoppingListItem: React.FC<ShoppingListItemProps> = ({
  item,
  dragHandleProps,
  allowQuantityChange,
  allowCheckboxChange,
  ...boxProps
}) => {
  const checkItem = useCheckShoppingListItem();
  const uncheckItem = useUncheckShoppingListItem();
  const deleteItem = useDeleteShoppingListItem();
  const updateQuantity = useUpdateShoppingListItemQuantity();

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
      mb={2}
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
        {dragHandleProps && (
          <Text
            color="text.secondary"
            touchAction="none"
            cursor="grab"
            _active={{ cursor: "grabbing" }}
            _hover={{ opacity: 1 }}
            fontSize="lg"
            fontWeight="bold"
            userSelect="none"
            {...dragHandleProps?.attributes}
            {...dragHandleProps?.listeners}
          >
            <Icons.Drag />
          </Text>
        )}
        {allowCheckboxChange && (
          <NeuomorphicCheckbox
            checked={!!item.checkedAt}
            onCheckedChange={handleCheckboxChange}
          />
        )}
        <Text fontSize="md" color="text.primary" fontWeight="medium" flex={1}>
          {item.name}
        </Text>
        {allowQuantityChange && (
          <NumberStepper
            value={item.quantity}
            onChange={(value: number) => updateQuantity(item.id, value)}
          />
        )}
        <NeuomorphicButton
          maxW={2}
          onClick={handleDeleteItem}
          aria-label={`Delete ${item.name}`}
        >
          <Icons.Trash />
        </NeuomorphicButton>
      </Flex>
    </Box>
  );
};

export default ShoppingListItem;
