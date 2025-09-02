import {
  Box,
  Text,
  Flex,
  Heading,
} from '@chakra-ui/react';
import { Template } from './useTemplates';
import { transitions } from '@/theme';
import NeuomorphicButton from '../components/NeuomorphicButton';
import Icons from '@/features/components/Icons';
import { useInsertAllItemsFromTemplate, useNextSortOrder } from '../shopping-list/useShoppingList';
import { useCurrentUser } from '../auth/useAuthStore';

interface TemplateListItemProps {
  template: Template;
}

const TemplateListItem: React.FC<TemplateListItemProps> = ({ template }) => {
  const insertItemsFromTemplate = useInsertAllItemsFromTemplate();

  const items = template.items.flatMap(item => ({
    itemId: item.itemId,
    quantity: item.quantity,
  }));

  const owner = useCurrentUser();
  const sortOrder = useNextSortOrder();

  return (

    <Box
      width="100%"
      p={2}
      bg="surface.primary"
      borderRadius="xl"
      overflow="hidden"
      boxShadow="neuomorphic"
      _hover={{
        boxShadow: "neuomorphicHover",
        transform: "translateY(-4px)"
      }}
      transition={transitions.default}
    >
      <Flex justify="space-between" align="center" pb={1}>
        <Heading flexGrow={1} size="md" color="text.primary">{template.name}</Heading>
        <>
          <Text mr={2} fontWeight="medium" fontSize="sm" color="text.secondary">
            Items ({template.items.length})
          </Text>

          <NeuomorphicButton
            onClick={() => insertItemsFromTemplate(owner.id, items, sortOrder)}
            aria-label="Insert template into shopping list"
            borderRadius="full"
            width={2}
          >
            <Icons.Insert />
          </NeuomorphicButton>
        </>
      </Flex>
    </Box>
  );
};

export default TemplateListItem;