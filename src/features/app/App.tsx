import { useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Spinner,
  Center,
} from '@chakra-ui/react';
import LoginForm from '../auth/LoginForm';
import { useAuthUser, useAuthLoading, useAuthInitialize, useAuthSignOut } from '../auth/useAuthStore';

function App() {
  const user = useAuthUser();
  const loading = useAuthLoading();
  const initializeAuth = useAuthInitialize();
  const signOut = useAuthSignOut();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (loading) {
    return (
      <Center height="100vh">
        <Flex direction="column" align="center" gap={4}>
          <Spinner size="lg" />
          <Text fontSize="lg">Loading...</Text>
        </Flex>
      </Center>
    );
  }

  if (!user) {
    return (
      <Box>
        <LoginForm />
      </Box>
    );
  }

  return (
    <Box p={6}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Welcome, {user.email}!</Heading>
        <Button
          onClick={signOut}
          size="md"
        >
          Sign Out
        </Button>
      </Flex>
      <Text fontSize="lg">You are now logged in successfully!</Text>
    </Box>
  );
}

export default App;
