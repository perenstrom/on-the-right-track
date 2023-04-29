import styled from 'styled-components';

interface PublishButtonProps {
  readonly variant: 'idle' | 'active';
}

const buttonColors: Record<
PublishButtonProps['variant'],
  { background: string; border: string; hover: string; text: string }
> = {
  idle: {
    background: 'hsl(0, 0%, 85%)',
    border: 'hsl(0, 0%, 60%)',
    hover: 'hsl(0, 0%, 75%)',
    text: 'hsl(0, 0%, 15%)'
  },
  active: {
    background: 'hsl(116, 46%, 55%)',
    border: 'hsl(116, 46%, 30%)',
    hover: 'hsl(116, 46%, 50%)',
    text: 'hsl(0, 0%, 15%)'
  }
};

export const PublishButton = styled.button<PublishButtonProps>`
  border-radius: 4px;
  padding: 0 1rem;
  width: 100%;

  color: ${({ variant }) => buttonColors[variant].text};

  background-color: ${({ variant }) => buttonColors[variant].background};
  border: 1px solid ${({ variant }) => buttonColors[variant].border};

  &:hover {
    background-color: ${({ variant }) => buttonColors[variant].hover};
  }
`;
