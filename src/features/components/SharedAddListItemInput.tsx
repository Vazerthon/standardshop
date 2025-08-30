import React, { useState } from 'react';
import NeuomorphicInput from '@/features/components/NeuomorphicInput';
import { useCurrentUser } from '../auth/useAuthStore';

interface SharedAddListItemInputProps {
  onAddItem: (itemName: string, userId: string) => void;
}

const SharedAddListItemInput: React.FC<SharedAddListItemInputProps> = ({
  onAddItem,
}) => {
  const user = useCurrentUser();
  const [newItemName, setNewItemName] = useState('');

  const handleCreateItem = () => {
    if (!newItemName.trim()) return;
    
    try {
      onAddItem(newItemName, user.id);
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

export default SharedAddListItemInput;