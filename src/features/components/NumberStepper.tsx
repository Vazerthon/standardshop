import NeuomorphicButton from "@/features/components/NeuomorphicButton";
import { HStack, NumberInput } from "@chakra-ui/react";
import Icons from "@/features/components/Icons";

const NumberStepper: React.FC<{
  value: number;
  onChange: (value: number) => void;
}> = ({ value, onChange }) => {
  const handleIncrement = () => onChange(value + 1);

  const handleDecrement = () => onChange(value - 1);

  return (
    <NumberInput.Root unstyled spinOnPress={false} color="text.primary">
      <HStack gap="2">
        <NumberInput.DecrementTrigger asChild disabled={value === 1}>
          <NeuomorphicButton
            onClick={handleDecrement}
            variant="circular-raised"
          >
            <Icons.Minus />
          </NeuomorphicButton>
        </NumberInput.DecrementTrigger>
        <NumberInput.ValueText
          textAlign="center"
          fontSize="md"
          minW={5}
          maxW={5}
        >
          {value}
        </NumberInput.ValueText>
        <NumberInput.IncrementTrigger asChild>
          <NeuomorphicButton
            onClick={handleIncrement}
            variant="circular-raised"
          >
            <Icons.Plus />
          </NeuomorphicButton>
        </NumberInput.IncrementTrigger>
      </HStack>
    </NumberInput.Root>
  );
};

export default NumberStepper;
