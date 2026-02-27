import { use, useState } from "react";
import { formatDate } from "date-fns";
import { Container } from "@chakra-ui/react";
import {
  useDeleteTaskCompletion,
  useUpdateTaskCompletion,
  type TaskCompletion,
} from "./useTasks";
import { transitions } from "@/theme";
import NeuomorphicInput from "../components/NeuomorphicInput";
import NeuomorphicButton from "../components/NeuomorphicButton";
import Icons from "../components/Icons";

type CompletionEditorProps = {
  completion: TaskCompletion;
};

const formatDateForInput = (date: Date) => {
  return formatDate(date, "yyyy-MM-dd");
};

const CompletionEditor: React.FC<CompletionEditorProps> = ({ completion }) => {
  const deleteTaskCompletion = useDeleteTaskCompletion();
  const updateTaskCompletion = useUpdateTaskCompletion();

  const [completionState, setCompletionState] =
    useState<TaskCompletion>(completion);

  const handleStateChange = (field: keyof TaskCompletion, value: string) => {
    setCompletionState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    updateTaskCompletion(completionState);
  };

  return (
    <Container
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
      alignItems="center"
      gap={2}
      py={4}
    >
      <NeuomorphicInput
        type="date"
        value={formatDateForInput(new Date(completionState.completedAt))}
        max={formatDateForInput(new Date())}
        onChange={(e) =>
          handleStateChange(
            "completedAt",
            new Date(e.target.value).toISOString(),
          )
        }
      />
      <NeuomorphicInput
        placeholder="Note"
        value={completionState.note || ""}
        onChange={(e) => handleStateChange("note", e.target.value)}
      />
      <NeuomorphicButton variant="circular-raised" onClick={handleSave}>
        <Icons.Check />
      </NeuomorphicButton>
      <NeuomorphicButton
        variant="circular-raised"
        onClick={() => deleteTaskCompletion(completion.id)}
      >
        <Icons.Trash />
      </NeuomorphicButton>
    </Container>
  );
};

export default CompletionEditor;
