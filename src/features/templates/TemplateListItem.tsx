import { Box, Text, Flex, Heading } from "@chakra-ui/react";
import { Template } from "./useTemplates";
import { transitions } from "@/theme";
import NeuomorphicButton from "../components/NeuomorphicButton";
import Icons from "@/features/components/Icons";
import {
  useInsertAllItemsFromTemplate,
  useShoppingList,
} from "../shopping-list/useShoppingList";
import { useCurrentUser } from "../auth/useAuthStore";
import { Link } from "react-router-dom";
import { routes } from "../app/Router";

interface TemplateListItemProps {
  template: Template;
}

const TemplateListItem: React.FC<TemplateListItemProps> = ({ template }) => {
  const insertItemsFromTemplate = useInsertAllItemsFromTemplate();

  const items = template.items.flatMap((item) => ({
    itemId: item.itemId,
    quantity: item.quantity,
  }));

  const owner = useCurrentUser();
  const {
    shoppingList: { checkedItems, uncheckedItems },
  } = useShoppingList();

  const allItems = [...checkedItems, ...uncheckedItems];
  const sortOrder = Math.max(...allItems.map((item) => item.sortOrder), 0) + 1;

  return (
    <Link
      to={routes.makeTemplateRoute(template.id)}
      style={{ textDecoration: "none" }}
      tabIndex={0}
    >
      <Box
        width="100%"
        p={2}
        bg="surface.primary"
        borderRadius="xl"
        overflow="hidden"
        boxShadow="neuomorphic"
        _hover={{
          boxShadow: "neuomorphicHover",
          transform: "translateY(-4px)",
        }}
        transition={transitions.default}
      >
        <Flex justify="space-between" align="center" pb={1}>
          <Heading flexGrow={1} size="md" color="text.primary">
            {template.name}
          </Heading>
          <>
            <Text
              mr={2}
              fontWeight="medium"
              fontSize="sm"
              color="text.secondary"
            >
              Items ({template.items.length})
            </Text>

            <NeuomorphicButton
              onClick={(e) => {
                e.preventDefault();
                insertItemsFromTemplate(owner.id, items, sortOrder);
              }}
              aria-label="Insert template into shopping list"
              variant="circular-raised"
            >
              <Icons.Insert />
            </NeuomorphicButton>
          </>
        </Flex>
      </Box>
    </Link>
  );
};

export default TemplateListItem;
