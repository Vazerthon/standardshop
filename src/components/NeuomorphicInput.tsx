import React from 'react';
import { Input, InputProps, FieldRoot, FieldLabel, FieldErrorText } from '@chakra-ui/react';
import { transitions } from '@/theme';

interface NeuomorphicInputProps extends Omit<InputProps, 'variant'> {
  label?: string;
  error?: string;
}

const NeuomorphicInput: React.FC<NeuomorphicInputProps> = ({ 
  label,
  error,
  children,
  ...props 
}) => {
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

  const inputElement = (
    <Input
      {...baseStyles}
      {...props}
    />
  );

  if (label || error) {
    return (
      <FieldRoot>
        {label && (
          <FieldLabel 
            display="block" 
            mb={3} 
            fontWeight="medium" 
            color="text.primary"
          >
            {label}
          </FieldLabel>
        )}
        {inputElement}
        {error && <FieldErrorText>{error}</FieldErrorText>}
      </FieldRoot>
    );
  }

  return inputElement;
};

export default NeuomorphicInput;
