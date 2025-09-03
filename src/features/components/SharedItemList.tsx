import {
  Box,
  Container,
  Text,
  Center,
  Spinner,
  Accordion,
} from "@chakra-ui/react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SharedListItem, { SharedListItemProps } from "./SharedListItem";
import CreateItem from "./CreateItem";

const SortableSharedListItem: React.FC<SharedListItemProps> = ({
  item,
  ...props
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  return (
    <Box
      ref={setNodeRef}
      transform={CSS.Transform.toString(transform)}
      transition={transition}
    >
      <SharedListItem
        item={item}
        dragHandleProps={{ attributes, listeners }}
        {...props}
      />
    </Box>
  );
};

export interface SharedListItemType {
  id: string;
  itemId: string;
  name: string;
  quantity: number;
  sortOrder?: number;
  checkedAt?: Date | null;
}

interface SharedItemListProps {
  uncheckedItems: SharedListItemType[];
  checkedItems?: SharedListItemType[];
  showCheckedItems?: boolean;
  loading?: boolean;
  error?: Error | null;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onCheckItem?: (itemId: string) => void;
  onUncheckItem?: (itemId: string) => void;
  allowCheckboxChange?: boolean;
  onDeleteItem: (itemId: string) => void;
  onAddItem: (itemName: string, userId: string) => void;
  updateOrder: (itemId: string, newSortOrder: number) => void;
  allowReordering?: boolean;
  allowQuantityChange?: boolean;
  allowDeleteItems?: boolean;
  autocompleteItems?: { id: string; label: string; value: string }[];
}

const SharedItemList: React.FC<SharedItemListProps> = ({
  uncheckedItems,
  checkedItems,
  loading,
  error,
  onUpdateQuantity,
  onCheckItem,
  onUncheckItem,
  onDeleteItem,
  onAddItem,
  updateOrder,
  showCheckedItems,
  allowCheckboxChange,
  allowReordering,
  allowQuantityChange,
  allowDeleteItems,
  autocompleteItems,
}) => {
  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = uncheckedItems.findIndex(
        (item) => item.id === active.id
      );
      const newIndex = uncheckedItems.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(uncheckedItems, oldIndex, newIndex);

        // Update sort order for all affected items
        newOrder.forEach((item, index) => {
          const newSortOrder = index + 1;
          if (item.sortOrder !== newSortOrder) {
            updateOrder(item.id, newSortOrder);
          }
        });
      }
    }
  };

  if (loading) {
    return (
      <Center minH="100vh">
        <Spinner size="lg" color="accent.primary" />
      </Center>
    );
  }

  const shouldShowCheckedItems =
    showCheckedItems && checkedItems && checkedItems.length > 0;

  return (
    <Container p={2}>
      {error && (
        <Box p={4} mt={4} borderRadius="xl" boxShadow="neuomorphicInset">
          <Text fontSize="sm" color="text.primary">
            {error.message}
          </Text>
        </Box>
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[
          restrictToVerticalAxis,
          restrictToWindowEdges,
          restrictToParentElement,
        ]}
      >
        {uncheckedItems.length === 0 && (
          <Text fontSize="sm" color="text.secondary" textAlign="center" my={4}>
            No items to display. Add some items to get started!
          </Text>
        )}
        <SortableContext
          items={uncheckedItems.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {uncheckedItems.map((item) => (
            <SortableSharedListItem
              key={item.id}
              item={item}
              allowQuantityChange={allowQuantityChange}
              allowCheckboxChange={allowCheckboxChange}
              onCheckItem={onCheckItem}
              onUncheckItem={onUncheckItem}
              onDeleteItem={onDeleteItem}
              onUpdateQuantity={onUpdateQuantity}
              allowDelete={allowDeleteItems}
              allowDrag={allowReordering}
            />
          ))}
        </SortableContext>
      </DndContext>
      <CreateItem
        onAddItem={onAddItem}
        inputFieldPlaceholder="Add list item"
        buttonAriaLabel="Add list item"
        autocompleteItems={autocompleteItems}
      />
      {shouldShowCheckedItems && (
        <Accordion.Root collapsible>
          <Accordion.Item key="checked-items" value="checked-items">
            <Accordion.ItemTrigger>
              <Text
                fontSize="md"
                fontWeight="bold"
                mt={4}
                color="text.secondary"
              >
                Checked Items ({checkedItems.length})
              </Text>
            </Accordion.ItemTrigger>
            <Accordion.ItemContent overflow="unset">
              {checkedItems.map((item) => (
                <SharedListItem
                  key={item.id}
                  item={item}
                  allowCheckboxChange={allowCheckboxChange}
                  onCheckItem={onCheckItem}
                  onUncheckItem={onUncheckItem}
                  onDeleteItem={onDeleteItem}
                  onUpdateQuantity={onUpdateQuantity}
                />
              ))}
            </Accordion.ItemContent>
          </Accordion.Item>
        </Accordion.Root>
      )}
    </Container>
  );
};

export default SharedItemList;
