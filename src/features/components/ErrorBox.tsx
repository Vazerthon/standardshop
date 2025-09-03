import React from 'react';
import { Box, Text } from '@chakra-ui/react';

interface ErrorBoxProps {
  error: Error;
}

const ErrorBox: React.FC<ErrorBoxProps> = ({ error }) => {
  return (
    <Box
      p={4}
      mt={4}
      borderRadius="xl"
      boxShadow="neuomorphicInset"
    >
      <Text fontSize="sm" color="text.primary">
        {error.message}
      </Text>
    </Box>
  );
};

export default ErrorBox;
