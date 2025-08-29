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
import ShoppingListItem from "./ShoppingListItem";
import AddShopListItemInput from "./AddShopListItemInput";
import {
  type ShoppingListItem as ShopListItemType,
  useShoppingList,
  useUpdateShoppingListOrder,
} from "./useShoppingList";

const SortableShoppingListItem: React.FC<{ item: ShopListItemType }> = ({
  item,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  return (
    <Box
      ref={setNodeRef}
      transform={CSS.Transform.toString(transform)}
      transition={transition}
    >
      <ShoppingListItem
        item={item}
        dragHandleProps={{ attributes, listeners }}
      />
    </Box>
  );
};

const ShoppingList: React.FC = () => {
  const { shoppingList, loading, error } = useShoppingList();
  const updateOrder = useUpdateShoppingListOrder();

  const { checkedItems, uncheckedItems } = shoppingList;

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

  return (
    <Container p={2}>
      {error && (
        <Box p={4} mt={4} borderRadius="xl" boxShadow="neuomorphicInset">
          <Text fontSize="sm" color="text.error">
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
        <SortableContext
          items={uncheckedItems.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {uncheckedItems.map((item) => (
            <SortableShoppingListItem key={item.id} item={item} />
          ))}
        </SortableContext>
      </DndContext>
      <AddShopListItemInput />
      <Accordion.Root collapsible>
        <Accordion.Item key="checked-items" value="checked-items">
          <Accordion.ItemTrigger>
            <Text fontSize="md" fontWeight="bold" mt={4} color="text.secondary">
              Checked Items ({checkedItems.length})
            </Text>
          </Accordion.ItemTrigger>
          <Accordion.ItemContent overflow="unset">
            {checkedItems.map((item) => (
              <ShoppingListItem key={item.id} item={item} />
            ))}
          </Accordion.ItemContent>
        </Accordion.Item>
      </Accordion.Root>
    </Container>
  );
};

export default ShoppingList;
