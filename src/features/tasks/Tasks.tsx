import {
  Badge,
  Container,
  Flex,
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
import ImportTasks from "./ImportTasks";
import NeuomorphicButton from "../components/NeuomorphicButton";
import Icons from "../components/Icons";
import { useSetExtraContentRenderFunction } from "../app/useMenuBarStore";
import { useEffect, useMemo, useState } from "react";

const TaskList: React.FC<{
  tasks: Task[];
  onEdit: (task: Task) => void;
  archive?: boolean;
}> = ({ tasks, onEdit, archive }) => (
  <For
    each={tasks}
    fallback={<Text color="text.primary">No tasks found.</Text>}
  >
    {(task) => (
      <List.Root key={task.id} mb={2} variant="plain">
        <List.Item>
          <TaskCard task={task} onEdit={() => onEdit(task)} archive={archive} />
        </List.Item>
      </List.Root>
    )}
  </For>
);

interface TasksProps {
  archive?: boolean;
}

const Tasks: React.FC<TasksProps> = ({ archive = false }) => {
  const { tasks, loading, error } = useTasks(archive);
  const [addEditTaskOpen, setAddEditTaskOpen] = useState(false);
  const [editTaskId, setEditTaskId] = useState<Task["id"] | undefined>(
    undefined,
  );
  const [activeTab, setActiveTab] = useState<TaskTabKey>("overdue");
  const [importOpen, setImportOpen] = useState(false);
  const editTask = tasks.find((task) => task.id === editTaskId);
  const tabCounts = useMemo(() => getTabCounts(tasks), [tasks]);

  const setExtraContent = useSetExtraContentRenderFunction();
  useEffect(() => {
    setExtraContent(() => (
      <Flex gap={2} align="center" justify="space-between" w="100%">
        <Text as="h1" color="text.primary">{archive ? "Tasks Archive" : "Tasks"}</Text>
        <NeuomorphicButton
          variant="circular-raised"
          onClick={() => setImportOpen(true)}
          aria-label="Import tasks"
        >
          <Icons.Upload />
        </NeuomorphicButton>
      </Flex>
    ));
    return () => setExtraContent(undefined);
  }, [setExtraContent, archive]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const openAddTaskModal = () => {
    setEditTaskId(undefined);
    setAddEditTaskOpen(true);
  };

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
                my={1}
                color="text.primary"
                shadow={activeTab === tab.key ? "neuomorphicInset" : "none"}
              >
                {tab.label}
                <Badge
                  variant="solid"
                  size="xs"
                  borderRadius="full"
                  bg="text.secondary"
                  color="white"
                >
                  {tabCounts[tab.key]}
                </Badge>
              </Tabs.Trigger>
            )}
          </For>
        </Tabs.List>

        <For each={TASK_TABS}>
          {(tab) => (
            <Tabs.Content key={tab.key} value={tab.key} p={0}>
              <TaskList
                tasks={getFilteredTasks(tasks, tab.key)}
                onEdit={openEditTaskModal}
                archive={archive}
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
        onClick={openAddTaskModal}
      >
        <Icons.Plus />
      </NeuomorphicButton>

      <Show when={addEditTaskOpen}>
        <AddEditTask
          open={addEditTaskOpen}
          onClose={closeEditTaskModal}
          task={editTask}
        />
      </Show>

      <ImportTasks open={importOpen} onClose={() => setImportOpen(false)} />
    </Container>
  );
};

export default Tasks;
