import React from 'react';
import { Center, Spinner, Stack } from '@chakra-ui/react';

const LoadingSpinner: React.FC = () => {
  return (
    <Center minH="100vh">
      <Stack direction="column" align="center">
        <Spinner size="lg" color="accent.primary" />
      </Stack>
    </Center>
  );
};

export default LoadingSpinner;
