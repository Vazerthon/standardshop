import {
  Container,
  Stack,
} from '@chakra-ui/react';
import { useTemplates } from './useTemplates';
import TemplateListItem from './TemplateListItem';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBox from '../components/ErrorBox';

const TemplateList: React.FC = () => {
  const { templates, loading, error } = useTemplates();

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
      <Stack gap={2}>
        {templates?.map((template) => (
          <TemplateListItem key={template.id} template={template} />
        ))}
      </Stack>
    </Container>
  );
};

export default TemplateList; 