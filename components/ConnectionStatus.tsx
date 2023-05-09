import { faCircle, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 1.2rem;
  height: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
`;

const colorMap = {
  connected: 'hsl(116, 46%, 55%)',
  connecting: 'orange',
  disconnected: 'red'
};

export const ConnectionStatus: React.FC<{
  state: 'connected' | 'connecting' | 'disconnected';
}> = ({ state }) => {
  return (
    <Wrapper>
      <span className="fa-layers fa-fw fa-lg">
        {state === 'connecting' && (
          <FontAwesomeIcon
            icon={faCircleNotch}
            spin
            size="2xs"
            color={colorMap[state]}
          />
        )}
        <FontAwesomeIcon
          icon={faCircle}
          size="2xs"
          transform="shrink-10"
          color={colorMap[state]}
        />
      </span>
    </Wrapper>
  );
};
