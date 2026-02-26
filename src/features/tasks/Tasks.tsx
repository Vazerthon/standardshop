import { Container, For, List, Text } from "@chakra-ui/react";
import { useTasks } from "./useTasks";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorBox from "../components/ErrorBox";
import TaskCard from "./TaskCard";
import AddEditTask from "./AddEditTask";
import NeuomorphicButton from "../components/NeuomorphicButton";
import Icons from "../components/Icons";
import { useState } from "react";

const Tasks: React.FC = () => {
  const { tasks, loading, error } = useTasks();
  const [addTaskOpen, setAddTaskOpen] = useState(false);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container p={2} mt={2}>
      {error?.message && <ErrorBox error={error} />}

      <For each={tasks} fallback={<Text>No tasks found.</Text>}>
        {(task) => (
          <List.Root key={task.id} mb={2} variant="plain">
            <List.Item>
              <TaskCard task={task} />
            </List.Item>
          </List.Root>
        )}
      </For>

      <NeuomorphicButton
        variant="circular-raised"
        position="fixed"
        bottom={4}
        right={4}
        onClick={() => setAddTaskOpen(true)}
      >
        <Icons.Plus />
      </NeuomorphicButton>

      <AddEditTask open={addTaskOpen} onClose={() => setAddTaskOpen(false)} />
    </Container>
  );
};

export default Tasks;
