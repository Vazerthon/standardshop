import { Container, List } from "@chakra-ui/react";
import { useTasks } from "./useTasks";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorBox from "../components/ErrorBox";
import TaskCard from "./TaskCard";

const Tasks: React.FC = () => {
  const { tasks, loading, error } = useTasks();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container p={2} mt={2}>
      {error?.message && <ErrorBox error={error} />}

      {tasks?.map((task) => (
        <List.Root key={task.id} mb={2} variant="plain">
          <List.Item>
            <TaskCard task={task} />
          </List.Item>
        </List.Root>
      ))}
    </Container>
  );
};

export default Tasks;
