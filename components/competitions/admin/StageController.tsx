import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause } from '@fortawesome/free-solid-svg-icons';
import { cn } from 'helpers/tailwindUtils';

const buttonClasses = cn(
  'border-t-solid flex-1 border-t border-black bg-transparent text-2xl',
  'last:border-l-solid last:border-l',
  'hover:bg-[#bfbfbf]',
  'disabled:hover:bg-transparent'
);

export const StageController: React.FC<{
  next: () => void;
  previous: () => void;
  currentStage: string;
  previousStage?: string;
  nextStage?: string;
  heading: string;
  connectionState: 'connected' | 'connecting' | 'disconnected';
  isLoading?: boolean;
}> = ({
  next,
  previous,
  currentStage,
  previousStage,
  nextStage,
  heading,
  connectionState,
  isLoading = false
}) => {
  const prevContent =
    previousStage === 'start' ? (
      <FontAwesomeIcon icon={faPause} />
    ) : !previousStage ? (
      '< '
    ) : (
      `< ${previousStage}`
    );

  const nextContent =
    nextStage === 'end' ? (
      <FontAwesomeIcon icon={faPause} />
    ) : !nextStage ? (
      '> '
    ) : (
      `${nextStage} >`
    );

  return (
    <div className="border-y-solid mb-4 flex w-full flex-col items-center border-y-2 border-y-black bg-white">
      <h3 className="m-0 pt-2 text-2xl">{heading}</h3>
      <span className="mb-2 text-[4rem] leading-none font-medium">
        {currentStage}
      </span>
      <div className="flex w-full content-between">
        <button
          className={buttonClasses}
          type="button"
          onClick={() => previous()}
          disabled={
            !previousStage || connectionState !== 'connected' || isLoading
          }
        >
          {prevContent}
        </button>
        <button
          className={buttonClasses}
          type="button"
          onClick={() => next()}
          disabled={!nextStage || connectionState !== 'connected' || isLoading}
        >
          {nextContent}
        </button>
      </div>
    </div>
  );
};
