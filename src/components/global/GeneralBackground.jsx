import React from 'react';
import styles from './GeneralBackground.module.css';
import lightBg from '../../assets/images/lightBg.png';
import darkBg from '../../assets/images/darkBg.png';

const GeneralBackground = ({ darkMode }) => {
  return (
    <div
      className={styles.generalBg}
      style={{
        backgroundImage: `url(${darkMode ? darkBg : lightBg})`,
      }}
      aria-hidden="true"
    />
  );
};

export default GeneralBackground;
