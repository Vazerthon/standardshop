import {
  Box,
  Drawer as ChakraDrawer,
  type DrawerBodyProps,
} from '@chakra-ui/react';
import NeuomorphicButton from './NeuomorphicButton';

export const Drawer: React.FC<DrawerBodyProps> = ({ children, ...rest }) => {
  return (
      <ChakraDrawer.Root placement="start">
        <ChakraDrawer.Trigger asChild bottom={6} left={6 } position="fixed">
          <NeuomorphicButton
            aria-label="Open drawer"
            borderRadius="full"
            width="3rem"
            height="3rem"
            variant="raised"
          >
            <Box as="span" fontSize="lg">☰</Box>
          </NeuomorphicButton>
        </ChakraDrawer.Trigger>
        
        <ChakraDrawer.Backdrop />
        <ChakraDrawer.Positioner>
          <ChakraDrawer.Content bg="surface.primary" boxShadow="neuomorphicLarge">
            <ChakraDrawer.CloseTrigger asChild>
              <NeuomorphicButton
                aria-label="Close drawer"
                borderRadius="full"
                variant="raised"
                width="3rem"
                height="3rem"
              >
                <Box as="span" fontSize="lg">×</Box>
              </NeuomorphicButton>
            </ChakraDrawer.CloseTrigger>
            <ChakraDrawer.Header borderBottomWidth="1px" borderColor="bg.primary">
              <ChakraDrawer.Title color="text.primary">Menu</ChakraDrawer.Title>
            </ChakraDrawer.Header>
            <ChakraDrawer.Body p={1} {...rest}>
              {children}
            </ChakraDrawer.Body>
          </ChakraDrawer.Content>
        </ChakraDrawer.Positioner>
      </ChakraDrawer.Root>
  );
};

export default Drawer; 