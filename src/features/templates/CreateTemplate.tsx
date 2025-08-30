import { useState } from 'react';
import {
  Flex,
} from '@chakra-ui/react';
import { useCreateTemplate } from './useTemplates';
import NeuomorphicButton from '@/features/components/NeuomorphicButton';
import { useCurrentUser } from '../auth/useAuthStore';
import NeuomorphicInput from '../components/NeuomorphicInput';

const TemplateItem: React.FC = () => {
  const createTemplate = useCreateTemplate();
  const user = useCurrentUser();
  const [templateName, setTemplateName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTemplate(templateName.trim(), user.id);
    setTemplateName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex>
        <NeuomorphicInput
          placeholder="Template name"
          mr={2}
          onChange={(e) => setTemplateName(e.target.value)}
          value={templateName}
        />
        <NeuomorphicButton
          type="submit"
          disabled={!templateName.trim()}
          colorScheme="accent"
        >
          Create template
        </NeuomorphicButton>
      </Flex>
    </form>
  );
};

export default TemplateItem; 