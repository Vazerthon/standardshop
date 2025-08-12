import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Stack,
  Text,
  Center,
  Spinner,
} from '@chakra-ui/react';
import { useShoppingListItems, useShoppingListLoading, useShoppingListMessage, useShoppingListFetch } from './useShoppingListStore';
import ShoppingListItem from './ShoppingListItem';
import AddShopListItemInput from './AddShopListItemInput';

const ShoppingList: React.FC = () => {
  const items = useShoppingListItems();
  const loading = useShoppingListLoading();
  const message = useShoppingListMessage();
  const fetchShoppingListItems = useShoppingListFetch();

  useEffect(() => {
    fetchShoppingListItems();
  }, [fetchShoppingListItems]);

  if (loading) {
    return (
      <Center minH="100vh">
        <Stack direction="column" align="center">
          <Spinner size="lg" color="accent.primary" />
        </Stack>
      </Center>
    );
  }

  return (
    <Container p={2}>
      {message && (
        <Box 
          p={4}
          mt={4}
          borderRadius="xl" 
          boxShadow="neuomorphicInset"
        >
          <Text fontSize="sm" color="text.error">
            {message}
          </Text>
        </Box>
      )}
      <Stack direction="column" gap={3} mt={4}>
        {Object.values(items).map((item) => (
          <ShoppingListItem key={item.id} item={item} />
        ))}
        <AddShopListItemInput />
      </Stack>
    </Container>
  );
};

export default ShoppingList; 