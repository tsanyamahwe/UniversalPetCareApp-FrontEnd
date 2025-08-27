import React from 'react';

const CardComponent = ({ label, count, IconComponent, className = "", colorVariant = "" }) => {
  return (
    <div className={`admin-card ${colorVariant} ${className}`}>
      <div className="card-inner">
        <div>
          <h6>{label}</h6>
          <p>{count}</p>
        </div>
        <div className="card-icon">
          <IconComponent/>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;

/*i used option 1 and i copied the rest of the suggested css, now the color of the card is only an inch on the far left side before the label, the rest of the card is still white.*/
