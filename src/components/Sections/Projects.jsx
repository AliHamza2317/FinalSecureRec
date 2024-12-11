
import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
// Components
import FullButton from "../Buttons/FullButton";
// Assets
import AddImage2 from "../../assets/img/add/add2.png";
import { useNavigate } from 'react-router-dom'; 
import video from './demonstration.mp4'; 

export default function Projects() {
  const navigate = useNavigate(); 
  const videoRef = useRef(null); // Create a ref for the video element
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    const handleEnded = () => setPlay(false); // Reset play state when video ends

    if (videoElement) {
      videoElement.addEventListener('ended', handleEnded);
    }

    // Cleanup event listener on unmount
    return () => {
      if (videoElement) {
        videoElement.removeEventListener('ended', handleEnded);
      }
    };
  }, []);

  const handlePlayPause = () => {
    const videoElement = videoRef.current;
    if (play) {
      videoElement.pause(); // Pause the video
    } else {
      videoElement.play(); // Play the video
    }
    setPlay(!play); // Toggle play state
  };

  return (
    <Wrapper id="projects">
      <div className="whiteBg">
        <div className="container">
          <HeaderInfo>
          <h1 className="font40 extraBold">Explore the Demonstration of SecureRec</h1>
          <p className="font13">
            Discover how SecureRec revolutionizes digital security through our intuitive platform. This demonstration video showcases our innovative solutions designed to empower businesses, ensuring seamless protection and streamlined operations. Join us as we navigate the features that make SecureRec a leader in safeguarding your digital assets.
          </p>
          </HeaderInfo>
          <VideoWrapper>
            <video 
              ref={videoRef} // Reference the video element
              controls // Enable built-in video controls
              width="100%" 
              height="100%" 
              style={{ position: 'absolute', top: 0, left: 0 }} // Ensure video covers the container
              src={video} 
              type="video/mp4" 
            />
            <PlayButton onClick={handlePlayPause}>
              <IconButton>
                {play ? <PauseIcon sx={{ color: '#fff', fontSize: 60 }} /> : <PlayArrowIcon sx={{ color: '#fff', fontSize: 60 }} />}
              </IconButton>
            </PlayButton>
          </VideoWrapper>
        </div>
      </div>
      <div className="lightBg" style={{ marginTop: '50px', padding: '20px 0' }}>
        <div className="container">
          <Advertising className="flexSpaceCenter">
            <AddLeft>
              <AddLeftInner>
                <ImgWrapper className="flexCenter">
                  <img className="radius8" src={AddImage2} alt="add" />
                </ImgWrapper>
              </AddLeftInner>
            </AddLeft>
            <AddRight>
              <h4 className="font15 semiBold">A Few Words About SecureRec</h4>
              <h2 className="font40 extraBold">Security Made Simple</h2>
              <p className="font12">    
                At SecureRec, we streamline digital security with an intuitive platform that balances powerful protection and user-friendly design. 
                Together, let's create a safer digital world.
              </p>
              <ButtonsRow className="flexNullCenter" style={{ margin: "20px 0" }}>
                <div style={{ width: "190px" }}>
                  <FullButton title="Get Started" action={() => navigate('/signup')} />
                </div>
                <div style={{ width: "190px", marginLeft: "15px" }}>
                  <FullButton title="Contact Us" action={() => navigate('/contact')} border />
                </div>
              </ButtonsRow>
            </AddRight>
          </Advertising>
        </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  width: 100%;
`;

const HeaderInfo = styled.div`
  @media (max-width: 860px) {
    text-align: center;
  }
`;

const VideoWrapper = styled.div`
  width: 100%;
  padding: 0;
  position: relative;
  overflow: hidden;
  padding-top: 60%; /* 16:9 Aspect Ratio */ 
  // 56.25
  z-index: 1;
`;

const PlayButton = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  cursor: pointer;
`;

const Advertising = styled.div`
  padding: 50px 0;
  margin: 0;
  position: relative;
  @media (max-width: 1160px) {
    padding: 30px 0 20px 0;
  }
  @media (max-width: 860px) {
    flex-direction: column;
    padding: 0 0 20px 0;
    margin: 0;
  }
`;

const ButtonsRow = styled.div`
  @media (max-width: 860px) {
    justify-content: space-between;
  }
`;

const AddLeft = styled.div`
  position: relative;
  width: 50%;
  p {
    max-width: 475px;
  }
  @media (max-width: 860px) {
    width: 80%;
    order: 2;
    text-align: center;
    h2 {
      line-height: 3rem;
      margin: 15px 0;
    }
    p {
      margin: 0 auto;
    }
  }
`;

const AddRight = styled.div`
  width: 50%;
  @media (max-width: 860px) {
    width: 80%;
    order: 2;
  }
`;

const AddLeftInner = styled.div`
  width: 100%;
  position: relative;
  top: 0;
  left: 0;
`;

const ImgWrapper = styled.div`
  width: 100%;
  padding: 0 15%;
  img {
    width: 100%;
    height: auto;
  }
  @media (max-width: 400px) {
    padding: 0;
  }
`;