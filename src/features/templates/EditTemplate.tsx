import { Box, Container, Flex, Text } from "@chakra-ui/react";
import SharedItemList from "../components/SharedItemList";
import { useParams } from "react-router-dom";
import {
  useCreateTemplateItem,
  useDeleteTemplateItem,
  useTemplate,
  useUpdateTemplateItemQuantity,
  useUpdateTemplateListOrder,
} from "./useTemplates";

const InvalidTemplate: React.FC = () => {
  return (
    <Flex alignItems="center" justifyContent="center" minH="100vh">
      <Box
        maxW="md"
        w="full"
        p={8}
        bg="surface.primary"
        borderRadius="2xl"
        boxShadow="neuomorphicLarge"
      >
        <Box p={4} borderRadius="xl" boxShadow="neuomorphicInset">
          <Text fontSize="sm" color="text.secondary">
            Invalid template ID
          </Text>
        </Box>
      </Box>
    </Flex>
  );
};

const EditTemplate: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const updateTemplateItemQuantity = useUpdateTemplateItemQuantity();
  const deleteTemplateItem = useDeleteTemplateItem();
  const updateTemplateListOrder = useUpdateTemplateListOrder();

  const handleReorder = (itemId: string, newSortOrder: number) => {
    console.log("Reordering item:", itemId, "to new sort order:", newSortOrder);
    updateTemplateListOrder(itemId, newSortOrder);
  };

  if (!templateId) {
    return <InvalidTemplate />;
  }

  const { template, loading, error } = useTemplate(templateId);

  if ((!template && !loading) || error) {
    return <InvalidTemplate />;
  }

  const createTemplateItem = useCreateTemplateItem(templateId);

  return (
    <Container p={2}>
      <Text mb={4} color="text.primary">
        {template?.name} template
      </Text>
      <SharedItemList
        uncheckedItems={template?.items || []}
        loading={loading}
        error={error}
        onUpdateQuantity={updateTemplateItemQuantity}
        onDeleteItem={deleteTemplateItem}
        onAddItem={createTemplateItem}
        updateOrder={handleReorder}
        allowQuantityChange
        allowReordering
        allowDeleteItems
      />
    </Container>
  );
};

export default EditTemplate;
