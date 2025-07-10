import React from 'react';

const SplashBanner = ({ hide }) => (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(180deg, #F5F5F5 0%, #E6ECEF 100%)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'transform 0.7s cubic-bezier(.4,1.6,.4,1), opacity 0.5s',
      transform: hide ? 'translateY(-100%)' : 'translateY(0)',
      opacity: hide ? 0 : 1,
      pointerEvents: hide ? 'none' : 'auto',
    }}
  >
    <img
      src="/image/lohozenrush.png"
      alt="Логотип"
      style={{ width: 120, height: 120, objectFit: 'contain', borderRadius: 24, boxShadow: '0 4px 24px #A3BFFA22' }}
    />
  </div>
);

export default SplashBanner; 