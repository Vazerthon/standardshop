import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Stack,
  Badge,
} from '@chakra-ui/react';
import { transitions } from '@/theme';
import { Template, useDeleteTemplate } from './useTemplates';
import NeuomorphicButton from '@/features/components/NeuomorphicButton';
import Icons from '@/features/components/icons';
import { routes } from '../app/Router';

interface TemplateItemProps {
  template: Template
}

const TemplateItem: React.FC<TemplateItemProps> = ({ template }) => {
  const deleteTemplate = useDeleteTemplate();

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
        <Heading flexGrow={1} size="md" color="text.primary">{template.name}</Heading>
        <>
          <Text mr={2} fontWeight="medium" fontSize="sm" color="text.secondary">
            Items ({template.items.length})
          </Text>
          <NeuomorphicButton
            as="a"
            // @ts-expect-error
            href={routes.makeTemplateRoute(template.id)}
            aria-label="Edit template"
            borderRadius="full"
            width={2}
            mr={2}
          >
            <Icons.Edit />
          </NeuomorphicButton>
          <NeuomorphicButton
            onClick={() => deleteTemplate(template.id)}
            aria-label="Delete template"
            borderRadius="full"
            width={2}
          >
            <Icons.Trash />
          </NeuomorphicButton>
        </>
      </Flex>

      <Box>
        <Stack direction="column" gap={2}>
          {template.items.map((templateItem) => (
            <Box
              key={templateItem.id}
              p={2}
              bg="bg.primary"
              borderRadius="xl"
              boxShadow="neuomorphicInset"
            >
              <Stack direction="row" justify="space-between" align="center">
                <Text truncate fontSize="sm" color="text.primary">{templateItem.name}</Text>
                <Badge
                  variant="solid"
                  borderRadius="lg"
                  px={3}
                  py={1}
                >
                  Qty: {templateItem.quantity}
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