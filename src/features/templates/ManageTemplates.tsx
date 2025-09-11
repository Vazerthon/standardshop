import {
  Box,
  Container,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useCreateTemplate, useTemplates } from './useTemplates';
import ManageTemplateItem from './ManageTemplateItem';
import CreateItem from '../components/CreateItem';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBox from '../components/ErrorBox';

const ManageTemplates: React.FC = () => {
  const { templates, loading, error } = useTemplates();
  const createTemplate = useCreateTemplate();

  if (loading) {
    return (
      <LoadingSpinner />
    );
  }

  return (
    <Container p={2}>
        {error?.message && (
          <ErrorBox error={error} />
        )}
        {templates?.length === 0 && (
          <Text mt={4} px={12} textAlign="center" fontSize="sm" color="text.secondary">
            No templates created yet. Templates can be used to quickly add groups of items to your shopping list. Create one for your weekly shop or your favourite recipes!
          </Text>
        )}
        <Stack gap={2} mt={4}>
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