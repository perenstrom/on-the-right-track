import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PublishButton } from './PublishButton';
import { deleteCompetition } from 'services/local';

interface DeleteCompetitionDialogProps {
  competitionId: string;
  competitionName: string;
}

export const DeleteCompetitionDialog = ({
  competitionId,
  competitionName
}: DeleteCompetitionDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteCompetition(competitionId);
      // Redirect to home page after successful deletion
      router.push('/');
    } catch (error) {
      console.error('Failed to delete competition:', error);
      setIsDeleting(false);
      // Could add error toast here
    }
  };

  return (
    <div className="w-full">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <PublishButton variant="idle">Radera tävling</PublishButton>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="m-0 mb-4">Radera tävling</DialogTitle>
            <DialogDescription className="space-y-2" asChild>
              <div>
                <p>
                  Är du säker på att du vill radera tävlingen{' '}
                  <strong>{competitionName}</strong>?
                </p>
                <p className="text-destructive font-semibold">
                  Detta kommer radera tävlingen och dölja den från alla
                  användare.
                </p>
                <p className="text-sm">
                  Alla lag, moment, och poäng kommer att bevaras i databasen men
                  tävlingen kommer inte längre vara tillgänglig.
                </p>
                <p className="font-semibold">Denna åtgärd kan inte ångras.</p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isDeleting}
            >
              Avbryt
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Raderar...' : 'Radera tävling'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
