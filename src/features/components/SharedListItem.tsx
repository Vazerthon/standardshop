import React from "react";
import { Box, BoxProps, Flex, Text } from "@chakra-ui/react";
import NeuomorphicCheckbox from "../components/NeuomorphicCheckbox";
import { transitions } from "@/theme";

import NeuomorphicButton from "@/features/components/NeuomorphicButton";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import Icons from "@/features/components/icons";
import NumberStepper from "./NumberStepper";
import { SharedListItemType } from "./SharedItemList";

export interface SharedListItemProps extends BoxProps {
  item: SharedListItemType;
  dragHandleProps?: {
    attributes: DraggableAttributes;
    listeners: SyntheticListenerMap | undefined;
  };
  allowQuantityChange?: boolean;
  allowCheckboxChange?: boolean;
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
  onCheckItem?: (itemId: string) => void;
  onUncheckItem?: (itemId: string) => void;
  onDeleteItem?: (itemId: string) => void;
}

const SharedListItem: React.FC<SharedListItemProps> = ({
  item,
  dragHandleProps,
  allowQuantityChange,
  allowCheckboxChange,
  onUpdateQuantity,
  onCheckItem,
  onUncheckItem,
  onDeleteItem,
  ...boxProps
}) => {
  const handleCheckboxChange = () => {
    if (item.checkedAt) {
      onUncheckItem?.(item.id);
    } else {
      onCheckItem?.(item.id);
    }
  };

  const handleDeleteItem = () => {
    onDeleteItem?.(item.id);
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
            onChange={(value: number) => onUpdateQuantity?.(item.id, value)}
          />
        )}
        <NeuomorphicButton
          onClick={handleDeleteItem}
          aria-label={`Delete ${item.name}`}
          borderRadius="full"
          width={2}
        >
          <Icons.Trash />
        </NeuomorphicButton>
      </Flex>
    </Box>
  );
};

export default SharedListItem;
