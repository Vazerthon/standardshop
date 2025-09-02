import {
  Box,
  Drawer as ChakraDrawer,
} from '@chakra-ui/react';
import NeuomorphicButton from './NeuomorphicButton';
import Icons from './icons';

interface DrawerProps {
  children: [React.ReactNode, React.ReactNode];
}

export const Drawer: React.FC<DrawerProps> = ({ children }) => {
  const [body, footer] = children;
  return (
      <ChakraDrawer.Root placement="start">
        <ChakraDrawer.Trigger asChild>
          <NeuomorphicButton
            aria-label="Open drawer"
            borderRadius="full"
            width={10}
          >
            <Icons.Menu />
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
                width={2}
              >
                <Box as="span" fontSize="lg"><Icons.Close /></Box>
              </NeuomorphicButton>
            </ChakraDrawer.CloseTrigger>
            <ChakraDrawer.Header borderBottomWidth="1px" borderColor="bg.primary">
              <ChakraDrawer.Title color="text.primary">Menu</ChakraDrawer.Title>
            </ChakraDrawer.Header>
            <ChakraDrawer.Body p={1}>
              {body}
            </ChakraDrawer.Body>
            <ChakraDrawer.Footer borderTopWidth="1px" borderColor="bg.primary">
              {footer}
            </ChakraDrawer.Footer>
          </ChakraDrawer.Content>
        </ChakraDrawer.Positioner>
      </ChakraDrawer.Root>
  );
};

export default Drawer; 