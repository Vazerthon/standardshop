import {Dialog, Portal } from "@chakra-ui/react";
import { type Task } from "./useTasks";
import { useCurrentUser } from "../auth/useAuthStore";
import NeuomorphicButton from "../components/NeuomorphicButton";
import Icons from "../components/Icons";

type AddEditTaskProps = {
  task?: Task;
};

const AddEditTask: React.FC<AddEditTaskProps> = ({ task }) => {
  const user = useCurrentUser();

  return (
    <Dialog.Root size="cover">
      <Dialog.Trigger asChild>
        <NeuomorphicButton variant="circular-raised" position="fixed" bottom={4} right={4}>
          <Icons.Plus />
        </NeuomorphicButton>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content bg="surface.primary" boxShadow="neuomorphic" color="text.primary">
            <Dialog.Header>
              <Dialog.Title>{task ? "Edit Task" : "Add Task"}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <NeuomorphicButton>Cancel</NeuomorphicButton>
              </Dialog.ActionTrigger>
              <NeuomorphicButton>Save</NeuomorphicButton>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <NeuomorphicButton variant="circular-raised" position="absolute" top={2} right={2}>
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
