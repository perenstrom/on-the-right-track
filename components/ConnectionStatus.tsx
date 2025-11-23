import { faCircle, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const colorMap = {
  connected: 'hsl(116, 46%, 55%)',
  connecting: 'orange',
  disconnected: 'red'
};

export const ConnectionStatus: React.FC<{
  state: 'connected' | 'connecting' | 'disconnected';
}> = ({ state }) => {
  return (
    <div className="absolute top-0 right-0 z-5 flex h-[1.2rem] w-[1.2rem] items-center justify-center">
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
    </div>
  );
};
