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
import Templates from '../templates/Templates';

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

  if (!user) {
    return (
      <Box minH="100vh" bg="bg.primary" py={8}>
        <LoginForm />
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="bg.primary">
      <Flex 
        justify="space-between" 
        align="center" 
        p={6} 
        bg="surface.primary"
        boxShadow="0 4px 8px rgba(0,0,0,0.1)"
        mb={6}
      >
        <Heading size="lg" color="text.primary">Welcome, {user.email}!</Heading>
        <Button
          onClick={signOut}
          size="md"
          bg="surface.primary"
          color="text.primary"
          boxShadow="neuomorphic"
          _hover={{
            boxShadow: "neuomorphicHover",
            transform: "translateY(-2px)"
          }}
          _active={{
            boxShadow: "neuomorphicInset",
            transform: "translateY(0px)"
          }}
          borderRadius="xl"
          border="none"
          transition="all 0.2s ease-in-out"
        >
          Sign Out
        </Button>
      </Flex>
      <Templates />
    </Box>
  );
}

export default App;
