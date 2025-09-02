import {
  Box,
  Container,
  Stack,
  Text,
  Center,
  Spinner,
} from '@chakra-ui/react';
import { useCreateTemplate, useTemplates } from './useTemplates';
import ManageTemplateItem from './ManageTemplateItem';
import CreateItem from '../components/CreateItem';

const ManageTemplates: React.FC = () => {
  const { templates, loading, error } = useTemplates();
  const createTemplate = useCreateTemplate();

  if (loading) {
    return (
      <Center minH="100vh">
        <Stack direction="column" align="center">
          <Spinner size="lg" color="accent.primary" />
        </Stack>
      </Center>
    );
  }

  return (
    <Container p={2}>
        {error?.message && (
          <Box 
            p={4}
            mt={4}
            borderRadius="xl" 
            boxShadow="neuomorphicInset"
          >
            <Text fontSize="sm" color="text.primary">
              {error.message}
            </Text>
          </Box>
        )}
        {templates?.length === 0 && (
          <Text mt={4} px={12} textAlign="center" fontSize="sm" color="text.secondary">
            No templates created yet. Templates can be used to quickly add groups of items to your shopping list. Create one for your weekly shop or your favourite recipes!
          </Text>
        )}
        <Stack gap={2}>
          {templates?.map((template) => (
            <ManageTemplateItem key={template.id} template={template} />
          ))}
        </Stack>
        <Box mt={4}>
          <CreateItem
            onAddItem={createTemplate}
            inputFieldPlaceholder="Add template"
            buttonAriaLabel="Add template"
          />
        </Box>
      </Container>
  );
};

export default ManageTemplates; 