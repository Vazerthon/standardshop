import {
  Box,
  Flex,
  Text,
  Center,
  Spinner,
} from '@chakra-ui/react';
import { db } from "@/lib/db";
import LoginForm from '../auth/LoginForm';
import { useAuthLoading, useAuthSignOut } from '../auth/useAuthStore';
import NeuomorphicButton from '../../components/NeuomorphicButton';
import { Drawer } from '../../components/Drawer';
import Templates from '../templates/Templates';
import ShoppingList from '../shopping-list/ShoppingList';
import UserEmail from './UserEmail';

function App() {
  const loading = useAuthLoading();
  const signOut = useAuthSignOut();

  if (loading) {
    return (
      <Center height="100vh" bg="bg.primary">
        <Flex
          direction="column"
          align="center"
          gap={6}
          p={8}
          bg="surface.primary"
          borderRadius="2xl"
          boxShadow="neuomorphicLarge"
        >
          <Spinner size="lg" color="accent.primary" />
          <Text fontSize="lg" color="text.secondary">Loading...</Text>
        </Flex>
      </Center>
    );
  }

  return (
    <>
      <db.SignedOut>
        <Box minH="100vh" bg="bg.primary" py={8}>
          <LoginForm />
        </Box>
      </db.SignedOut>
      <db.SignedIn>
        <Box minH="100vh" bg="bg.primary">
          <ShoppingList />
          <Drawer>
            <Templates />
            <>
              <UserEmail />
              <NeuomorphicButton
                onClick={signOut}
                size="md"
              >
                Sign Out
            </NeuomorphicButton>
            </>
          </Drawer>
        </Box>
      </db.SignedIn>
    </>
  );
}

export default App;
