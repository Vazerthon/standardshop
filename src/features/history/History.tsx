import { Accordion, Container, List, Text, Flex, Show } from "@chakra-ui/react";
import { useItemHistory } from "./useItems";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorBox from "../components/ErrorBox";
import { useEffect, useState } from "react";
import { useSetExtraContentRenderFunction } from "../app/useMenuBarStore";
import NeuomorphicInput from "../components/NeuomorphicInput";

const History: React.FC = () => {
  const [filter, setFilter] = useState("");
  const { items, loading, error } = useItemHistory(filter);
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
        <NeuomorphicInput
          placeholder="Search for history..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          mt={4}
        />

        <Show
          when={items.length}
          fallback={
            <Text mt={4} color="text.primary">
              No items match your search criteria
            </Text>
          }
        >
          <Accordion.Root color="text.secondary" collapsible>
            {items?.map((item) => (
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
                    {item.history.map(({ id, purchaseDate, quantity }) => (
                      <List.Root key={id} pl={4} mb={2}>
                        <List.Item>
                          <Text fontSize="sm">
                            Bought {quantity} on{" "}
                            {purchaseDate.toLocaleDateString()}
                          </Text>
                        </List.Item>
                      </List.Root>
                    ))}
                  </Accordion.ItemBody>
                </Accordion.ItemContent>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </Show>
      </Container>
    </Show>
  );
};

export default History;
