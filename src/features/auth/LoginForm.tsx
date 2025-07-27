import React, { useState, useCallback } from 'react';
import {
  Box,
  Input,
  Button,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useAuthSignIn, useAuthLoading, useAuthMessage } from './useAuthStore';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const signIn = useAuthSignIn();
  const loading = useAuthLoading();
  const message = useAuthMessage();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signIn(email, password);
    } catch (error) {
      // Error handling is now done in the auth store
    }
  }, [email, password, signIn]);

  return (
    <Box maxW="md" mx="auto" mt={8} p={8} borderWidth={1}>
      <Stack gap={6}>
        {message && (
          <Box
            p={3}
            borderRadius="md"
            borderWidth={1}
          >
            <Text fontSize="sm">{message}</Text>
          </Box>
        )}

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Stack gap={4}>
            <Box>
              <Text as="label" display="block" mb={2} fontWeight="medium">
                Email
              </Text>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                size="lg"
                required
              />
            </Box>

            <Box>
              <Text as="label" display="block" mb={2} fontWeight="medium">
                Password
              </Text>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                size="lg"
                required
              />
            </Box>

            <Button
              type="submit"
              size="lg"
              width="full"
              loading={loading}
            >
              Sign In
            </Button>
          </Stack>
        </form>
      </Stack>
    </Box>
  );
};

export default LoginForm; 