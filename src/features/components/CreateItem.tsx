import React, { useState } from 'react';
import NeuomorphicInput from '@/features/components/NeuomorphicInput';
import { useCurrentUser } from '../auth/useAuthStore';
import { Flex } from '@chakra-ui/react';
import NeuomorphicButton from './NeuomorphicButton';
import Icons from './Icons';

interface CreateItemProps {
  onAddItem: (itemName: string, userId: string) => void;
  inputFieldPlaceholder: string;
  buttonAriaLabel: string;
}

const CreateItem: React.FC<CreateItemProps> = ({
  onAddItem,
  inputFieldPlaceholder,
  buttonAriaLabel,
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
          placeholder={inputFieldPlaceholder}
          mr={2}
          onChange={(e) => setNewItemName(e.target.value)}
          value={newItemName}
        />
        <NeuomorphicButton
          type="submit"
          disabled={!newItemName.trim()}
          aria-label={buttonAriaLabel}
          borderRadius="full"
          w={2}
        >
          <Icons.Plus />
        </NeuomorphicButton>
      </Flex>
    </form>
  );
};

export default CreateItem;