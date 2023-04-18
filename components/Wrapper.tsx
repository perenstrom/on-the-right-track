import styled from 'styled-components';

export const Wrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
  padding-top: 6rem;

  @media (max-width: 768px) {
    margin-top: 0;
    padding-top: 2rem;
  }
`;
