import { Box, BoxProps, Flex } from "@chakra-ui/react";
import { transitions } from "@/theme";
import { useScrollDirection } from "../hooks/useScrollDirection";
import { useExtraContentRenderFunction } from "./useMenuBarStore";

interface MenuBarProps extends BoxProps {
  children?: React.ReactNode;
}

export function MenuBar({ children, ...props }: MenuBarProps) {
  const scrollDirection = useScrollDirection();
  const extraContentRenderFunction = useExtraContentRenderFunction();
  const isVisible = scrollDirection === "up" || scrollDirection === null;

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      bg="surface.primary"
      boxShadow="neuomorphic"
      transform={isVisible ? "translateY(0)" : "translateY(-100%)"}
      transition={transitions.default}
      {...props}
    >
      <Flex align="center" justify="space-between" px={6} py={4} minH={12}>
        {children}
        {extraContentRenderFunction?.()}
      </Flex>
    </Box>
  );
}
