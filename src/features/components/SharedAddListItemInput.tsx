import React, { useState } from 'react';
import NeuomorphicInput from '@/features/components/NeuomorphicInput';
import { useCurrentUser } from '../auth/useAuthStore';
import { Flex } from '@chakra-ui/react';
import NeuomorphicButton from './NeuomorphicButton';
import Icons from './icons';

interface SharedAddListItemInputProps {
  onAddItem: (itemName: string, userId: string) => void;
}

const SharedAddListItemInput: React.FC<SharedAddListItemInputProps> = ({
  onAddItem,
}) => {
  const user = useCurrentUser();
  const [newItemName, setNewItemName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    onAddItem(newItemName, user.id);
    setNewItemName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex>
        <NeuomorphicInput
          placeholder="Add list item"
          mr={2}
          onChange={(e) => setNewItemName(e.target.value)}
          value={newItemName}
        />
        <NeuomorphicButton
          type="submit"
          disabled={!newItemName.trim()}
          aria-label="Add list item"
          borderRadius="full"
          w={2}
        >
          <Icons.Plus />
        </NeuomorphicButton>
      </Flex>
    </form>
  );
};

export default SharedAddListItemInput;