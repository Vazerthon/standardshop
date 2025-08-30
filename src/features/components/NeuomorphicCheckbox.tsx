import React from "react";
import {
  Checkbox,
  CheckboxRoot,
  CheckboxControl,
  CheckboxIndicator,
  CheckboxLabel,
  type CheckboxRootProps,
} from "@chakra-ui/react";

const NeuomorphicCheckbox: React.FC<CheckboxRootProps> = ({
  children,
  ...props
}: CheckboxRootProps) => {
  return (
    <CheckboxRoot
      borderRadius="lg"
      transition="transitions.default"
      boxShadow="neuomorphic"
      _hover={{
        boxShadow: "neuomorphicHover",
        transform: "translateY(-1px)",
      }}
      _checked={{
        boxShadow: "neuomorphicInset",
        transform: "translateY(0px)",
        border: "1px solid",
        borderColor: "accent.primary",
        borderRadius: "none",
      }}
      {...props}
    >
      <CheckboxControl>
        <Checkbox.HiddenInput />
        <CheckboxIndicator />
      </CheckboxControl>
      {children && <CheckboxLabel>{children}</CheckboxLabel>}
    </CheckboxRoot>
  );
};

export default NeuomorphicCheckbox;
