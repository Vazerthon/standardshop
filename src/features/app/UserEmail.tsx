import { Text } from '@chakra-ui/react';
import { useCurrentUser } from '../auth/useAuthStore';

const UserEmail: React.FC = () => {
  const user = useCurrentUser();

  return (
    (<Text lineClamp={1} color="text.secondary">{user.email}</Text>)
  );
}

export default UserEmail;
