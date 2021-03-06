import React from 'react';
import {Container, Row, Col, Card} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import "./Music.css"
import cat1 from '../assets/category1.jpg';
import cat2 from '../assets/category2.jpg';
import cat3 from '../assets/category3.jpg';
import cat4 from '../assets/category4.jpg';
const Music = () => {
  const categories = [
    {title: 'Remix', image: cat1, link: 'remix'},
    {title: 'Dj Sets', image: cat2, link: 'dj-sets'},
    {title: 'Original music', image: cat3, link: 'original-music'},
    {title: 'Projects', image: cat4, link: 'projects'},
  ];
  return (
    <Container>
      <h2 className="display-4 mb-2 mt-4 text-center text-dark">Music</h2>
      <p className="lead text-dark text-center pt-2  mb-3">
        Explore music categories.
      </p>
      <Row className="justify-content-md-center">
        {categories.map((item, i) => (
          <Col className="position-relative" key={i} id={i} xs={12} lg={6}>
            <Card className="position-relative mb-4 " style={{borderRadius: "20px"}}>
              <Link
                style={{textDecoration: 'none',borderRadius: "20px"}}
                className="overflow-hidden text-center demo"
                to={'/music/' + item.link}
              >
                <HeadingContainer image={item.image}>
                  <HeadingOverlay />
                  <Heading>{item.title}</Heading>
                </HeadingContainer>
              </Link>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Music;

const Heading = styled.h3`
  position: relative;
  top: 50%;
  transform: translateY(-60%);
  color: white;
  font-size: 3rem;
  padding: 0 1rem;
  transition: 0.1s ease;
`;

const HeadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: black;
  opacity: 0.6;
  transition: 0.5s ease;
  display: none;
`;

const HeadingContainer = styled.div`
  position: relative;
  background-image: url(${(props) => props.image});
  height: 400px;
  text-align: center;
  border-radius: 20px;
  transition: all 0.5s;
  &:hover ${Heading} {
    font-size: 3.2rem;
    transform: translateY(-50%);
  }
  &:hover ${HeadingOverlay} {
    display: block;
  }
  &:hover {
    transform: scale(1.1);
  }
  @media (max-width: 576px) {
    height: 330px;
    background-position: top;
  }
`;

const TestWrap = styled.div`
 -webkit-box-shadow: 5px 5px 0px 0px #289FED, 10px 10px 0px 0px #5FB8FF, 15px 15px 0px 0px #A1D8FF, 20px 20px 0px 0px #CAE6FF, 25px 25px 0px 0px #E1EEFF, 5px 5px 15px 5px rgba(0,0,0,0); 
  box-shadow: 5px 5px 0px 0px #289FED, 10px 10px 0px 0px #5FB8FF, 15px 15px 0px 0px #A1D8FF, 20px 20px 0px 0px #CAE6FF, 25px 25px 0px 0px #E1EEFF, 5px 5px 15px 5px rgba(0,0,0,0);
`
