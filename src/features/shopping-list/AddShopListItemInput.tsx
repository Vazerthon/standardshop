import React, { useState } from 'react';
import NeuomorphicInput from '@/components/NeuomorphicInput';

const AddShopListItemInput: React.FC = () => {
  const [newItemName, setNewItemName] = useState('');

  const handleCreateItem = async () => {
    if (!newItemName.trim()) return;

    try {
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