import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { PublishButton } from 'components/competitions/admin/PublishButton';
import { cn } from 'helpers/tailwindUtils';
import { FormEventHandler, useState } from 'react';

interface EndGameDialogProps {
  gameIsOver: boolean;
  connectionState: string;
  onEndGame: () => Promise<void>;
}

const PublishWrapper = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('w-full p-4', className)} {...props} />
);

export const EndGameDialog = ({
  gameIsOver,
  connectionState,
  onEndGame
}: EndGameDialogProps) => {
  const [endGameModalOpen, setEndGameModalOpen] = useState(false);

  const handleEndGame: FormEventHandler = async (event) => {
    event.preventDefault();
    await onEndGame();
    setEndGameModalOpen(false);
  };

  return (
    <PublishWrapper>
      <Dialog open={endGameModalOpen} onOpenChange={setEndGameModalOpen}>
        <DialogTrigger asChild>
          <PublishButton
            variant={'active'}
            onClick={() => setEndGameModalOpen(true)}
            disabled={connectionState !== 'connected'}
          >
            {gameIsOver ? 'Öppna' : 'Avsluta'}
          </PublishButton>
        </DialogTrigger>
        <DialogContent>
          <form onSubmit={handleEndGame} className="contents">
            <DialogHeader>
              <DialogTitle className="m-0">
                {gameIsOver ? 'Öppna' : 'Avsluta'}
              </DialogTitle>
            </DialogHeader>
            <div className="grow">
              {gameIsOver
                ? 'Är du säker på att du vill återöppna spelet och ta bort vinnare?'
                : 'Är du säker på att du vill avsluta spelet och utse vinnare?'}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Nej, avbryt</Button>
              </DialogClose>
              <Button type="submit">
                {gameIsOver ? 'Ja, öppna' : 'Ja, avsluta'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PublishWrapper>
  );
};
