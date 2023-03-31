import { SegmentType } from '@prisma/client';

export const getSegmentTypeName = (type: SegmentType) => {
  switch (type) {
    case 'TRIP':
      return 'Resa';
    case 'QUESTION':
      return 'Fråga';
    case 'MUSIC':
      return 'Musik';
    case 'SPECIAL':
      return 'Specialfråga';
  }
};