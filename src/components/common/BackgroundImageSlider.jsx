import React, { useState, useEffect } from 'react';
import vetbird from "../../assets/images/vetbird.jpg";
import vetcat1 from "../../assets/images/vetcat1.jpg";
import vetpetdog from "../../assets/images/vetpetdog.jpg";
import { Carousel } from "react-bootstrap";

const BackgroundImageSlider = () => {
    const backgrounds = [vetbird, vetcat1, vetpetdog];
    const [index, setIndex] = useState(0);
    const handleSelect = (selectedIndex) =>{
        setIndex(selectedIndex);
    };
  return (
    <div className='background-slider'>
        <Carousel activeIndex={index} onSelect={handleSelect} interval={20000} controls={false} indicators={false} fade>
            {backgrounds.map((background, idx) => (
                <Carousel.Item key={idx}>
                    <img
                        className='d-block w-100'
                        src={background}
                        alt={`Slide ${idx}`}
                        style={{height: '100vh', objectFit: 'cover'}}
                    />
                </Carousel.Item>
            ))}
        </Carousel>
    </div>
  );
};

export default BackgroundImageSlider;
