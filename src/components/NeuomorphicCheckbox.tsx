import React from 'react';
import { CheckboxRoot, CheckboxControl, CheckboxIndicator, CheckboxLabel, type CheckboxRootProps } from '@chakra-ui/react';

const NeuomorphicCheckbox: React.FC<CheckboxRootProps> = ({ children, ...props }) => {
  return (
    <CheckboxRoot
      {...props}
      borderRadius='lg'
      border='none'
      transition="transitions.default"
      boxShadow='neuomorphic'
      _hover={{
        boxShadow: 'neuomorphicHover',
        transform: 'translateY(-1px)',
      }}
      _checked={{
        boxShadow: 'neuomorphicInset',
        transform: 'translateY(0px)',
      }}
    >
      <CheckboxControl>
        <CheckboxIndicator />
      </CheckboxControl>
      {children && <CheckboxLabel>{children}</CheckboxLabel>}
    </CheckboxRoot>
  );
};

export default NeuomorphicCheckbox; 