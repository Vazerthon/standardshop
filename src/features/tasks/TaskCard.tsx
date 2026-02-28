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
import Icons from "../components/Icons";

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
          maxW="90%"
          _hover={{ bg: "transparent" }}
          onClick={onEdit}
        >
          <Heading
            color="text.primary"
            fontSize="md"
            lineClamp={1}
            textOverflow="ellipsis"
            whiteSpace="nowrap"
          >
            {task.title}
          </Heading>
        </Button>
        <NeuomorphicCheckbox
          checked={task.completedInLast10Minutes}
          onCheckedChange={handleCheckboxChange}
        />
      </Flex>

      <Text as="p" fontSize='sm' color="text.secondary" lineClamp={2}>
        {task.description}
      </Text>
      <Flex gap={2} justify="space-between" align="center" mt={2}>
        <Show when={isRecurring} fallback={<Text as="p" fontSize='sm' color="text.secondary">One-off task</Text>}>
          <Text as="p" fontSize='sm' color="text.secondary" display="flex" alignItems="center" gap={1}>
            <Icons.Refresh />
            {`${task.frequencyDays} days`}
          </Text>
        </Show>
        <Show when={task.distanceSinceLastCompletionLabel} fallback={<Text as="p" fontSize='sm' color="text.secondary">Never completed</Text>}>
          <Text as="p" fontSize='sm' color="text.secondary" display="flex" alignItems="center" gap={1}>
            <Icons.Check />
            {task.distanceSinceLastCompletionLabel}
          </Text>
        </Show>
        <Show when={overdue}>
          <Text as="p" fontSize="sm" fontWeight="bold" color="text.secondary" display="flex" alignItems="center" gap={1}>
            <Icons.Alert />
            {/* @ts-ignore overdue condition guarantees a value here */}
            {`Overdue ${-task.daysUntilNextDue} days`}
          </Text>
        </Show>
        <Show when={dueToday}>
          <Text as="p" fontSize="sm" fontWeight="bold" color="text.secondary">
            Due today
          </Text>
        </Show>
        <Show when={dueInFuture}>
          <Text as="p" fontSize="sm" color="text.secondary">
            {`Due in ${task.daysUntilNextDue} days`}
          </Text>
        </Show>
      </Flex>

    </Container>
  );
};

export default TaskCard;
