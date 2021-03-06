import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { db } from "../../firebase";
import MusicPlayer from "../../components/MusicPlayer/MusicPlayer";

const Category1 = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  let container = [];

  const downloadMusic = (location) => {
    db.collection(location)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          container.push(doc.data());
        });
      })
      .finally(() => {
        setData(container);
        setLoading(false);
      });
  };

  useEffect(() => {
    downloadMusic("remixes");
   
  }, []);

  return (
    <Container sm={12}>
      <h5 className="display-4 text-center text-dark mb-4">
        Remix
      </h5>
      {
        <MusicPlayer
          playlist={data}
          load={loading}
          W
        />
      }
    </Container>
  );
};

export default Category1;
