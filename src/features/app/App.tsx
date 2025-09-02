import {
  Box,
  Flex,
  Center,
  Spinner,
} from '@chakra-ui/react';
import { db } from "@/lib/db";
import LoginForm from '../auth/LoginForm';
import { useAuthLoading, useAuthSignOut } from '../auth/useAuthStore';
import NeuomorphicButton from '../components/NeuomorphicButton';
import { Drawer } from '../components/Drawer';
import UserEmail from './UserEmail';
import Router, { BrowserRouter, Navigation } from './Router';
import { MenuBar } from './MenuBar';

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
        <BrowserRouter>
          <Box pt={16}>
            <MenuBar>
              <Drawer>
                <Navigation />
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
            </MenuBar>
            <Box minH="100vh" bg="bg.primary">
              <Router />
            </Box>
          </Box>
        </BrowserRouter>
      </db.SignedIn>
    </>
  );
}

export default App;
