import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const AddTeam: React.FC<{
  triggerAdd: () => void;
  connectionState: 'connected' | 'connecting' | 'disconnected';
}> = ({ triggerAdd, connectionState }) => {
  return (
    <button
      className="rounded-lg border-none bg-[hsl(60_0%_92%)] text-[hsl(60_0%_80%)] hover:text-[hsl(60_0%_78%)]"
      type="button"
      onClick={() => triggerAdd()}
      disabled={connectionState !== 'connected'}
    >
      <FontAwesomeIcon icon={faPlus} size="6x" />
    </button>
  );
};
