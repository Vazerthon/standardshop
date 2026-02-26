import { Container, For, List, Show, Text } from "@chakra-ui/react";
import { Task, useTasks } from "./useTasks";
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
  const [editTask, setEditTask] = useState<Task | undefined>(undefined);

  if (loading) {
    return <LoadingSpinner />;
  }

  const openEditTaskModal = (task: Task) => {
    setEditTask(task);
    setAddTaskOpen(true);
  };

  const closeEditTaskModal = () => {
    setEditTask(undefined);
    setAddTaskOpen(false);
  };

  return (
    <Container p={2} mt={2}>
      {error?.message && <ErrorBox error={error} />}

      <For each={tasks} fallback={<Text>No tasks found.</Text>}>
        {(task) => (
          <List.Root key={task.id} mb={2} variant="plain">
            <List.Item>
              <TaskCard task={task} onEdit={() => openEditTaskModal(task)} />
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

      <Show when={addTaskOpen}>
        <AddEditTask
          open={addTaskOpen}
          onClose={closeEditTaskModal}
          task={editTask}
        />
      </Show>
    </Container>
  );
};

export default Tasks;
