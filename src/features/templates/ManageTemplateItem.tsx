import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
} from '@chakra-ui/react';
import { transitions } from '@/theme';
import { Template, useDeleteTemplate } from './useTemplates';
import NeuomorphicButton from '@/features/components/NeuomorphicButton';
import Icons from '@/features/components/Icons';
import { routes } from '../app/Router';

interface ManageTemplateItemProps {
  template: Template
}

const ManageTemplateItem: React.FC<ManageTemplateItemProps> = ({ template }) => {
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
            variant="circular-raised"
            mr={2}
          >
            <Icons.Edit />
          </NeuomorphicButton>
          <NeuomorphicButton
            onClick={() => deleteTemplate(template.id)}
            aria-label="Delete template"
            variant="circular-raised"
          >
            <Icons.Trash />
          </NeuomorphicButton>
        </>
      </Flex>
    </Box>
  );
};

export default ManageTemplateItem; 