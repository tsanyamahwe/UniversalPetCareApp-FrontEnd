import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar} from 'react-icons/fa';

const RatingStars = ({rating}) => {
    const totalStars = 5;
    let stars = [];

    //Handle null, undefined, or 0 rating
    if(!rating || rating === 0){
        for(let i = 1; i <= totalStars; i++){
            stars.push(<FaRegStar key={i} color='#ffc107'/>);
        }
        return(
            <span className='me-2 ms-2'>
                {stars}
            </span>
        );
    }

    //Add full stars
    for(let i =1; i <= Math.floor(rating); i++){
        stars.push(<FaStar key={i} color='#ffc107'/>);
    }

    //Add half stars (ONLY if rating has a decimal part AND is greater than 0)
    if(rating % 1 !==0 && rating > 0){
        stars.push(<FaStarHalfAlt key='half' color='#ffc107'/>);
    }

    //Add empty stars
    for(let i = stars.length + 1; i <= totalStars; i++){
        stars.push(<FaRegStar key={i} color='#ffc107'/>)
    }

  return (
    <span className='me-2 ms-2'>
        {stars}
    </span>
  );
};

export default RatingStars;
