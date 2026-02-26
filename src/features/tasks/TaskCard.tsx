import {
  Flex,
  Container,
  Heading,
  Text,
  CheckboxCheckedChangeDetails,
  Button,
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
      gap={2}
    >
      <Flex w="100%" justify="space-between" align="center">
        <Button
          variant="ghost"
          p={0}
          m={0}
          _hover={{ bg: "transparent" }}
          onClick={onEdit}
        >
          <Heading color="text.primary" my={2}>
            {task.title}
          </Heading>
        </Button>
        <NeuomorphicCheckbox
          checked={task.completedInLast10Minutes}
          onCheckedChange={handleCheckboxChange}
        />
      </Flex>
      <Text fontSize="sm">
        {task.description}
        <br />
        {!!task.frequencyDays && (
          <>
            {`Due every ${task.frequencyDays} days`} <br />
          </>
        )}
        {task.distanceSinceLastCompletionLabel
          ? `Last completed ${task.distanceSinceLastCompletionLabel}`
          : "Never completed"}
        {!!task.daysUntilNextDue &&
          `, next due in ${task.daysUntilNextDue} days`}
      </Text>
    </Container>
  );
};

export default TaskCard;
