import React, { useState } from 'react';
import NeuomorphicInput from '@/components/NeuomorphicInput';
import { useAddShoppingListItem } from './useShoppingList';

const AddShopListItemInput: React.FC = () => {
  const addShoppingListItem = useAddShoppingListItem();
  const [newItemName, setNewItemName] = useState('');

  const handleCreateItem = () => {
    if (!newItemName.trim()) return;
    
    try {
      addShoppingListItem(newItemName);
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