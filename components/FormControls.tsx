import styled from 'styled-components';
import { Button } from './Button';

export const Label = styled.label`
  display: block;
  font-weight: 500;
`;

export const Input = styled.input`
  width: 100%;
  max-width: 25rem;
  margin-bottom: 1rem;
`;

export const SubmitButton = styled(Button)`
  background-color: hsl(116, 46%, 55%);
  border: 1px solid hsl(116, 46%, 30%);

  &:hover {
    background-color: hsl(116, 46%, 50%);
  }
`;
