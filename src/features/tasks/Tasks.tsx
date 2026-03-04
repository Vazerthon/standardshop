import {
  Container,
  Flex,
  For,
  List,
  Show,
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
import Select from "../components/Select";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorBox from "../components/ErrorBox";
import TaskCard from "./TaskCard";
import AddEditTask from "./AddEditTask";
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
  const editTask = tasks.find((task) => task.id === editTaskId);
  const tabCounts = useMemo(() => getTabCounts(tasks), [tasks]);

  const setExtraContent = useSetExtraContentRenderFunction();
  useEffect(() => {
    setExtraContent(() => (
      <Flex gap={2} align="center" justify="space-between" w="100%">
        <Text as="h1" color="text.primary">{archive ? "Tasks Archive" : "Tasks"}</Text>
        <Select
          label="Filter tasks"
          values={TASK_TABS.map((tab) => ({ label: `${tab.label} (${tabCounts[tab.key]})`, value: tab.key }))}
          selectedValue={[activeTab]}
          onValueChange={(value) => setActiveTab(value.value[0] as TaskTabKey)}
          color="text.primary"
        />
      </Flex>
    ));
    return () => setExtraContent(undefined);
  }, [setExtraContent, archive, activeTab]);

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
      <TaskList
        tasks={getFilteredTasks(tasks, activeTab)}
        onEdit={openEditTaskModal}
        archive={archive}
      />
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
    </Container>
  );
};

export default Tasks;
