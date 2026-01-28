import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { PublishButton } from './PublishButton';
import { CopyToClipboardButton } from './CopyToClipboardButton';

export const CompetitionLinks = ({
  competitionId
}: {
  competitionId: string;
}) => {
  const baseUrl =
    typeof window !== 'undefined'
      ? `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/competitions/${competitionId}`
      : '';

  return (
    <div className="w-full">
      <Dialog>
        <DialogTrigger asChild>
          <PublishButton variant="idle">Länkar</PublishButton>
        </DialogTrigger>
        <DialogContent className="w-fit">
          <DialogHeader>
            <DialogTitle className="m-0 mb-4">
              Länkar för den här tävlingen
            </DialogTitle>
            <DialogDescription asChild>
              <div className="text-primary m-0 flex flex-col gap-3">
                <div className="flex flex-col items-start">
                  <strong>Admingränssnitt:</strong>
                  <a href={`${baseUrl}/admin`}>{`${baseUrl}/admin`}</a>
                  <CopyToClipboardButton
                    text={baseUrl ? `${baseUrl}/admin` : ''}
                    disabled={!baseUrl}
                    className="mt-1"
                  />
                </div>
                <div className="flex flex-col items-start">
                  <strong>Poängtavla:</strong>
                  <a href={`${baseUrl}/scores`}>{`${baseUrl}/scores`}</a>
                  <CopyToClipboardButton
                    text={baseUrl ? `${baseUrl}/scores` : ''}
                    disabled={!baseUrl}
                    className="mt-1"
                  />
                </div>
                <div className="flex flex-col items-start">
                  <strong>Spelarvy:</strong>
                  <a href={`${baseUrl}/play`}>{`${baseUrl}/play`}</a>
                  <CopyToClipboardButton
                    text={baseUrl ? `${baseUrl}/play` : ''}
                    disabled={!baseUrl}
                    className="mt-1"
                  />
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};
