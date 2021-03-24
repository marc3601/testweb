import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Alert } from "react-bootstrap";
import PlayButton from "./PlayButton";
import ForwardButton from "./ForwardButton";
import PauseButton from "./PauseButton";
import VolumeLogo from "./VolumeLogo";
import TrackSymbol from "./TrackSymbol";
import Equilizer from "./Equilizer";
import TrackLoading from "./TrackLoading";
import RewindButton from "./RewindButton";

const PlayerWrapper = styled.section`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

const Player = styled.section`
  background: rgb(176, 170, 245);
  background: -moz-radial-gradient(
    circle,
    rgb(207 206 217) 0%,
    rgb(134 137 147) 100%
  );
  background: -webkit-radial-gradient(
    circle,
    rgb(207 206 217) 0%,
    rgb(134 137 147) 100%
  );
  background: radial-gradient(
    circle,
    rgb(207 206 217) 0%,
    rgb(134 137 147) 100%
  );
`;

const PlayList = styled.aside``;

const Timer = styled.div`
  background: black;
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  color: white;
`;

const ProgressBar = styled.div`
  margin-top: -1rem;
  line-height: 1em;
  overflow: hidden;
  padding: 6px 0;
`;

const Input = styled.input.attrs((props) => ({
  type: "range",
  min: 0,
  max: 100,
  step: 0.1,
  value: props.percentage,
}))`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: #f2f2f2;
  height: 8px;
  position: relative;
  width: 100%;
  font-family: sans-serif;
  font-size: 100%;
  line-height: 1.15;
  margin: 0;
  outline: none;
  ::-webkit-slider-thumb {
    -webkit-appearance: none;
    border: 1px solid #000000;
    height: 16px;
    width: 16px;
    border-radius: 3px;
    background: black;
    cursor: pointer;
    /* margin-top: -14px; You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
    /* box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d; Add cool effects to your sliders! */
  }

  ::-moz-range-thumb {
    /* box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d; */
    border: 1px solid #000000;
    height: 16px;
    width: 16px;
    border-radius: 3px;
    background: black;
    cursor: pointer;
  }

  ::-ms-thumb {
    /* box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d; */
    border: 1px solid #000000;
    height: 16px;
    width: 16px;
    border-radius: 3px;
    background: black;
    cursor: pointer;
  }
`;

const PlayerControls = styled.ul`
  display: flex;
  list-style: none;
  padding: 1rem 2rem;
  justify-content: space-between;
`;

const Control = styled.li`
  cursor: pointer;
`;

const SongTitle = styled.h1`
  font-size: 1.5rem;
  line-height: 1em;
  margin: 0.975rem 0 0;
  text-align: center;
`;

const SongSubTitle = styled.h2`
  font-size: 1.2rem;
  line-height: 1em;
  margin: 0.75rem 0 0;
  padding-bottom: 0.75rem;
  color: #4a505c;
  font-weight: 400;
  text-align: center;
`;

const PlayerVolume = styled.div`
  display: flex;
  padding: 2rem;
  justify-content: space-space-around;
`;

const VolumeIcon = styled.div``;

const VolumeSlider = styled.input.attrs((props) => ({
  type: "range",
  min: 0,
  max: 1,
  step: 0.01,
  defaultValue: 0.25,
}))`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: #f2f2f2;
  height: 8px;
  position: relative;
  width: 50%;
  font-family: sans-serif;
  font-size: 100%;
  line-height: 1.15;
  margin: 0;
  outline: none;
  transform: translate(10px, 10px);
  ::-webkit-slider-thumb {
    -webkit-appearance: none;
    border: 1px solid #000000;
    border-radius: 3vw;
    height: 16px;
    width: 16px;
    border-radius: 3px;
    background: black;
    cursor: pointer;
  }

  ::-moz-range-thumb {
    border: 1px solid #000000;
    border-radius: 3vw;
    height: 16px;
    width: 16px;
    border-radius: 3px;
    background: black;
    cursor: pointer;
  }

  ::-ms-thumb {
    border: 1px solid #000000;
    border-radius: 3vw;
    height: 16px;
    width: 16px;
    border-radius: 3px;
    background: black;
    cursor: pointer;
  }
`;

const PlaylistHeader = styled.header`
  position: relative;
  z-index: 1;
  background: black;
  padding: 2.2rem;
  color: #f2f2f2;
  text-align: center;
  -webkit-box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.27);
  -moz-box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.27);
  box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.27);
`;

const PlaylistTitle = styled.h1`
  font-size: 1.95rem;
  line-height: 1em;
  margin: 0 0 0.975rem;
  margin-top: 0;
`;

const PlaylistInfo = styled.p``;

const PlaylistItems = styled.ol`
  position: relative;
  z-index: 0;
  list-style: none;
  margin: 0;
  max-height: 40vh;
  overflow: auto;
  background: #3d5372;
  color: #f2f2f2;
  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: #f5f5f5;
  }
  ::-webkit-scrollbar {
    width: 15px;
    background-color: #f5f5f5;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #172231;
  }
`;

const PlaylistTrack = styled.li`
  border-bottom: 1px solid white;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  margin: 0;
  padding: 2rem 3rem;
  background: ${(props) => (props.isOdd ? `#202020` : `#000`)};
  background: ${(props) => props.isActive && `#6a0707`};
`;

const TrackIcon = styled.div``;

const TrackInfo = styled.div`
  margin: 0 2rem;
  width: 100%;
`;

const TrackTitle = styled.h3`
  font-size: 1.3rem;
  line-height: 1em;
  margin: 0 0 0.75rem;
`;

const TrackSubTitle = styled.span``;

const MusicPlayer = ({ playlist, load }) => {
  const [playIcon, setPlayIcon] = useState(true);
  const [audioDuration, setAudioDuration] = useState("00:00");
  const [currentTime, setCurrentTime] = useState("00:00");
  const [percentage, setPercentage] = useState(0);
  const [alert, setAlert] = useState(true);
  const [activeTrackID, setActiveTrackID] = useState(0);
  const [loading, setLoading] = useState(false);
  const volume = useRef(null);
  const progress = useRef(null);
  const audioRef = useRef();
  useEffect(() => {
    audioRef.current.volume = volume.current.value;
  }, []);

  useEffect(() => {
    if (isNaN(percentage)) {
      setPercentage(0);
    }
  }, [percentage]);

  const convertAudioDuration = (convert) => {
    var minutes = "0" + Math.floor(convert / 60);
    var seconds = "0" + Math.floor(convert - minutes * 60);
    var dur = minutes.substr(-2) + ":" + seconds.substr(-2);
    return dur;
  };

  const onChange = (e) => {
    const audio = audioRef.current;
    if (!loading) {
      audio.currentTime = (audio.duration / 100) * e.target.value;
      setPercentage(e.target.value);
    }
  };

  const getCurrDuration = (e) => {
    const percent = (
      (e.currentTarget.currentTime / e.currentTarget.duration) *
      100
    ).toFixed(2);
    const time = e.currentTarget.currentTime;

    setPercentage(+percent);
    setCurrentTime(convertAudioDuration(time.toFixed(2)));
  };

  const handleTrackChoice = (e) => {
    setActiveTrackID(parseInt(e.currentTarget.id));

    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then((_) => {
          if (playIcon) {
            setPlayIcon(!playIcon);
          }
          audioRef.current.play();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleTrackRewind = () => {
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then((_) => {
          if (playIcon) {
            setPlayIcon(!playIcon);
          }
          audioRef.current.play();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <>
      {alert && (
        <Alert onClose={() => setAlert(false)} dismissible variant="danger">
          <Alert.Heading>Work in progress.</Alert.Heading>
          Not all features are available yet.
        </Alert>
      )}

      <PlayerWrapper>
        <Player>
          <Timer>
            <div className="elapsed">{currentTime}</div>
            <div className="total">{audioDuration}</div>
          </Timer>
          <ProgressBar>
            <Input
              ref={progress}
              percentage={String(percentage)}
              onChange={onChange}
            />
          </ProgressBar>
          <PlayerControls>
            <Control
              onClick={() => {
                if (activeTrackID === 0) {
                  setActiveTrackID(playlist.length - 1);
                  handleTrackRewind();
                } else {
                  setActiveTrackID(activeTrackID - 1);
                  handleTrackRewind();
                }
              }}
            >
              <RewindButton />
            </Control>
            <Control
              onClick={() => {
                setPlayIcon(!playIcon);
                if (playIcon) {
                  audioRef.current.play();
                } else {
                  audioRef.current.pause();
                }
              }}
            >
              {playIcon ? <PlayButton /> : <PauseButton />}
            </Control>
            <Control
              onClick={() => {
                if (activeTrackID < playlist.length - 1) {
                  setActiveTrackID(activeTrackID + 1);
                  handleTrackRewind();
                } else {
                  setActiveTrackID(0);
                  handleTrackRewind();
                }
              }}
            >
              <ForwardButton />
            </Control>
          </PlayerControls>
          <PlayerVolume>
            <VolumeIcon>
              <VolumeLogo />
            </VolumeIcon>
            <VolumeSlider
              ref={volume}
              onChange={() => (audioRef.current.volume = volume.current.value)}
            ></VolumeSlider>
          </PlayerVolume>
          <SongTitle>
            {!load && playlist[activeTrackID ? activeTrackID : 0].name
              ? playlist[activeTrackID ? activeTrackID : 0].name
              : "Default"}
          </SongTitle>
          <SongSubTitle>
            {!load && playlist[activeTrackID ? activeTrackID : 0].artist
              ? playlist[activeTrackID ? activeTrackID : 0].artist
              : "Default"}
          </SongSubTitle>
        </Player>
        <PlayList>
          <PlaylistHeader>
            <PlaylistTitle>Playlist with something...</PlaylistTitle>
            <PlaylistInfo>Short info about songs below maybe?</PlaylistInfo>
          </PlaylistHeader>
          <PlaylistItems>
            {!load ? (
              playlist.map((track, i) => {
                return (
                  <PlaylistTrack
                    isOdd={i % 2 === 0}
                    isActive={activeTrackID === i ? true : false}
                    key={i}
                    id={i}
                    onClick={handleTrackChoice}
                  >
                    <TrackIcon>
                      {activeTrackID !== i ? (
                        <TrackSymbol />
                      ) : loading ? (
                        <TrackLoading />
                      ) : (
                        <Equilizer playing={!playIcon} />
                      )}
                    </TrackIcon>
                    <TrackInfo>
                      <TrackTitle>
                        {track.name ? track.name : "Default"}
                      </TrackTitle>
                      <TrackSubTitle>
                        {track.artist ? track.artist : "Default"}
                      </TrackSubTitle>
                    </TrackInfo>
                    <TrackSubTitle>
                      {track.duration ? track.duration : "00:00"}
                    </TrackSubTitle>
                  </PlaylistTrack>
                );
              })
            ) : (
              <center>
                <TrackLoading />
              </center>
            )}
          </PlaylistItems>
        </PlayList>
        <audio
          ref={audioRef}
          onLoadStart={() => setLoading(true)}
          onCanPlay={() => setLoading(false)}
          onTimeUpdate={getCurrDuration}
          onLoadedData={(e) => {
            setAudioDuration(convertAudioDuration(audioRef.current.duration));
          }}
          onEnded={() => {
            setPlayIcon(!playIcon);
            audioRef.current.currentTime = 0;
          }}
          src={
            !load ? playlist[activeTrackID ? activeTrackID : 0].musicSrc : ""
          }
        />
      </PlayerWrapper>
    </>
  );
};

export default MusicPlayer;
