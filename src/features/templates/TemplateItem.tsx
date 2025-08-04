import React from 'react';
import {
  Box,
  Flex,
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
      p={2}
      bg="surface.primary"
      borderRadius="xl" 
      overflow="hidden"
      boxShadow="neuomorphic"
      _hover={{
        boxShadow: "neuomorphicHover",
        transform: "translateY(-4px)"
      }}
      transition={transitions.default}
    >
      <Flex justify="space-between" align="center" pb={1}>
        <Heading size="md" color="text.primary">{template.name}</Heading>
        <Text fontWeight="medium" fontSize="sm" color="text.secondary">
          Items ({template.items.length})
        </Text>
      </Flex>
      
      <Box>
        <Stack direction="column" gap={2}>
          {template.items.map((item) => (
            <Box 
              key={item.id} 
              p={2} 
              bg="bg.primary" 
              borderRadius="xl"
              boxShadow="neuomorphicInset"
            >
              <Stack direction="row" justify="space-between" align="center">
                <Text truncate fontSize="sm" color="text.primary">{item.name}</Text>
                <Badge 
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
      </Box>
    </Box>
  );
};

export default TemplateItem; 