import { Container, Heading, List, Text } from "@chakra-ui/react";
import { useTasks } from "./useTasks";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorBox from "../components/ErrorBox";

const Tasks: React.FC = () => {
  const { tasks, loading, error } = useTasks();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container p={2}>
      {error?.message && <ErrorBox error={error} />}
      <Heading my={2} color="text.primary">
        Tasks
      </Heading>

      {tasks?.map(
        ({
          id,
          title,
          description,
          daysSinceLastCompletion,
          distanceSinceLastCompletionLabel,
          // history,
        }) => (
          <List.Root key={id} pl={4} mb={2}>
            <List.Item>
              <Text fontSize="sm">
                <strong>{title}</strong> - {description} - Last completed:{" "}
                {distanceSinceLastCompletionLabel} ({daysSinceLastCompletion}{" "}
                days ago)
              </Text>
            </List.Item>
          </List.Root>
        ),
      )}
    </Container>
  );
};

export default Tasks;
