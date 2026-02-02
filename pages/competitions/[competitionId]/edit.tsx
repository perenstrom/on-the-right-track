import { Wrapper } from 'components/Wrapper';
import { CompetitionForm } from 'components/CompetitionForm';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { updateCompetition, updateSegments } from 'services/local';
import { FullCompetition, UncreatedSegment } from 'types/types';
import { getCompetition } from 'services/prisma';
import { prismaContext } from 'lib/prisma';

interface EditPageProps {
  competition: FullCompetition;
  competitionId: string;
}

const EditPage: NextPage<EditPageProps> = ({ competition, competitionId }) => {
  const router = useRouter();

  const handleSubmit = async (data: {
    name: string;
    hosts: string;
    date: string;
    segments: UncreatedSegment[];
    canEditSegments: boolean;
  }) => {
    // Update competition metadata
    await updateCompetition(competitionId, {
      name: data.name,
      hosts: data.hosts,
      date: data.date
    });

    // Only update segments if allowed
    if (data.canEditSegments) {
      await updateSegments(competitionId, data.segments);
    }

    // Redirect to admin page
    router.push(`/competitions/${competitionId}/admin`);
  };

  const handleCancel = () => {
    router.push(`/competitions/${competitionId}/admin`);
  };

  return (
    <Wrapper>
      <CompetitionForm
        mode="edit"
        initialCompetition={competition}
        competitionId={competitionId}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </Wrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const competitionId = params?.competitionId as string;

  if (!competitionId) {
    return {
      notFound: true
    };
  }

  try {
    const competition = await getCompetition(prismaContext, competitionId);

    return {
      props: {
        competition: JSON.parse(JSON.stringify(competition)), // Serialize dates
        competitionId
      }
    };
  } catch (error) {
    // Competition not found or deleted
    return {
      notFound: true
    };
  }
};

export default EditPage;
