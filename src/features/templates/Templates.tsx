import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Stack,
  Text,
  Center,
  Spinner,
} from '@chakra-ui/react';
import { useTemplates, useTemplatesLoading, useTemplatesMessage, useTemplatesFetch } from './useTemplatesStore';
import TemplateItem from './TemplateItem';

const Templates: React.FC = () => {
  const templates = useTemplates();
  const loading = useTemplatesLoading();
  const message = useTemplatesMessage();
  const fetchTemplates = useTemplatesFetch();

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

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
        {message && (
          <Box 
            p={4}
            mt={4}
            borderRadius="xl" 
            boxShadow="neuomorphicInset"
          >
            <Text fontSize="sm" color="text.error">
              {message}
            </Text>
          </Box>
        )}
        {templates.map((template) => (
          <TemplateItem key={template.id} template={template} />
        ))}
      </Container>
  );
};

export default Templates; 