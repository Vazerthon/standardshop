import { Box, Flex } from "@chakra-ui/react";
import { type Item } from "./useItems";
import NeuomorphicInput from "../components/NeuomorphicInput";
import { useEffect, useState } from "react";
import NeuomorphicButton from "../components/NeuomorphicButton";
import Icons from "../components/Icons";
import { useRenameItem } from "./useItems";

interface ItemEditorProps {
  item: Item;
}

const ItemEditor: React.FC<ItemEditorProps> = ({ item }) => {
  const renameItem = useRenameItem();
  const [name, setName] = useState(item.name);
  const canSave = name.trim() !== "" && name.trim() !== item.name;

  const handleSave = () => {
    if (!canSave) return;
    renameItem(item.id, name.trim());
  }
  
  useEffect(() => {
    console.log("Item name updated:", item.name);
    setName(item.name);
  }, [item.name]);

  return (
    <Box mt={4}>
      <Flex gap={2} align="flex-end">
        <NeuomorphicInput label="Rename" value={name} onChange={(e) => setName(e.target.value.trim().toLocaleLowerCase())} />
        <NeuomorphicButton variant="circular-raised" disabled={!canSave} onClick={handleSave}><Icons.Check /></NeuomorphicButton>
      </Flex>
    </Box>
  );
};

export default ItemEditor;
