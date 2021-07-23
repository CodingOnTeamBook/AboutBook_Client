import React, { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import Person from '../../components/PeopleComponent/Person';
import ReviewItem from '../../components/ReviewComponent/ReviewItem';
import { useParams } from 'react-router';
import axios from 'axios';
import GridMediumItem from 'layout/GridMediumItem';

const PeopleDetailContainer = styled(Grid)`
  margin-top: 30px;
  margin-bottom: 30px;
  width: 100%;
  height: 100%;
`;

const UserInfoContainer = styled(Grid)`
  position: sticky;
  top: 0px;
  height: 100%;
  padding: 0 20px 20px 20px;
`;

const UserReviewContainer = styled(Grid)`
  background-color: white;
  width: 100%;
  z-index: 9;
`;

const Message = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 200;
  font-size: 20px;
  margin: 50px 50px;
`;

//grid는 layout에서 가져다 쓰기(거의 똑같고, children type부분만 다름. 그런데 component라기 보다는 layout이기 때문에 따로 뺐음.)
//여기서 api호출 하고 page네이션도 가능하도록 구현
//값이 없을 때와 에러 부분 헨들링 , 에러는 에러 페이지로 redirect
//reviewMain은 사용자가 수정하는 부분이 없으므로 props로 넘김.

interface NicknameType {
  id: string;
}

const PeopleDetailPage: FunctionComponent = () => {
  const [people, setPeople] = useState({
    nickname: '',
    info: '',
    countUserReviews: 0,
    profileImg: '',
    genres: '',
  });
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { id } = useParams<NicknameType>();

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        setError(null);
        setLoading(true);
        const res = await axios.get(`/api/reviewer/detail/${id}`);
        setPeople(res.data.reviewer);
        setReviews(res.data.reviewer.reviews);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    };
    fetchPerson();
  }, []);

  return (
    <>
      {error || isLoading ? (
        error ? (
          <Message>에러가 발생했습니다 😭</Message>
        ) : (
          <Message> 로딩 중입니다 📚</Message>
        )
      ) : (
        <PeopleDetailContainer container>
          <UserInfoContainer item xs={12} sm={4} zeroMinWidth>
            <Person
              nickname={people.nickname}
              info={people.info}
              countUserReview={people.countUserReviews}
              profileImg={people.profileImg}
              genres={people.genres}
            />
          </UserInfoContainer>
          <UserReviewContainer item xs={12} sm={8} zeroMinWidth>
            {reviews.length == 0 ? (
              <Message> {id}님이 등록하신 리뷰가 없습니다 😥 </Message>
            ) : (
              <Grid container spacing={2}>
                {reviews &&
                  reviews.map((review, index) => (
                    <GridMediumItem key={index}>
                      <ReviewItem
                        id={review.id}
                        cover={review.bookCover}
                        title={review.bookTitle}
                        summary={review.summary}
                        score={review.score}
                        writer={id}
                      />
                    </GridMediumItem>
                  ))}
              </Grid>
            )}
          </UserReviewContainer>
        </PeopleDetailContainer>
      )}
    </>
  );
};

export default PeopleDetailPage;
