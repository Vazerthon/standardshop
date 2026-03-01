import { Dialog, Portal, Stack, Text, Box, List, For } from "@chakra-ui/react";
import NeuomorphicButton from "../components/NeuomorphicButton";
import Icons from "../components/Icons";
import LoadingSpinner from "../components/LoadingSpinner";
import { useCurrentUser } from "../auth/useAuthStore";
import { useRef, useState } from "react";
import {
  validateImportFile,
  getImportSummary,
  executeImport,
  type TaskImportFile,
  type ImportSummary,
  type ValidationResult,
} from "./importTasks";

type ImportState =
  | { step: "idle" }
  | { step: "validating" }
  | { step: "invalid"; errors: string[] }
  | { step: "preview"; data: TaskImportFile; summary: ImportSummary }
  | { step: "importing" }
  | { step: "done"; summary: ImportSummary }
  | { step: "error"; message: string };

type ImportTasksProps = {
  open: boolean;
  onClose: () => void;
};

const ImportTasks: React.FC<ImportTasksProps> = ({ open, onClose }) => {
  const user = useCurrentUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<ImportState>({ step: "idle" });

  const reset = () => {
    setState({ step: "idle" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setState({ step: "validating" });

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const raw = JSON.parse(reader.result as string);
        const result: ValidationResult = validateImportFile(raw);

        if (!result.valid) {
          setState({ step: "invalid", errors: result.errors });
          return;
        }

        const summary = getImportSummary(result.data);
        setState({ step: "preview", data: result.data, summary });
      } catch {
        setState({
          step: "invalid",
          errors: ["File is not valid JSON."],
        });
      }
    };
    reader.onerror = () => {
      setState({
        step: "invalid",
        errors: ["Failed to read file."],
      });
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (state.step !== "preview" || !user) return;

    const { data, summary } = state;
    setState({ step: "importing" });

    try {
      await executeImport(data, user.id);
      setState({ step: "done", summary });
    } catch (err) {
      setState({
        step: "error",
        message: err instanceof Error ? err.message : "Import failed.",
      });
    }
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={({ open: isOpen }) => {
        if (!isOpen) handleClose();
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
              <Dialog.Title>Import Tasks</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body overflow="auto">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                style={{ display: "none" }}
                onChange={handleFileSelect}
              />

              {/* ── Idle ─────────────────────────────── */}
              {state.step === "idle" && (
                <Stack gap={4} alignItems="center" py={8}>
                  <Text color="text.secondary">
                    Select a JSON file to import tasks.
                  </Text>
                  <NeuomorphicButton
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Icons.Upload />
                    Choose File
                  </NeuomorphicButton>
                </Stack>
              )}

              {/* ── Validating ───────────────────────── */}
              {state.step === "validating" && <LoadingSpinner />}

              {/* ── Invalid ──────────────────────────── */}
              {state.step === "invalid" && (
                <Stack gap={4}>
                  <Text fontWeight="semibold" color="red.600">
                    Validation failed
                  </Text>
                  <Box
                    boxShadow="neuomorphicInset"
                    borderRadius="xl"
                    p={4}
                    maxH="300px"
                    overflow="auto"
                  >
                    <List.Root variant="plain" gap={1}>
                      <For each={state.errors}>
                        {(err) => (
                          <List.Item key={err}>
                            <Text fontSize="sm" color="red.600">
                              • {err}
                            </Text>
                          </List.Item>
                        )}
                      </For>
                    </List.Root>
                  </Box>
                  <NeuomorphicButton onClick={reset}>
                    Try Another File
                  </NeuomorphicButton>
                </Stack>
              )}

              {/* ── Preview ──────────────────────────── */}
              {state.step === "preview" && (
                <Stack gap={4}>
                  <Text fontWeight="semibold">
                    File validated successfully. Ready to import:
                  </Text>
                  <Box boxShadow="neuomorphicInset" borderRadius="xl" p={4}>
                    <SummaryDisplay summary={state.summary} />
                  </Box>
                </Stack>
              )}

              {/* ── Importing ────────────────────────── */}
              {state.step === "importing" && (
                <Stack gap={4} alignItems="center" py={8}>
                  <LoadingSpinner />
                  <Text color="text.secondary">Importing…</Text>
                </Stack>
              )}

              {/* ── Done ─────────────────────────────── */}
              {state.step === "done" && (
                <Stack gap={4}>
                  <Text fontWeight="semibold" color="green.600">
                    Import completed successfully!
                  </Text>
                  <Box boxShadow="neuomorphicInset" borderRadius="xl" p={4}>
                    <SummaryDisplay summary={state.summary} />
                  </Box>
                </Stack>
              )}

              {/* ── Error ────────────────────────────── */}
              {state.step === "error" && (
                <Stack gap={4}>
                  <Text fontWeight="semibold" color="red.600">
                    Import failed — no data was written.
                  </Text>
                  <Box boxShadow="neuomorphicInset" borderRadius="xl" p={4}>
                    <Text fontSize="sm" color="red.600">
                      {state.message}
                    </Text>
                  </Box>
                  <NeuomorphicButton onClick={reset}>
                    Try Again
                  </NeuomorphicButton>
                </Stack>
              )}
            </Dialog.Body>

            <Dialog.Footer>
              {state.step === "preview" && (
                <>
                  <NeuomorphicButton onClick={reset}>Back</NeuomorphicButton>
                  <NeuomorphicButton onClick={handleImport}>
                    <Icons.Check />
                    Confirm Import
                  </NeuomorphicButton>
                </>
              )}
              {state.step !== "preview" && (
                <Dialog.ActionTrigger asChild>
                  <NeuomorphicButton>Close</NeuomorphicButton>
                </Dialog.ActionTrigger>
              )}
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

// ── Summary sub-component ──────────────────────────────────────────

const SummaryDisplay: React.FC<{ summary: ImportSummary }> = ({ summary }) => (
  <Stack gap={1}>
    <Text fontSize="sm">
      <strong>{summary.totalTasks}</strong> task
      {summary.totalTasks !== 1 && "s"}
      {summary.deletedTasks > 0 && <> ({summary.deletedTasks} soft-deleted)</>}
    </Text>
    <Text fontSize="sm">
      <strong>{summary.totalCompletions}</strong> completion
      {summary.totalCompletions !== 1 && "s"}
      {summary.deletedCompletions > 0 && (
        <> ({summary.deletedCompletions} soft-deleted)</>
      )}
    </Text>
  </Stack>
);

export default ImportTasks;
