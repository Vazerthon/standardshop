import { db } from "@/lib/db";
import { Badge } from "@chakra-ui/react";
const ConnectionIndicator: React.FC = () => {
  const statusMap = {
    connecting: 'authenticating',
    opened: 'authenticating',
    authenticated: 'connected',
    closed: 'closed',
    errored: 'errored',
  };
  const status = db.useConnectionStatus();
  return (
    <Badge variant="subtle">
      {statusMap[status]}
    </Badge>
  );
};

export default ConnectionIndicator;