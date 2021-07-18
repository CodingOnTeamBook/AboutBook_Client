import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

const BookCover = styled(Box)`
  width: 250px;
`;

const BookImg = styled.img`
  width: 100%;
  height: 100%;
  margin-right: 10%;
  object-fit: cover;
  transition: all 0.2s linear;
  &:hover {
    transform: scale(1.1);
  }
`;

const BookTitle = styled.span`
  font-size: 2rem;
  margin-bottom: 10px;
`;

const BookInfoDetail = styled.span`
  margin-bottom: 15px;
  font-size: 1.4rem;
  &::after {
    content: '|';
  }
  &:last-child:after {
    content: '';
  }
  &:not(:last-of-type) {
    content: '';
    margin-right: 10px;
  }
`;

const BookPlot = styled(Box)`
  font-size: 1.2rem;
`;

interface IBookInfoProps {
  id: string;
  writer: string;
  year: string;
  genre: string;
  publisher: string;
  title: string;
  plot: string;
  bookCover: string;
}

const BookInfo: FunctionComponent<IBookInfoProps> = ({
  id,
  writer,
  year,
  genre,
  publisher,
  title,
  plot,
  bookCover,
}: IBookInfoProps) => {
  return (
    <>
      <Box display="flex" flexDirection="row">
        <Grid container>
          <Grid item lg={3} xl={3}>
            <BookCover>
              <BookImg alt={title} src={bookCover} />
            </BookCover>
          </Grid>
          <Grid item xs={12} sm={12} lg={9} xl={9}>
            <Box display="flex" flexDirection="column">
              <BookTitle> {title} </BookTitle>
              <Box display="flex" flexDirection="row" flexWrap="wrap">
                <BookInfoDetail> {writer} </BookInfoDetail>
                <BookInfoDetail> {year} </BookInfoDetail>
                <BookInfoDetail> {genre} </BookInfoDetail>
                <BookInfoDetail> {publisher} </BookInfoDetail>
              </Box>
              <BookPlot>
                <p> {plot} </p>
              </BookPlot>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default BookInfo;
