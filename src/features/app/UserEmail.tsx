import { Text } from '@chakra-ui/react';
import { useCurrentUser } from '../auth/useAuthStore';

function UserEmail() {
  const user = useCurrentUser();

  return (
    (<Text color="text.secondary">{user.email}</Text>)
  );
}

export default UserEmail;
