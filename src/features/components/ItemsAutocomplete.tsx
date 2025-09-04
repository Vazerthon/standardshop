
import { transitions } from "@/theme";
import {
  Combobox,
  ComboboxInputValueChangeDetails,
  Portal,
  useFilter,
  useListCollection,
} from "@chakra-ui/react"

interface ItemsAutocompleteProps {
  autocompleteItems: { id: string; label: string; value: string }[];
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}

const ItemsAutocomplete: React.FC<ItemsAutocompleteProps> = ({
  autocompleteItems,
  onChange,
  placeholder,
  value,
}) => {
  const { contains } = useFilter({ sensitivity: "base" })

  const { collection, filter } = useListCollection({
    initialItems: autocompleteItems,
    filter: contains,
    limit: 5,
  })

  const baseStyles = {
    bg: 'surface.primary',
    color: 'text.primary',
    borderRadius: 'xl',
    border: 'none',
    transition: transitions.default,
    boxShadow: 'neuomorphicInset',
    _placeholder: { color: 'text.secondary' },
    _focus: {
      boxShadow: 'neuomorphicInsetHover',
      outline: 'none'
    },
  };

  const handleInputChange = (e: ComboboxInputValueChangeDetails) => {
    onChange(e.inputValue);
    filter(e.inputValue);
  };

  return (
    <Combobox.Root
      collection={collection}
      onInputValueChange={handleInputChange}
      inputValue={value}
      inputBehavior="autocomplete"
      allowCustomValue
      mr={2}
    >
      <Combobox.Control>
        <Combobox.Input
          placeholder={placeholder}
          {...baseStyles}
        />
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content background="surface.primary" color="text.secondary">
            {collection.items.map((item) => (
              <Combobox.Item item={item} key={item.value}>
                {item.label}
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  )
};
export default ItemsAutocomplete;