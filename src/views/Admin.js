import React, {useState, useEffect} from 'react';
import {
  Container,
  Card,
  Col,
  Form,
  Button,
  Row,
  ProgressBar,
  Alert,
} from 'react-bootstrap';
import {storageRef, db} from '../firebase';
import ListItems from '../components/ListItems';
import QuestionMark from '../components/utilities/logos/QuestionMark';
import './Admin.css';
import {getDateTime} from '../components/utilities/getDateTime';
import setTableCategoryName from '../components/utilities/setTableCategoryName';
import setUserChoice from '../components/utilities/setUserChoice';
import getFileDuration from '../components/utilities/getFileDuration';
import checkFileType from '../components/utilities/checkFileType';
const Admin = () => {
  const [file, setFile] = useState(null);
  const [alert, setAlert] = useState(false);
  const [alertD, setAlertD] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadTime, setUploadTime] = useState('');
  const [category, setCategory] = useState('remixes');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  let container = [];

  const handleDelete = (item, disable) => {
    disable(true);
    const deleteRef = storageRef.child(`${category}/${item.name}`);
    deleteRef
      .delete()
      .then(() => {
        db.collection(category)
          .doc(item.name)
          .delete()
          .then(() => {
            downloadMusic(category);
            disable(false);
          });
      })
      .catch((e) => {
        setAlert(true);
        setMessage("It appears there's no such file in database!");
        disable(false);
        setTimeout(() => {
          setAlert(false);
          setMessage('');
        }, 2000);
      });
  };

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
    downloadMusic(category);
  }, [category]);

  const handleUpload = (e) => {
    e.preventDefault();
    if (
      fileType === 'mp3' &&
      fileName.length !== 0 &&
      !/^ *$/.test(fileName) &&
      duration
    ) {
      setAlert(false);
      setCompleted(false);
      const metadata = {
        name: fileName,
        duration: duration,
        uploadTime: uploadTime,
      };
      const uploadTask = storageRef
        .child(`${category}/${metadata.name}`)
        .put(file, metadata);

      setProgress(0);
      uploadTask.on(
        'state_changed',
        (snapschot) => {
          setIsUploading(true);
          const progress = Math.round(
            (snapschot.bytesTransferred / snapschot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (err) => {
          setIsUploading(false);
          setProgress(0);
          setAlert(true);
          setMessage(err.message);
        },
        () => {
          const audioDataUpload = new Promise((resolve, reject) => {
            resolve(
              uploadTask.snapshot.ref.getMetadata().then((data) => {
                db.collection(category).doc(metadata.name).set({
                  name: data.name,
                  duration: duration,
                  uploadTime: uploadTime,
                });
              })
            );
          });

          audioDataUpload
            .then(() => {
              uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                db.collection(category).doc(metadata.name).update({
                  musicSrc: downloadURL,
                });
              });
            })
            .then(() => {
              setIsUploading(false);
              setCompleted(true);
              setDuration(null);
              setFileName('');
              setFileType(null);
              downloadMusic(category);
            })
            .catch((err) => {
              setIsUploading(false);
              setProgress(0);
              setAlert(true);
              setMessage(err.message);
            });
        }
      );
    } else {
      if (file == null || fileType !== 'mp3') {
        setAlert(true);
        setMessage('Please choose mp3 file.');
      } else if (duration === null) {
        setAlert(true);
        setMessage('Wait a second... Duration data is being loaded.');
      } else if (fileName.length === 0 || /^ *$/.test(fileName)) {
        setAlert(true);
        setMessage('Filename cannot be empty.');
      }
    }
  };

  return (
    <Container fluid className="customAdminBackground">
      <Container className="text-center">
        <h2 className="display-5 pt-3 mb-4 text-light">Content management</h2>
        <p className="lead font-weight-bold text-light">Music upload system</p>
        <Row className="d-flex justify-content-center">
          <Col lg={12}>
            {alertD && (
              <Alert
                onClose={() => setAlertD(false)}
                dismissible
                variant="info"
              >
                <Alert.Heading>Instruction. (Work in progress)</Alert.Heading>
                <ul
                  style={{
                    paddingLeft: 0,
                    listStylePosition: 'inside',
                    textAlign: 'left',
                  }}
                >
                  <li>Choose music category.</li>
                  <li>Choose mp3 file to upload.</li>
                  <li>
                    Wait until all three fields in "Detected metadata" are
                    filled. (1-5s.)
                  </li>
                  <li>In "Detected metadata" you can change file title.</li>
                  <li>Click upload.</li>
                  <li>Message will appear when upload is completed.</li>
                  <li>
                    List of songs in current category will be automatically
                    updated. (If not, refresh.)
                  </li>
                  <li>Refresh the page if you want to cancel the upload.</li>
                  <li>
                    Click delete button next to the file you want to remove.
                  </li>
                  <br />
                  <ul>
                    <li>
                      You may expierience some random crashes of this system and
                      it is expected at this point. (Simple refresh will bring
                      things back to normal) There' still some work to do with
                      stability and error handling of this system. Will fix that
                      soon. 🙂
                    </li>
                    <li>More features soon.</li>
                  </ul>
                </ul>
              </Alert>
            )}
          </Col>
        </Row>
        <Row className="d-flex justify-content-center">
          <Col lg={6}>
            <Card className="mt-2 shadow p-3 mb-5 bg-white rounded">
              <Card.Title className="text-center mt-2 mb-3" md={4}>
                Choose category and file to upload.
              </Card.Title>
              <Card.Body>
                <Row>
                  <Col className="mx-auto">
                    <Form
                      className="text-center"
                      action="/data"
                      method="post"
                      encType="multipart/form-data"
                    >
                      <Form.Group>
                        <Form.Control
                          disabled={isUploading}
                          as="select"
                          className="mr-sm-2"
                          label="Choose category."
                          id="inlineFormCustomSelect"
                          custom
                          onChange={(e) =>
                            setUserChoice(e.target.value, setCategory)
                          }
                        >
                          <option value="0">Remixes</option>
                          <option value="1">Dj sets</option>
                          <option value="2">Original music</option>
                          <option value="3">Projects</option>
                        </Form.Control>
                        <Form.File
                          disabled={isUploading}
                          type="file"
                          name="song"
                          id="song"
                          label="Choose audio file to upload."
                          required
                          className="mt-4"
                          onChange={(e) => {
                            setAlert(false);
                            setMessage(false);
                            setDuration(null);
                            setFileName('');
                            setFileType(null);
                            const file = e.target.files[0];
                            setFile(file);
                            if (file !== null && file !== undefined) {
                              const time = getDateTime();
                              setUploadTime(time);
                              checkFileType(file, setFileType, setFileName);
                              getFileDuration(file, setDuration);
                            }
                          }}
                        />
                        <ProgressBar className="mt-5" now={progress} />
                      </Form.Group>
                      <Button
                        onClick={!isUploading ? handleUpload : undefined}
                        className="mt-4"
                        variant="success"
                      >
                        Upload
                      </Button>
                      <Alert className="mt-3" variant="danger" show={alert}>
                        {message}
                      </Alert>
                      <Alert
                        className="mt-3"
                        variant="success"
                        show={completed}
                      >
                        Upload completed
                      </Alert>
                    </Form>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6}>
            <Card className="mt-2 shadow p-3 mb-5 bg-white rounded">
              <Card.Title className="text-center mt-3 mb-3">
                Detected metadata.
              </Card.Title>
              <Card.Body>
                <Row>
                  <Col className="text-left">
                    <p className="lead">
                      <span className="font-weight-bold">Title: </span>
                      {/* {fileName} */}
                      <input
                        minLength={5}
                        maxLength={100}
                        className="editable_title"
                        type="text"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        disabled={isUploading}
                      />
                    </p>
                    <p className="lead">
                      <span className="font-weight-bold">Duration: </span>
                      {duration}
                    </p>
                    <p className="lead">
                      <span className="font-weight-bold">File type: </span>
                      {fileType}
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg={12} className="pb-5">
            <h3 className="display-5 pt-3 mb-4 text-light">
              List of tracks in {setTableCategoryName(category)}
            </h3>
            <ListItems
              isUploading={isUploading}
              playlist={data}
              load={loading}
              handleDelete={handleDelete}
              setIsUploading={setIsUploading}
            />
          </Col>
        </Row>
      </Container>
      <div className="question" onClick={() => setAlertD(!alertD)}>
        <QuestionMark />
        <p className="instr">Instructions</p>
      </div>
    </Container>
  );
};

export default Admin;
