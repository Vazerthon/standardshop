import {
  Box,
  Container,
  Stack,
  Text,
  Center,
  Spinner,
} from '@chakra-ui/react';
import ShoppingListItem from './ShoppingListItem';
import AddShopListItemInput from './AddShopListItemInput';
import { useShoppingList } from './useShoppingList';

const ShoppingList: React.FC = () => {
  const { shoppingList, loading, error } = useShoppingList();

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
      {error && (
        <Box 
          p={4}
          mt={4}
          borderRadius="xl" 
          boxShadow="neuomorphicInset"
        >
          <Text fontSize="sm" color="text.error">
            {error.message}
          </Text>
        </Box>
      )}
      <Stack direction="column" gap={3} mt={4}>
        {shoppingList.map((item) => (
          <ShoppingListItem key={item.id} item={item} />
        ))}
        <AddShopListItemInput />
      </Stack>
    </Container>
  );
};

export default ShoppingList; 