import {
  Box,
  Flex,
} from '@chakra-ui/react';
import { db } from "@/lib/db";
import LoginForm from '../auth/LoginForm';
import { useAuthLoading, useAuthSignOut } from '../auth/useAuthStore';
import NeuomorphicButton from '../components/NeuomorphicButton';
import { Drawer } from '../components/Drawer';
import Router, { BrowserRouter, Navigation } from './Router';
import { MenuBar } from './MenuBar';
import TemplateList from '../templates/TemplateList';
import LoadingSpinner from '../components/LoadingSpinner';
import ConnectionIndicator from './ConectionIndicator';

function App() {
  const loading = useAuthLoading();
  const signOut = useAuthSignOut();

  if (loading) {
    return (
      <LoadingSpinner />
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
                <>
                  <Navigation />
                  <TemplateList />
                </>
                <Flex w="100%" align="center" justify="space-between">
                  <ConnectionIndicator />
                  <NeuomorphicButton
                    onClick={signOut}
                    size="md"
                  >
                    Sign Out
                  </NeuomorphicButton>
                </Flex>
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
