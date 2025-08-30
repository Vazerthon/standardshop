import { Box, Flex, Text } from '@chakra-ui/react';
import SharedItemList from '../components/SharedItemList';
import { useParams } from 'react-router-dom';
import { useTemplate } from './useTemplates';

const EditTemplate: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();

  if (!templateId) {
    return (
      <Flex
        alignItems="center"
        justifyContent="center"
        minH="100vh"
      >
        <Box
          maxW="md"
          w="full"
          p={8}
          bg="surface.primary"
          borderRadius="2xl"
          boxShadow="neuomorphicLarge"
        >
          <Box
            p={4}
            borderRadius="xl"
            boxShadow="neuomorphicInset"
          >
            <Text fontSize="sm" color="text.secondary">
              Invalid template ID
            </Text>
          </Box>
        </Box>
      </Flex>
    );
  }

  // const { template, loading, error } = useTemplate(templateId);
  const { loading, error } = useTemplate(templateId);

  return (
    <SharedItemList
      uncheckedItems={[]}
      checkedItems={[]}
      loading={loading}
      error={error}
      onUpdateQuantity={() => { }}
      onCheckItem={() => { }}
      onUncheckItem={() => { }}
      onDeleteItem={() => { }}
      onAddItem={() => { }}
      updateOrder={() => { }}
    />
  );
};

export default EditTemplate; 