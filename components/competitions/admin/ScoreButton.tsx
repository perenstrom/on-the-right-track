import styled from 'styled-components';

interface ScoreButtonProps {
  readonly $variant: 'wrong' | 'correct';
}

const buttonColors: Record<
  ScoreButtonProps['$variant'],
  { background: string; border: string; hover: string; text: string }
> = {
  wrong: {
    background: 'hsl(18, 95%, 40%)',
    border: 'hsl(18, 95%, 15%)',
    hover: 'hsl(18, 95%, 35%)',
    text: 'hsl(0, 0%, 100%)'
  },
  correct: {
    background: 'hsl(116, 46%, 55%)',
    border: 'hsl(116, 46%, 30%)',
    hover: 'hsl(116, 46%, 50%)',
    text: 'hsl(0, 0%, 15%)'
  }
};

export const ScoreButton = styled.button<ScoreButtonProps>`
  border-radius: 4px;
  padding: 0 1rem;
  flex: 1;

  color: ${({ $variant }) => buttonColors[$variant].text};

  background-color: ${({ $variant }) => buttonColors[$variant].background};
  border: 1px solid ${({ $variant }) => buttonColors[$variant].border};

  &:hover {
    background-color: ${({ $variant }) => buttonColors[$variant].hover};
  }
`;
