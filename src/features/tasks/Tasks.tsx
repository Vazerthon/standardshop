import {
  Badge,
  Container,
  For,
  List,
  Show,
  Tabs,
  Text,
} from "@chakra-ui/react";
import {
  getFilteredTasks,
  getTabCounts,
  Task,
  TASK_TABS,
  TaskTabKey,
  useTasks,
} from "./useTasks";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorBox from "../components/ErrorBox";
import TaskCard from "./TaskCard";
import AddEditTask from "./AddEditTask";
import NeuomorphicButton from "../components/NeuomorphicButton";
import Icons from "../components/Icons";
import { useMemo, useState } from "react";

const TaskList: React.FC<{
  tasks: Task[];
  onEdit: (task: Task) => void;
}> = ({ tasks, onEdit }) => (
  <For
    each={tasks}
    fallback={<Text color="text.primary">No tasks found.</Text>}
  >
    {(task) => (
      <List.Root key={task.id} mb={2} variant="plain">
        <List.Item>
          <TaskCard task={task} onEdit={() => onEdit(task)} />
        </List.Item>
      </List.Root>
    )}
  </For>
);

const Tasks: React.FC = () => {
  const { tasks, loading, error } = useTasks();
  const [addEditTaskOpen, setAddEditTaskOpen] = useState(false);
  const [editTaskId, setEditTaskId] = useState<Task["id"] | undefined>(
    undefined,
  );
  const [activeTab, setActiveTab] = useState<TaskTabKey>("all");
  const editTask = tasks.find((task) => task.id === editTaskId);
  const tabCounts = useMemo(() => getTabCounts(tasks), [tasks]);

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

      <Tabs.Root
        variant="plain"
        value={activeTab}
        onValueChange={(e) => setActiveTab(e.value as TaskTabKey)}
        css={{
        "--tabs-indicator-bg": "neuomorphic.text",
      }}
      >
        <Tabs.List
          flexWrap="nowrap"
          minW="100%"
          bg="surface.primary"
          borderRadius="md"
          mb={3}
          boxShadow="neuomorphic"
        >
          <For each={TASK_TABS}>
            {(tab) => (
              <Tabs.Trigger
                key={tab.key}
                value={tab.key}
                fontSize="xs"
                px={1}
                color="text.primary"
              >
                {tab.label}
                <Badge variant="solid" size="xs" borderRadius="full" bg="text.secondary" color="white">
                  {tabCounts[tab.key]}
                </Badge>
              </Tabs.Trigger>
            )}
          </For>
          <Tabs.Indicator rounded="12" />
        </Tabs.List>

        <For each={TASK_TABS}>
          {(tab) => (
            <Tabs.Content key={tab.key} value={tab.key} p={0}>
              <TaskList
                tasks={getFilteredTasks(tasks, tab.key)}
                onEdit={openEditTaskModal}
              />
            </Tabs.Content>
          )}
        </For>
      </Tabs.Root>

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
