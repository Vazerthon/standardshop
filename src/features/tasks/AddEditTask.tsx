import { Dialog, Portal, Stack } from "@chakra-ui/react";
import { useUpsertTask, type Task } from "./useTasks";
import { useCurrentUser } from "../auth/useAuthStore";
import NeuomorphicButton from "../components/NeuomorphicButton";
import Icons from "../components/Icons";
import { useState } from "react";
import NeuomorphicInput from "../components/NeuomorphicInput";

type AddEditTaskProps = {
  task?: Task;
  open: boolean;
  onClose: () => void;
};

const defaultTask: Task = {
  id: "",
  title: "",
  description: "",
  frequencyDays: 0,
  completions: [],
};

const AddEditTask: React.FC<AddEditTaskProps> = ({ task, open, onClose }) => {
  const user = useCurrentUser();
  const upsertTask = useUpsertTask();

  const [internalTask, setInternalTask] = useState<Task>(task || defaultTask);

  const formInValidState = !!internalTask.title.trim();

  const handleSave = () => {
    if (!user) return;
    if (!formInValidState) return;

    upsertTask(
      user.id,
      internalTask.title,
      internalTask.description,
      internalTask.frequencyDays,
    );

    setInternalTask(defaultTask);
    onClose();
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={({ open }) => {
        if (!open) onClose();
      }}
      size="cover"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            bg="surface.primary"
            boxShadow="neuomorphic"
            color="text.primary"
          >
            <Dialog.Header>
              <Dialog.Title>{task ? "Edit Task" : "Add Task"}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!formInValidState) return;
                  handleSave();
                }}
              >
                <Stack gap={6}>
                  <NeuomorphicInput
                    label="Title"
                    value={internalTask.title}
                    onChange={(e) =>
                      setInternalTask({
                        ...internalTask,
                        title: e.target.value,
                      })
                    }
                  />
                  <NeuomorphicInput
                    label="Description"
                    value={internalTask.description}
                    onChange={(e) =>
                      setInternalTask({
                        ...internalTask,
                        description: e.target.value,
                      })
                    }
                  />
                  <NeuomorphicInput
                    label="Frequency (days)"
                    type="number"
                    min={0}
                    value={internalTask.frequencyDays}
                    onChange={(e) =>
                      setInternalTask({
                        ...internalTask,
                        frequencyDays: parseInt(e.target.value, 10) || 0,
                      })
                    }
                  />
                </Stack>
              </form>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <NeuomorphicButton>Cancel</NeuomorphicButton>
              </Dialog.ActionTrigger>
              <NeuomorphicButton
                onClick={handleSave}
                disabled={!formInValidState}
              >
                Save
              </NeuomorphicButton>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <NeuomorphicButton
                variant="circular-raised"
                position="absolute"
                top={2}
                right={2}
              >
                <Icons.Close />
              </NeuomorphicButton>
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default AddEditTask;
