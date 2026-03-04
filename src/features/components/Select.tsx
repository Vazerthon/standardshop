import React from 'react';
import { Select, createListCollection, Portal, SelectValueChangeDetails, SelectRootProps } from '@chakra-ui/react';

interface SelectProps extends Omit<SelectRootProps<any>, 'onChange' | 'onValueChange' | 'value' | 'collection'> {
  values: { label: string; value: string }[];
  selectedValue: string[];
  onValueChange: (details: SelectValueChangeDetails<any>) => void;
  label: string;
}

const SelectComponent: React.FC<SelectProps> = ({ values, selectedValue, onValueChange, label, ...props }) => {
  const collection = createListCollection({ items: values });
  return (
    <Select.Root collection={collection} value={selectedValue} onValueChange={onValueChange} {...props}>
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder={`Select ${label.toLowerCase()}`} />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {collection.items.map((item) => (
              <Select.Item item={item} key={item.value}>
                {item.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
};

export default SelectComponent;