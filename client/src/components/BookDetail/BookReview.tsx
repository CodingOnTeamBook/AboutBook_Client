import React, { FunctionComponent, useState, useEffect } from 'react';
import styled from 'styled-components';
import { ProfileImg } from '../../style/componentStyled';
import FavoriteIcon from '@material-ui/icons/Favorite';
import SmsIcon from '@material-ui/icons/Sms';
import { useSelector } from 'react-redux';
import { RootState } from 'modules/rootReducer';
import axios from 'axios';
import TransferDate from '../../globalFunction/TransferDate';
import { myProfileImg } from '../../globalFunction/myInfoDefaultValue';
import { useHistory } from 'react-router';

const Container = styled.main`
  margin: 50px 0;
  height: 80v;
  background-color: ${(props) => props.theme.palette.green};
`;

const TabContainer = styled.div`
  width: 100%;
  text-align: center;
`;

const Tab = styled.button`
  width: 50%;
  height: 3em;
  font-size: 20px;
  border: 0px;
  padding: 12px;
  cursor: pointer;
  background-color: ${(props) => props.theme.palette.lightgreen};

  &.selected {
    background-color: ${(props) => props.theme.palette.green};
  }
`;

const ReviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 88%;
  overflow: auto;
  padding: 18px;
`;

const Review = styled.div`
  display: flex;
  width: 90%;
  padding: 20px;
  margin: 10px 0;
  justify-content: space-around;
  align-items: center;
  border: 4px solid ${(props) => props.theme.palette.white};
  border-radius: 18px;
  box-shadow: 0 12px 16px ${(props) => props.theme.palette.darkgreen};
  background-color: ${(props) => props.theme.palette.white};

  .review_contents {
    width: 70%;
  }

  .review_comments {
    text-align: right;
  }
`;

const LikedIcon = styled(FavoriteIcon)`
  color: red;
  margin: 0 4px;
  font-size: 18px;
`;

const CommentsIcon = styled(SmsIcon)`
  margin: 0 4px;
  font-size: 18px;
`;

const SeeMore = styled.span`
  color: ${(props) => props.theme.palette.darkgreen};
  cursor: pointer;
`;

const ErrorMsg = styled.h1`
  margin: auto;
  color: ${(props) => props.theme.palette.white};
`;

const NoResultMsg = styled.h1`
  margin: auto;
  color: ${(props) => props.theme.palette.white};
`;

//bookreview 넘겨받은 초기 배열로 review 뿌려주서(캐싱 개념으로 가지고 있기)
//state를 따로 관리해서 인기순 누르면 fetchAPI 호출 후 리로딩
//다음 페이지로 넘어갈 때는 Link to={`/review/${id}`}로 작성 ( Link가 React에서 최적화 되어있기도 하고 가독성이 좋아서.)
//빈 값일 때는 따로 return 하기 안에서 {isEmpty && }이런식으로 작성하지 말구
const BookReview: FunctionComponent = () => {
  const { bookInfo } = useSelector((state: RootState) => state.book);
  const history = useHistory();
  const [reviews, setReviews] = useState([]);
  const [isEmptyReviews, setIsEmptyReviews] = useState<null | boolean>(null);
  const [isError, setError] = useState<null | boolean>(null);

  const [tabs, setTabs] = useState([
    { name: '최신순', selected: true },
    { name: '인기순', selected: false },
  ]);

  useEffect(() => {
    fetchReviews('created');
  }, []);

  const fetchReviews = async (sortBy: string) => {
    try {
      const response = await axios.post(`/api/review/load/${bookInfo?.isbn}`, {
        orderby: `${sortBy}`,
      });
      if (response.data.reviews.length) {
        setReviews(response.data.reviews);
        setIsEmptyReviews(false);
        setError(false);
      } else {
        setIsEmptyReviews(true);
        setError(false);
      }
    } catch (err) {
      setError(true);
    }
  };

  const onClick = (index: number) => {
    switchTab(index);
    switch (index) {
      case 0:
        return fetchReviews('created');
      case 1:
        return fetchReviews('popularity');
      default:
        return;
    }
  };

  function switchTab(index: number) {
    const tmp = [...tabs];
    tmp[index].selected = true;
    index === 0 ? (tmp[1].selected = false) : (tmp[0].selected = false);
    setTabs(tmp);
  }

  const onClickSeeDetail = (id: number) => history.push(`/review/${id}`);

  return (
    <Container>
      <TabContainer>
        {tabs.map(({ name, selected }, index) => (
          <Tab
            key={index}
            onClick={() => onClick(index)}
            className={selected ? 'selected' : ''}
          >
            {name}
          </Tab>
        ))}
      </TabContainer>
      <ReviewContainer>
        {isError && (
          <ErrorMsg>
            에러가 발생했어요😨 <br /> 나중에 다시 시도해주세요
          </ErrorMsg>
        )}
        {isEmptyReviews && (
          <NoResultMsg>
            아직 작성된 리뷰가 없어요😢 <br /> 첫 리뷰를 작성해주세요!
          </NoResultMsg>
        )}
        {tabs[0].selected ? (
          <>
            {reviews.map(
              (
                {
                  commentCount,
                  likeCount,
                  summary,
                  writer,
                  writerProfileImg,
                  createdAt,
                  id,
                },
                index: number
              ) => (
                <Review key={index}>
                  <ProfileImg
                    src={
                      !writerProfileImg
                        ? myProfileImg('defaultImg')
                        : writerProfileImg
                    }
                  />
                  <div className="review_contents">
                    <h3>
                      {TransferDate(createdAt)} {writer} 님이 올리신 리뷰입니다.
                    </h3>
                    <h4>
                      {summary}
                      <SeeMore onClick={() => onClickSeeDetail(id)}>
                        {' '}
                        ....더보기
                      </SeeMore>
                    </h4>
                    <div className="review_comments">
                      <LikedIcon />
                      {likeCount} <CommentsIcon />
                      {commentCount}
                    </div>
                  </div>
                </Review>
              )
            )}
          </>
        ) : (
          <>
            {reviews.map(
              (
                {
                  commentCount,
                  likeCount,
                  summary,
                  writer,
                  writerProfileImg,
                  createdAt,
                  id,
                },
                index: number
              ) => (
                <Review key={index}>
                  <ProfileImg
                    src={
                      !writerProfileImg
                        ? myProfileImg('defaultImg')
                        : writerProfileImg
                    }
                  />
                  <div className="review_contents">
                    <h3>
                      {TransferDate(createdAt)} {writer} 님이 올리신 리뷰입니다.
                    </h3>
                    <h4>
                      {summary}
                      <SeeMore onClick={() => onClickSeeDetail(id)}>
                        {' '}
                        ....더보기
                      </SeeMore>
                    </h4>
                    <div className="review_comments">
                      <LikedIcon />
                      {likeCount}
                      <CommentsIcon />
                      {commentCount}
                    </div>
                  </div>
                </Review>
              )
            )}
          </>
        )}
      </ReviewContainer>
    </Container>
  );
};

export default BookReview;
