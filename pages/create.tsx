import { Wrapper } from 'components/Wrapper';
import { CompetitionForm } from 'components/CompetitionForm';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { createCompetition } from 'services/local';
import { UncreatedSegment } from 'types/types';
import { prismaContext } from 'lib/prisma';
import { getCompetition } from 'services/prisma';

interface Props {
  clonedSegments?: UncreatedSegment[];
}

const CreatePage: NextPage<Props> = ({ clonedSegments }) => {
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

  // Create a minimal initialCompetition with only segments if cloning
  const initialCompetition = clonedSegments ? { segments: clonedSegments } as any : null;

  return (
    <Wrapper>
      <CompetitionForm 
        mode="create" 
        initialCompetition={initialCompetition} 
        onSubmit={handleSubmit} 
      />
    </Wrapper>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const { clone } = context.query;

  // If clone parameter exists, fetch the source competition
  if (clone && typeof clone === 'string') {
    try {
      const sourceCompetition = await getCompetition(prismaContext, clone);
      
      if (sourceCompetition) {
        // Create UncreatedSegments by removing id and competitionId
        const clonedSegments: UncreatedSegment[] = sourceCompetition.segments.map(
          ({ id, competitionId, ...rest }) => rest
        );

        return {
          props: {
            clonedSegments
          }
        };
      }
    } catch (error) {
      console.error('Error fetching competition to clone:', error);
    }
  }

  // Default: no cloned segments
  return {
    props: {}
  };
};

export default CreatePage;
