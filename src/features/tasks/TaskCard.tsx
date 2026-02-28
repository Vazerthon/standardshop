import {
  Flex,
  Container,
  Heading,
  Text,
  CheckboxCheckedChangeDetails,
  Button,
  Show,
} from "@chakra-ui/react";
import {
  useMarkTaskAsCompleted,
  useDeleteTaskCompletion,
  type Task,
} from "./useTasks";
import { transitions } from "@/theme";
import { useCurrentUser } from "../auth/useAuthStore";
import NeuomorphicCheckbox from "../components/NeuomorphicCheckbox";

type TaskCardProps = {
  task: Task;
  onEdit?: () => void;
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const markTaskAsCompleted = useMarkTaskAsCompleted();
  const deleteTaskCompletion = useDeleteTaskCompletion();
  const user = useCurrentUser();

  const handleCheckboxChange = ({ checked }: CheckboxCheckedChangeDetails) => {
    if (!user) return;

    if (checked) {
      markTaskAsCompleted(task.id, user.id);
    } else {
      if (task.mostRecentCompletion) {
        deleteTaskCompletion(task.mostRecentCompletion.id);
      }
    }
  };

  const overdue = task.daysUntilNextDue !== undefined && task.daysUntilNextDue < 0;
  const dueToday = task.daysUntilNextDue === 0;
  const dueInFuture = task.daysUntilNextDue !== undefined && task.daysUntilNextDue > 0;
  const isRecurring = task.frequencyDays && task.frequencyDays > 0;

  return (
    <Container
      p={2}
      bg="surface.primary"
      boxShadow="neuomorphic"
      _hover={{
        boxShadow: "neuomorphicHover",
        transform: "translateY(-2px)",
      }}
      transition={transitions.default}
      borderRadius="md"
      color="text.primary"
      display="flex"
      flexDirection="column"
      gap={0}
    >
      <Flex w="100%" justify="space-between" align="center">
        <Button
          height="auto"
          variant="ghost"
          p={0}
          m={0}
          _hover={{ bg: "transparent" }}
          onClick={onEdit}
        >
          <Heading color="text.primary">
            {task.title}
          </Heading>
        </Button>
        <NeuomorphicCheckbox
          checked={task.completedInLast10Minutes}
          onCheckedChange={handleCheckboxChange}
        />
      </Flex>

      <Text as="p" fontSize='sm' color="text.secondary">
        {task.description}
      </Text>
      <Show when={isRecurring}>
        <Text as="p" fontSize='sm' color="text.secondary">
          {`Due every ${task.frequencyDays} days`}
        </Text>
      </Show>
      <Show when={task.distanceSinceLastCompletionLabel} fallback={<Text as="p" fontSize='sm' color="text.secondary">Never completed</Text>}>
        <Text as="p" fontSize='sm' color="text.secondary">
          {`Last completed ${task.distanceSinceLastCompletionLabel}`}
        </Text>
      </Show>
      <Show when={overdue}>
        <Text as="p" fontSize="sm" fontWeight="bold" color="text.secondary">
          {/* @ts-ignore overdue condition guarantees a value here */}
          {`Overdue by ${-task.daysUntilNextDue} days`}
        </Text>
      </Show>
      <Show when={dueToday}>
        <Text as="p" fontSize="sm" fontWeight="bold" color="text.secondary">
          Due today
        </Text>
      </Show>
      <Show when={dueInFuture}>
        <Text as="p" fontSize="sm" color="text.secondary">
          {`Next due in ${task.daysUntilNextDue} days`}
        </Text>
      </Show>
    </Container>
  );
};

export default TaskCard;
