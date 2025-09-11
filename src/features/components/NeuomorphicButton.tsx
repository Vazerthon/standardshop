import React from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';
import { transitions } from '@/theme';

interface NeuomorphicButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'raised' | 'inset' | 'circular-raised';
}

const NeuomorphicButton: React.FC<NeuomorphicButtonProps> = ({
  variant = 'raised',
  children,
  ...props
}) => {
  const baseStyles = {
    bg: 'surface.primary',
    color: 'text.primary',
    borderRadius: 'xl',
    border: 'none',
    fontWeight: 'semibold',
    transition: transitions.default,
  };

  const variantStyles = {
    raised: {
      boxShadow: 'neuomorphic',
      _hover: {
        boxShadow: 'neuomorphicHover',
        transform: 'translateY(-2px)',
      },
      _active: {
        boxShadow: 'neuomorphicInset',
        transform: 'translateY(0px)',
      },
    },
    inset: {
      boxShadow: 'neuomorphicInset',
      _hover: {
        boxShadow: 'neuomorphicInsetHover',
      },
    },
    'circular-raised': {
      borderRadius: 'full',
      aspectRatio: '1/1',
      boxShadow: 'neuomorphic',
      _hover: {
        boxShadow: 'neuomorphicHover',
        transform: 'translateY(-2px)',
      },
      _active: {
        boxShadow: 'neuomorphicInset',
        transform: 'translateY(0px)',
      },
    }
  };

  return (
    <Button
      {...baseStyles}
      {...variantStyles[variant]}
      {...props}
    >
      {children}
    </Button>
  );
};

export default NeuomorphicButton; 