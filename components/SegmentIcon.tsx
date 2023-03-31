import {
  faCircleQuestion,
  faFeatherPointed,
  faMusic,
  faTrain
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SegmentType } from '@prisma/client';

const style = {
  paddingRight: '0.5rem'
};

export const SegmentIcon: React.FC<{
  type: SegmentType;
}> = ({ type }) => {
  switch (type) {
    case 'TRIP':
      return <FontAwesomeIcon icon={faTrain} style={style} />;
    case 'QUESTION':
      return <FontAwesomeIcon icon={faCircleQuestion} style={style} />;
    case 'MUSIC':
      return <FontAwesomeIcon icon={faMusic} style={style} />;
    case 'SPECIAL':
      return <FontAwesomeIcon icon={faFeatherPointed} style={style} />;
  }
};
