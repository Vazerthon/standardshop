import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Stack,
  Text,
  Spinner,
  SimpleGrid,
  Center,
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
      <Container maxW="container.xl" py={8}>
        <Center>
          <Stack direction="column" gap={6} align="center">
            <Box
              p={8}
              bg="surface.primary"
              borderRadius="2xl"
              boxShadow="neuomorphicLarge"
            >
              <Spinner size="lg" color="accent.primary" />
            </Box>
            <Text color="text.secondary">Loading templates...</Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Stack direction="column" gap={8}>
        <Box>
          <Heading size="lg" mb={3} color="text.primary">Templates</Heading>
          <Text color="text.secondary">
            View and manage your templates and their items
          </Text>
        </Box>

        {message && (
          <Box 
            p={4} 
            borderRadius="xl" 
            bg={message.includes('error') ? 'red.50' : 'blue.50'}
            boxShadow="neuomorphicInset"
          >
            <Text fontSize="sm" color={message.includes('error') ? 'red.700' : 'blue.700'}>
              {message}
            </Text>
          </Box>
        )}

        {templates.length === 0 ? (
          <Center py={16}>
            <Box 
              textAlign="center" 
              p={8}
              bg="surface.primary"
              borderRadius="2xl"
              boxShadow="neuomorphicLarge"
              maxW="md"
            >
              <Text fontSize="lg" color="text.secondary">
                No templates found. Create your first template to get started.
              </Text>
            </Box>
          </Center>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={8}>
            {templates.map((template) => (
              <TemplateItem key={template.id} template={template} />
            ))}
          </SimpleGrid>
        )}
      </Stack>
    </Container>
  );
};

export default Templates; 