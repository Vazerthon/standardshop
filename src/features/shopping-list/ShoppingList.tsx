import {
  Box,
  Container,
  Text,
  Center,
  Spinner,
} from '@chakra-ui/react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ShoppingListItem from './ShoppingListItem';
import AddShopListItemInput from './AddShopListItemInput';
import { type ShoppingListItem as ShopListItemType, useShoppingList, useUpdateShoppingListOrder } from './useShoppingList';

const SortableShoppingListItem: React.FC<{ item: ShopListItemType }> = ({ item }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <ShoppingListItem item={item} dragHandleProps={{ attributes, listeners }} />
    </div>
  );
};

const ShoppingList: React.FC = () => {
  const { shoppingList, loading, error } = useShoppingList();
  const updateOrder = useUpdateShoppingListOrder();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = shoppingList.findIndex(item => item.id === active.id);
      const newIndex = shoppingList.findIndex(item => item.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(shoppingList, oldIndex, newIndex);
        
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
        <Box 
          p={4}
          mt={4}
          borderRadius="xl" 
          boxShadow="neuomorphicInset"
        >
          <Text fontSize="sm" color="text.error">
            {error.message}
          </Text>
        </Box>
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={shoppingList.map(item => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
            {shoppingList.map((item) => (
              <SortableShoppingListItem key={item.id} item={item} />
            ))}
            <AddShopListItemInput />
          </div>
        </SortableContext>
      </DndContext>
    </Container>
  );
};

export default ShoppingList; 