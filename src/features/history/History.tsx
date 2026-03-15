import { Accordion, Container, Text, Flex, Show, For } from "@chakra-ui/react";
import { useItemHistory } from "./useItems";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorBox from "../components/ErrorBox";
import { useEffect } from "react";
import { useSetExtraContentRenderFunction } from "../app/useMenuBarStore";
import ItemEditor from "./ItemEditor";

const History: React.FC = () => {
  const { items, loading, error } = useItemHistory();
  const setExtraContentRenderFunction = useSetExtraContentRenderFunction();

  useEffect(() => {
    setExtraContentRenderFunction(() => (
      <Flex
        color="text.primary"
        gap={4}
        align="center"
        justify="space-between"
        w="100%"
      >
        <Text as="h1" color="text.primary">
          Purchase History
        </Text>
      </Flex>
    ));
    return () => setExtraContentRenderFunction(undefined);
  }, [setExtraContentRenderFunction]);

  return (
    <Show when={!loading} fallback={<LoadingSpinner />}>
      <Container p={2}>
        <Show when={error?.message}>
          <ErrorBox error={error as Error} />
        </Show>
        <Show
          when={items.length}
          fallback={
            <Text mt={4} color="text.primary">
              No items match your search criteria
            </Text>
          }
        >
          <Accordion.Root color="text.secondary" collapsible>
            <For each={items}>
              {(item) => (
                <Accordion.Item key={item.id} value={item.name}>
                  <Accordion.ItemTrigger>
                    <Accordion.ItemIndicator />
                    <Text>
                      {item.name} -{" "}
                      <Text as="span" fontSize="sm">
                        bought {item.history.length} time
                        {item.history.length === 1 ? "" : "s"}, most recently{" "}
                        {item.distanceSinceLastPurchase}
                      </Text>
                    </Text>
                  </Accordion.ItemTrigger>
                  <Accordion.ItemContent>
                    <Accordion.ItemBody>
                      <Show when={item.typicalPurchaseInterval}>
                        <Text mb={2} color="text.primary">
                          Typicaly bought every:{" "}
                          {item.typicalPurchaseInterval || "N/A"} days
                        </Text>
                      </Show>
                      <Text mb={2} color="text.primary">
                        Typical quantity: {item.typicalQuantity || "N/A"}
                      </Text>
                      <ItemEditor item={item} />
                    </Accordion.ItemBody>
                  </Accordion.ItemContent>
                </Accordion.Item>
              )}
            </For>
          </Accordion.Root>
        </Show>
      </Container>
    </Show>
  );
};

export default History;
