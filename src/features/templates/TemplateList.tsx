import {
  Box,
  Container,
  Stack,
  Text,
  Center,
  Spinner,
} from '@chakra-ui/react';
import { useTemplates } from './useTemplates';
import TemplateListItem from './TemplateListItem';

const TemplateList: React.FC = () => {
  const { templates, loading, error } = useTemplates();

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
      <Stack gap={2}>
        {templates?.map((template) => (
          <TemplateListItem key={template.id} template={template} />
        ))}
      </Stack>
    </Container>
  );
};

export default TemplateList; 