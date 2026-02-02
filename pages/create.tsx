import { Wrapper } from 'components/Wrapper';
import { CompetitionForm } from 'components/CompetitionForm';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { createCompetition } from 'services/local';
import { UncreatedSegment } from 'types/types';

const CreatePage: NextPage = () => {
  const router = useRouter();

  const handleSubmit = async (data: {
    name: string;
    hosts: string;
    date: string;
    segments: UncreatedSegment[];
  }) => {
    await createCompetition({
      competition: {
        name: data.name,
        hosts: data.hosts,
        date: data.date,
        currentLevel: null,
        currentStage: null,
        winnerTeamId: null
      },
      segments: data.segments
    });

    router.push('/');
  };

  return (
    <Wrapper>
      <CompetitionForm mode="create" onSubmit={handleSubmit} />
    </Wrapper>
  );
};

export default CreatePage;
