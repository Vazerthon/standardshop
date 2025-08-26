import React, { useState } from 'react';
import NeuomorphicInput from '@/components/NeuomorphicInput';
import { useCreateShoppingListItem } from './useShoppingList';
import { useCurrentUser } from '../auth/useAuthStore';

const AddShopListItemInput: React.FC = () => {
  const addShoppingListItem = useCreateShoppingListItem();
  const user = useCurrentUser();
  const [newItemName, setNewItemName] = useState('');

  const handleCreateItem = () => {
    if (!newItemName.trim()) return;
    
    try {
      addShoppingListItem(newItemName, user.id);
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