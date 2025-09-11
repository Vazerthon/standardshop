import React, { useState } from 'react';
import NeuomorphicInput from '@/features/components/NeuomorphicInput';
import { useCurrentUser } from '../auth/useAuthStore';
import { Flex } from '@chakra-ui/react';
import NeuomorphicButton from './NeuomorphicButton';
import Icons from './Icons';
import ItemsAutocomplete from './ItemsAutocomplete';

interface CreateItemProps {
  onAddItem: (itemName: string, userId: string) => void;
  inputFieldPlaceholder: string;
  buttonAriaLabel: string;
  autocompleteItems?: { id: string; label: string; value: string }[];
}

const CreateItem: React.FC<CreateItemProps> = ({
  onAddItem,
  inputFieldPlaceholder,
  buttonAriaLabel,
  autocompleteItems,
}) => {
  const user = useCurrentUser();
  const [newItemName, setNewItemName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    onAddItem(newItemName, user.id);
    setNewItemName('');
  };

  const canAutocomplete = autocompleteItems && autocompleteItems?.length > 0;

  return (
    <form onSubmit={handleSubmit}>
      <Flex>
        {!canAutocomplete && (
          <NeuomorphicInput
            placeholder={inputFieldPlaceholder}
            mr={2}
            onChange={(e) => setNewItemName(e.target.value)}
            value={newItemName}
          />
        )}
        {canAutocomplete && (
          <ItemsAutocomplete
            autocompleteItems={autocompleteItems}
            onChange={setNewItemName}
            placeholder={inputFieldPlaceholder}
            value={newItemName}
          />
        )}
        <NeuomorphicButton
          type="submit"
          disabled={!newItemName.trim()}
          aria-label={buttonAriaLabel}
          variant="circular-raised"
        >
          <Icons.Plus />
        </NeuomorphicButton>
      </Flex>
    </form>
  );
};

export default CreateItem;