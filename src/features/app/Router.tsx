import { Routes, Route, BrowserRouter, Link } from "react-router-dom";
import ShoppingList from "@/features/shopping-list/ShoppingList";
import Templates from "@/features/templates/Templates";
import { Box, List, Text } from "@chakra-ui/react";

const appBaseUrl = '/standardshop'

const routes = {
  shoppingList: `${appBaseUrl}/`,
  templates: `${appBaseUrl}/templates`,
  template: `${appBaseUrl}/template/:id`,
}

const Router: React.FC = () => {
  return (
    <Routes>
      <Route path={routes.shoppingList} element={<ShoppingList />} />
      <Route path={routes.templates} element={<Templates />} />
    </Routes>
  );
}

const Navigation: React.FC = () => {
  return (
    <Box as="nav" p={4} color="text.primary">
      <List.Root variant="plain">
        <List.Item >
          <Link to={routes.shoppingList} tabIndex={0}>
            <Text fontSize="lg" mb={4}>
              Shopping List
            </Text>
          </Link>
        </List.Item>
        <List.Item >
          <Link to={routes.templates} tabIndex={0}>
            <Text fontSize="lg" mb={4}>
              Manage templates
            </Text>
          </Link>
        </List.Item>
      </List.Root>
    </Box>
  );
};

export { Navigation, BrowserRouter };

export default Router;
