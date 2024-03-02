import React, { useState, useEffect } from 'react';
import { Fade } from '@mui/material';
import './slideShow.css'; 

// Array of image URLs
const imageArray = [
  '/images/stock1.jpg',
  '/images/stock2.jpg',
  '/images/stock3.jpg'
];
const Slideshow: React.FC = () => {
    const [currentImageIdx, setCurrentImageIdx] = useState(0);
    const [fade, setFade] = useState(true);
  
    useEffect(() => {
      const intervalId = setInterval(() => {
        setFade(false);
  
        setTimeout(() => {
          setCurrentImageIdx((prev) => (prev + 1) % imageArray.length);
          setFade(true);
        }, 300); //for a smooth fade out and then in
      }, 5000); // Change image every 5 seconds
  
      return () => {
        clearInterval(intervalId);
      };
    }, [currentImageIdx]);
  
    return (
      <div className="slideshow">
        {imageArray.map((image, index) => (
          <Fade in={fade && index === currentImageIdx} timeout={1000} key={image}>
            <div
              className="background"
              style={{ backgroundImage: `url(${image})` }}
            />
          </Fade>
        ))}
      </div>
    );
  };
  
  export default Slideshow;
