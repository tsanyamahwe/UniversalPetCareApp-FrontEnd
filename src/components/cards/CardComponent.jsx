import React from 'react';

const CardComponent = ({className = '', label, count, IconComponent, colorVariant, isLoading = false}) => {
  return (
    <div className={`${className}`}>
      <div className={`admin-card ${colorVariant} ${isLoading ? 'loading' : ''}`}>
        <div className="card-inner">
          <div className="card-icon">
            <IconComponent />
          </div>
          <div className="card-content">
            <div className="card-label">
              {label}
            </div>
            <div className="card-count">
              {isLoading ? '...' : (count || 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;