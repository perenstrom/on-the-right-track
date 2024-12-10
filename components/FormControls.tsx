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

export const TextArea = styled.textarea`
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

export const CancelButton = styled(Button)`
  background-color: hsl(12 100% 50%);
  border: 1px solid hsl(12 100% 40%);

  &:hover {
    background-color: hsl(12 100% 55%);
  }
`;
