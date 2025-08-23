import React, { useState, useCallback } from 'react';
import {
  Box,
  Stack,
  Center,
  Text,
} from '@chakra-ui/react';
import { useAuthGetMagicCode, useAuthLoading, useAuthMessage, useAuthWaitingForCode, useAuthVerifyMagicCode, useAuthEmail, useSetAuthEmail } from './useAuthStore';
import NeuomorphicButton from '../../components/NeuomorphicButton';
import NeuomorphicInput from '../../components/NeuomorphicInput';

const LoginForm: React.FC = () => {
  const message = useAuthMessage();
  const loading = useAuthLoading();
  const waitingForCode = useAuthWaitingForCode();
  const verifyMagicCode = useAuthVerifyMagicCode();
  const signIn = useAuthGetMagicCode();
  const email = useAuthEmail();
  const setEmail = useSetAuthEmail();
  const [magicCode, setMagicCode] = useState('');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (waitingForCode) {
      await verifyMagicCode(magicCode);
    } else {
      await signIn();
    }
  }, [email, signIn, waitingForCode, magicCode, verifyMagicCode]);

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
              <NeuomorphicInput
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                size="lg"
                required
                disabled={waitingForCode}
              />

              {waitingForCode && (
                <NeuomorphicInput
                  type="text"
                  label="Magic code"
                  value={magicCode}
                  onChange={(e) => setMagicCode(e.target.value)}
                />
              )}

              <NeuomorphicButton
                type="submit"
                size="lg"
                width="full"
                loading={loading}
              >
                {waitingForCode ? 'Verify Magic Code' : 'Send Magic Code'}
              </NeuomorphicButton>
            </Stack>
          </form>
        </Stack>
      </Box>
    </Center>
  );
};

export default LoginForm; 