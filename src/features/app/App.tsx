import { useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Center,
  Spinner,
} from '@chakra-ui/react';
import LoginForm from '../auth/LoginForm';
import { useAuthUser, useAuthLoading, useAuthInitialize, useAuthSignOut } from '../auth/useAuthStore';
import NeuomorphicButton from '../../components/NeuomorphicButton';
import { Drawer } from '../../components/Drawer';
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
        align="center" 
        p={4} 
        bg="surface.primary"
        boxShadow="header"
        mb={2}
      >
        <Heading size="lg" color="text.primary">Welcome!</Heading>
      </Flex>
      
      <Drawer>
        <Templates />
        <NeuomorphicButton
          onClick={signOut}
          size="md"
        >
          Sign Out
        </NeuomorphicButton>
      </Drawer>
    </Box>
  );
}

export default App;
