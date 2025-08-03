import React from 'react';
import {
  Box,
  Heading,
  Text,
  Stack,
  Badge,
} from '@chakra-ui/react';
import { TemplateWithItems } from './types';
import { transitions } from '@/theme';

interface TemplateItemProps {
  template: TemplateWithItems;
}

const TemplateItem: React.FC<TemplateItemProps> = ({ template }) => {
  return (
    <Box 
      width="100%" 
      bg="surface.primary"
      borderRadius="2xl" 
      overflow="hidden"
      boxShadow="neuomorphic"
      _hover={{
        boxShadow: "neuomorphicHover",
        transform: "translateY(-4px)"
      }}
      transition={transitions.default}
    >
      <Box p={6} borderBottom="1px" borderColor="neuomorphic.shadow">
        <Heading size="md" color="text.primary">{template.name}</Heading>
        <Text fontSize="sm" color="text.secondary" mt={2}>
          Created: {new Date(template.createdAt).toLocaleDateString()}
        </Text>
      </Box>
      
      <Box p={6}>
        <Stack direction="column" gap={4}>
          <Stack direction="row" justify="space-between">
            <Text fontWeight="medium" fontSize="sm" color="text.secondary">
              Items ({template.items.length})
            </Text>
          </Stack>
          
          {template.items.length > 0 ? (
            <Stack direction="column" gap={3}>
              {template.items.map((item) => (
                <Box 
                  key={item.id} 
                  p={4} 
                  bg="bg.primary" 
                  borderRadius="xl"
                  boxShadow="neuomorphicInset"
                >
                  <Stack direction="row" justify="space-between" align="center">
                    <Text fontSize="sm" color="text.primary">{item.name}</Text>
                    <Badge 
                      colorScheme="blackAlpha" 
                      variant="solid"
                      borderRadius="lg"
                      px={3}
                      py={1}
                    >
                      Qty: {item.quantity}
                    </Badge>
                  </Stack>
                </Box>
              ))}
            </Stack>
          ) : (
            <Box 
              textAlign="center" 
              py={8}
              bg="bg.primary"
              borderRadius="xl"
              boxShadow="neuomorphicInset"
            >
              <Text fontSize="sm" color="text.secondary">
                No items in this template
              </Text>
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default TemplateItem; 