import { transitions } from '@/theme';
import {
  Box,
  IconButton,
  Drawer as ChakraDrawer,
} from '@chakra-ui/react';

export const Drawer: React.FC = () => {
  return (
    <Box
      position="fixed"
      bottom={6}
      left={6}
    >
      <ChakraDrawer.Root placement="start">
        <ChakraDrawer.Trigger asChild>
          <IconButton
            aria-label="Open drawer"
            size="lg"
            borderRadius="full"
            bg="surface.primary"
            color="text.primary"
            boxShadow="neuomorphicLarge"
            _hover={{
              boxShadow: 'neuomorphicHover',
              transform: 'scale(1.05)',
            }}
            _active={{
              boxShadow: 'neuomorphicInset',
              transform: 'scale(0.95)',
            }}
            transition={transitions.default}
          >
            <Box as="span" fontSize="lg">☰</Box>
          </IconButton>
        </ChakraDrawer.Trigger>
        
        <ChakraDrawer.Backdrop />
        <ChakraDrawer.Positioner>
          <ChakraDrawer.Content bg="surface.primary" boxShadow="neuomorphicLarge">
            <ChakraDrawer.CloseTrigger asChild>
              <IconButton
                aria-label="Close drawer"
                size="sm"
                borderRadius="full"
                bg="surface.primary"
                color="text.primary"
                boxShadow="neuomorphic"
                _hover={{ bg: 'bg.primary' }}
                _active={{ boxShadow: 'neuomorphicInset' }}
              >
                <Box as="span" fontSize="lg">×</Box>
              </IconButton>
            </ChakraDrawer.CloseTrigger>
            <ChakraDrawer.Header borderBottomWidth="1px" borderColor="bg.primary">
              <ChakraDrawer.Title color="text.primary">Menu</ChakraDrawer.Title>
            </ChakraDrawer.Header>
            <ChakraDrawer.Body>
              {/* Drawer content will go here */}
            </ChakraDrawer.Body>
          </ChakraDrawer.Content>
        </ChakraDrawer.Positioner>
      </ChakraDrawer.Root>
    </Box>
  );
};

export default Drawer; 