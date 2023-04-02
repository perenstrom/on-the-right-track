import { Segment, SegmentType } from '@prisma/client';
import { UncreatedSegment } from 'types/types';

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

export const getShortSegmentTypeName = (type: SegmentType) => {
  switch (type) {
    case 'TRIP':
      return 'R';
    case 'QUESTION':
      return 'F';
    case 'MUSIC':
      return 'M';
    case 'SPECIAL':
      return 'S';
  }
};

export const getFullSegmentName = (segment: UncreatedSegment | Segment) => {
  switch (segment.type) {
    case 'QUESTION':
      return `${getSegmentTypeName(segment.type)} ${segment.nearestTrip}:${
        segment.orderOfType
      }`;
    case 'TRIP':
    case 'MUSIC':
    case 'SPECIAL':
      return `${getSegmentTypeName(segment.type)} ${segment.orderOfType}`;
  }
};

export const getShortSegmentName = (segment: UncreatedSegment | Segment) => {
  switch (segment.type) {
    case 'QUESTION':
      return `${getShortSegmentTypeName(segment.type)} ${segment.nearestTrip}:${
        segment.orderOfType
      }`;
    case 'TRIP':
    case 'MUSIC':
    case 'SPECIAL':
      return `${getShortSegmentTypeName(segment.type)} ${segment.orderOfType}`;
  }
};
