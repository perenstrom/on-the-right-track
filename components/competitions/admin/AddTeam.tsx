import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

const AddButton = styled.button`
  background: hsl(60 0% 92%);
  color: hsl(60 0% 80%);
  border: none;
  border-radius: 10px;

  &:hover {
  color: hsl(60 0% 78%);
  }
`;

export const AddTeam: React.FC<{
  triggerAdd: () => void;
}> = ({ triggerAdd }) => {
  return (
    <AddButton type="button" onClick={() => triggerAdd()}>
      <FontAwesomeIcon icon={faPlus} size='6x'/>
    </AddButton>
  );
};
