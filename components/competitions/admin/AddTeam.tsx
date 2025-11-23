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
import { Field, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { createTeam } from 'services/local';
import { UncreatedTeam } from 'types/types';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/router';
import { FormEventHandler, useState } from 'react';

interface AddTeamProps {
  competitionId: string;
  connectionState: 'connected' | 'connecting' | 'disconnected';
}

export const AddTeam: React.FC<AddTeamProps> = ({
  competitionId,
  connectionState
}) => {
  const router = useRouter();
  const [addingTeam, setAddingTeam] = useState(false);
  const [name, setName] = useState('');
  const [members, setMembers] = useState('');

  const handleAddTeam: FormEventHandler = async (event) => {
    event.preventDefault();
    const newTeam: UncreatedTeam = {
      name,
      members,
      competitionId
    };

    await createTeam(newTeam);
    setAddingTeam(false);
    router.replace(router.asPath);
  };

  return (
    <Dialog open={addingTeam} onOpenChange={setAddingTeam}>
      <DialogTrigger asChild>
        <button
          className="flex h-full w-full items-center justify-center rounded-lg border-none bg-[hsl(60_0%_92%)] text-[hsl(60_0%_80%)] hover:text-[hsl(60_0%_78%)]"
          type="button"
          disabled={connectionState !== 'connected'}
        >
          <Plus size={120} />
        </button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleAddTeam} className="contents">
          <DialogHeader>
            <DialogTitle className="m-0">Lägg till lag</DialogTitle>
          </DialogHeader>
          <FieldSet>
            <Field>
              <FieldLabel htmlFor="name">Namn</FieldLabel>
              <Input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="members">
                Medlemmar (ej obligatoriskt)
              </FieldLabel>
              <Input
                type="text"
                id="members"
                name="members"
                value={members}
                onChange={(event) => setMembers(event.target.value)}
              />
            </Field>
          </FieldSet>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Avbryt</Button>
            </DialogClose>
            <Button type="submit">Spara</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
