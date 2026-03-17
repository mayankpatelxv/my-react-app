import React from 'react';
import './LoadingSkeleton.css';

// Reusable skeleton components
export const SkeletonBox = ({ width = '100%', height = '20px', borderRadius = '4px', marginBottom = '0' }) => (
  <div 
    className="skeleton-box" 
    style={{ width, height, borderRadius, marginBottom }}
  />
);

export const SkeletonText = ({ lines = 1, width = '100%' }) => (
  <div className="skeleton-text-container">
    {Array.from({ length: lines }).map((_, index) => (
      <SkeletonBox 
        key={index} 
        width={index === lines - 1 ? '80%' : width}
        height="16px"
        marginBottom="8px"
      />
    ))}
  </div>
);

export const SkeletonCard = () => (
  <div className="skeleton-card">
    <SkeletonBox height="60px" marginBottom="12px" />
    <SkeletonText lines={2} />
  </div>
);

export const SkeletonTable = ({ rows = 5, columns = 4 }) => (
  <div className="skeleton-table">
    <div className="skeleton-table-header">
      {Array.from({ length: columns }).map((_, index) => (
        <SkeletonBox key={index} height="40px" />
      ))}
    </div>
    <div className="skeleton-table-body">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="skeleton-table-row">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <SkeletonBox key={colIndex} height="50px" />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonDashboard = () => (
  <div className="skeleton-dashboard">
    <div className="skeleton-stats-grid">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="skeleton-stat-card">
          <SkeletonBox height="24px" width="60%" marginBottom="12px" />
          <SkeletonBox height="36px" width="80%" marginBottom="8px" />
          <SkeletonBox height="16px" width="50%" />
        </div>
      ))}
    </div>
    <div className="skeleton-charts">
      <div className="skeleton-chart">
        <SkeletonBox height="300px" borderRadius="8px" />
      </div>
      <div className="skeleton-chart">
        <SkeletonBox height="300px" borderRadius="8px" />
      </div>
    </div>
  </div>
);

export const SkeletonForm = () => (
  <div className="skeleton-form">
    <SkeletonBox height="40px" marginBottom="20px" />
    <SkeletonBox height="40px" marginBottom="20px" />
    <SkeletonBox height="40px" marginBottom="20px" />
    <SkeletonBox height="100px" marginBottom="20px" />
    <SkeletonBox height="45px" width="150px" borderRadius="8px" />
  </div>
);

export const SkeletonList = ({ items = 5 }) => (
  <div className="skeleton-list">
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="skeleton-list-item">
        <SkeletonBox width="50px" height="50px" borderRadius="50%" />
        <div className="skeleton-list-content">
          <SkeletonBox height="20px" width="70%" marginBottom="8px" />
          <SkeletonBox height="16px" width="50%" />
        </div>
      </div>
    ))}
  </div>
);

const LoadingSkeleton = ({ type = 'default', ...props }) => {
  switch (type) {
    case 'dashboard':
      return <SkeletonDashboard {...props} />;
    case 'table':
      return <SkeletonTable {...props} />;
    case 'form':
      return <SkeletonForm {...props} />;
    case 'list':
      return <SkeletonList {...props} />;
    case 'card':
      return <SkeletonCard {...props} />;
    default:
      return (
        <div className="skeleton-default">
          <SkeletonBox height="200px" />
        </div>
      );
  }
};

export default LoadingSkeleton;
