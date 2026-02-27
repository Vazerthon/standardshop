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
  const [addEditTaskOpen, setAddEditTaskOpen] = useState(false);
  const [editTaskId, setEditTaskId] = useState<Task["id"] | undefined>(
    undefined,
  );
  const editTask = tasks.find((task) => task.id === editTaskId);

  if (loading) {
    return <LoadingSpinner />;
  }

  const openEditTaskModal = (task: Task) => {
    setEditTaskId(task.id);
    setAddEditTaskOpen(true);
  };

  const closeEditTaskModal = () => {
    setEditTaskId(undefined);
    setAddEditTaskOpen(false);
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
        onClick={() => setAddEditTaskOpen(true)}
      >
        <Icons.Plus />
      </NeuomorphicButton>

      <Show when={addEditTaskOpen && editTask}>
        <AddEditTask
          open={addEditTaskOpen}
          onClose={closeEditTaskModal}
          task={editTask}
        />
      </Show>
    </Container>
  );
};

export default Tasks;
