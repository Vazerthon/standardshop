import { Routes, Route, BrowserRouter, Link } from "react-router-dom";
import { Box, List, Text } from "@chakra-ui/react";

import ShoppingList from "@/features/shopping-list/ShoppingList";
import ManageTemplates from "@/features/templates/ManageTemplates";
import EditTemplate from "@/features/templates/EditTemplate";
import History from "@/features/history/History";
import Tasks from "@/features/tasks/Tasks";

const appBaseUrl = "/standardshop";

export const routes = {
  shoppingList: `${appBaseUrl}/`,
  templates: `${appBaseUrl}/templates`,
  template: `${appBaseUrl}/template/:templateId`,
  history: `${appBaseUrl}/history`,
  tasks: `${appBaseUrl}/tasks`,
  makeTemplateRoute: (id: string) => `${appBaseUrl}/template/${id}`,
};

const Router: React.FC = () => {
  return (
    <Routes>
      <Route path={routes.shoppingList} element={<ShoppingList />} />
      <Route path={routes.templates} element={<ManageTemplates />} />
      <Route path={routes.template} element={<EditTemplate />} />
      <Route path={routes.history} element={<History />} />
      <Route path={routes.tasks} element={<Tasks />} />
    </Routes>
  );
};

const NavItem: React.FC<{ to: string; label: string }> = ({ to, label }) => (
  <List.Item>
    <Link to={to} tabIndex={0}>
      <Text fontSize="lg" mb={4}>
        {label}
      </Text>
    </Link>
  </List.Item>
);

const Navigation: React.FC = () => {
  return (
    <Box as="nav" p={4} color="text.primary">
      <List.Root variant="plain">
        <NavItem to={routes.shoppingList} label="Shopping List" />
        <NavItem to={routes.templates} label="Manage templates" />
        <NavItem to={routes.history} label="History" />
        <NavItem to={routes.tasks} label="Tasks" />
      </List.Root>
    </Box>
  );
};

export { Navigation, BrowserRouter };

export default Router;
