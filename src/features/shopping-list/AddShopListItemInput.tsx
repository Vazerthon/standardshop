import React, { useEffect, useState } from 'react';
import {} from '@chakra-ui/react';
import { useItemsFetch } from './useItemsStore';
import { useShoppingListAddItem } from './useShoppingListStore';
import NeuomorphicInput from '@/components/NeuomorphicInput';

const AddShopListItemInput: React.FC = () => {
  const fetchItems = useItemsFetch();

  const [newItemName, setNewItemName] = useState('');

  const addShoppingListItem = useShoppingListAddItem(newItemName.trim());

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleCreateItem = async () => {
    if (!newItemName.trim()) return;

    try {
      await addShoppingListItem();
      setNewItemName('');
    } catch (error) {
      console.error('Error adding item:', error);
    }
  }

  return (
    <NeuomorphicInput
      placeholder="Add a new item"
      size="lg"
      value={newItemName}
      onBlur={() => handleCreateItem()}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleCreateItem();
        }
      }}
      onChange={(e) => setNewItemName(e.target.value)}
    />
  );
};

export default AddShopListItemInput; 