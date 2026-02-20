import { Flex, Container, Heading, Text } from "@chakra-ui/react";
import { useMarkTaskAsCompleted, type Task } from "./useTasks";
import { transitions } from "@/theme";
import NeuomorphicButton from "../components/NeuomorphicButton";
import Icons from "../components/Icons";
import { useCurrentUser } from "../auth/useAuthStore";

type TaskCardProps = {
  task: Task;
};

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const markTaskAsCompleted = useMarkTaskAsCompleted();
  const user = useCurrentUser();

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
        <Heading my={2}>{task.title}</Heading>
        <NeuomorphicButton
          onClick={() => markTaskAsCompleted(task.id, user.id)}
        >
          <Icons.Check />
        </NeuomorphicButton>
      </Flex>
      <Text fontSize="sm">
        {task.description}
        <br />
        Due every {task.frequency} days
        <br />
        {task.distanceSinceLastCompletionLabel
          ? `Last completed ${task.distanceSinceLastCompletionLabel}`
          : "Never completed"}
      </Text>
    </Container>
  );
};

export default TaskCard;
