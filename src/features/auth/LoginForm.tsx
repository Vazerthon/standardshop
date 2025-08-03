import React, { useState, useCallback } from 'react';
import {
  Box,
  Input,
  Stack,
  Text,
  Center,
} from '@chakra-ui/react';
import { useAuthSignIn, useAuthLoading, useAuthMessage } from './useAuthStore';
import NeuomorphicButton from '../../components/NeuomorphicButton';

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
    <Center minH="100vh" px={4}>
      <Box 
        maxW="md" 
        w="full"
        p={8} 
        bg="surface.primary"
        borderRadius="2xl"
        boxShadow="neuomorphicLarge"
      >
        <Stack gap={6}>
          {message && (
            <Box
              p={4}
              borderRadius="xl"
              bg={message.includes('error') ? 'red.50' : 'blue.50'}
              boxShadow="neuomorphicInset"
            >
              <Text fontSize="sm" color={message.includes('error') ? 'red.700' : 'blue.700'}>
                {message}
              </Text>
            </Box>
          )}

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Stack gap={6}>
              <Box>
                <Text as="label" display="block" mb={3} fontWeight="medium" color="text.primary">
                  Email
                </Text>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  size="lg"
                  required
                  bg="surface.primary"
                  border="none"
                  borderRadius="xl"
                  boxShadow="neuomorphicInset"
                  _focus={{
                    boxShadow: "neuomorphicInsetHover",
                    outline: "none"
                  }}
                  color="text.primary"
                  _placeholder={{ color: "text.secondary" }}
                />
              </Box>

              <Box>
                <Text as="label" display="block" mb={3} fontWeight="medium" color="text.primary">
                  Password
                </Text>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  size="lg"
                  required
                  bg="surface.primary"
                  border="none"
                  borderRadius="xl"
                  boxShadow="neuomorphicInset"
                  _focus={{
                    boxShadow: "neuomorphicInsetHover",
                    outline: "none"
                  }}
                  color="text.primary"
                  _placeholder={{ color: "text.secondary" }}
                />
              </Box>

              <NeuomorphicButton
                type="submit"
                size="lg"
                width="full"
                loading={loading}
              >
                Sign In
              </NeuomorphicButton>
            </Stack>
          </form>
        </Stack>
      </Box>
    </Center>
  );
};

export default LoginForm; 