import React, { FunctionComponent, useEffect, useState } from 'react';
import ReviewItem from '../../components/ReviewComponent/ReviewItem';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import GridLayout from '../../components/common/GridLayout';
import axios from 'axios';

const ReviewContainer = styled.div`
  margin-top: 30px;
  margin-bottom: 30px;
  flex-grow: 1;
`;

const SelectSortContainer = styled.div`
  text-align: right;
`;

const SortButton = styled(Button)`
  margin-bottom: 30px;
  border-radius: 50px;
  border: 3px solid ${(props) => props.theme.palette.green};
  color: ${(props) => props.theme.palette.green};
  z-index: 0;
  &:hover {
    background-color: ${(props) => props.theme.palette.green};
    color: white;
  }
  &:not(:last-of-type) {
    margin-right: 10px;
  }
  &.selected {
    background-color: ${(props) => props.theme.palette.green};
    color: white;
  }
`;

const Message = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 300;
  font-size: 30px;
`;

const ReviewPage: FunctionComponent = () => {
  const [createdReviews, setCreatedReviews] = useState<any[]>([]);
  const [populatedReviews, setPopulatedReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sorts, setSorts] = useState([
    { name: '최신순', selected: true },
    { name: '인기순', selected: false },
  ]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setError(null);
        setCreatedReviews([]);
        setPopulatedReviews([]);
        setLoading(true);
        await axios
          .all([
            axios.get('api/review/created'),
            axios.get('api/review/popularity'),
          ])
          .then(
            axios.spread((res1, res2) => {
              setCreatedReviews(res1.data.review);
              setPopulatedReviews(res2.data.review);
            })
          );
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    };
    fetchReviews();
  }, []);

  const onSortChange = (index: number) => {
    const tmp = [...sorts];
    tmp[index].selected = true;
    index === 0 ? (tmp[1].selected = false) : (tmp[0].selected = false);
    setSorts(tmp);
  };

  return (
    <ReviewContainer>
      <SelectSortContainer>
        {sorts.map(({ name, selected }, index) => (
          <SortButton
            size="large"
            key={index}
            onClick={() => onSortChange(index)}
            className={selected ? 'selected' : ''}
          >
            {name}
          </SortButton>
        ))}
      </SelectSortContainer>
      {error || loading ? (
        error ? (
          <Message>에러가 발생했습니다 😭</Message>
        ) : (
          <Message> 로딩 중입니다 📚</Message>
        )
      ) : (
        <GridLayout>
          {sorts[0].selected ? (
            <>
              {createdReviews.map((review, index) => (
                <ReviewItem
                  key={index}
                  id={index}
                  cover={review.cover}
                  title={review.title}
                  summary={review.summary}
                  score={review.score}
                />
              ))}
            </>
          ) : (
            <>
              {populatedReviews.map((review, index) => (
                <ReviewItem
                  key={index}
                  id={index}
                  cover={review.cover}
                  title={review.title}
                  summary={review.summary}
                  score={review.score}
                />
              ))}
            </>
          )}
        </GridLayout>
      )}
    </ReviewContainer>
  );
};

export default ReviewPage;
