import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
  ArrowLeft,
  ArrowRight,
  FlagTriangleRight,
  PauseIcon
} from 'lucide-react';

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
      <>
        <ArrowLeft /> <PauseIcon />
      </>
    ) : !previousStage ? (
      <ArrowLeft />
    ) : (
      <>
        <ArrowLeft />
        {previousStage}
      </>
    );

  const nextContent =
    nextStage === 'end' ? (
      <>
        <FlagTriangleRight /> <ArrowRight />
      </>
    ) : !nextStage ? (
      <ArrowRight />
    ) : (
      <>
        {nextStage}
        <ArrowRight />
      </>
    );

  return (
    <div className="mb-2 flex w-full flex-col items-center rounded-none border-y border-black bg-white">
      <h3 className="m-0 pt-2 text-2xl">{heading}</h3>
      <span className="mb-2 text-[4rem] leading-none font-medium">
        {currentStage}
      </span>
      <div className="flex w-full content-between">
        <ButtonGroup className="w-full justify-center p-1">
          <Button
            variant="outline"
            className="flex-1 grow border-zinc-900 text-lg"
            onClick={() => previous()}
            size="lg"
            disabled={
              !previousStage || connectionState !== 'connected' || isLoading
            }
          >
            {prevContent}
          </Button>
          <Button
            variant="outline"
            className="flex-1 grow border-zinc-900 text-lg"
            onClick={() => next()}
            size="lg"
            disabled={
              !nextStage || connectionState !== 'connected' || isLoading
            }
          >
            {nextContent}
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};
