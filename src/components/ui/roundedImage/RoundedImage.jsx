import styles from './RoundedImage.module.css';
import { useTheme } from '../../../context/themeContext';
import profilePhoto from '../../../assets/images/profilePhoto.png';

const RoundedImage = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`${styles.imageContainer} ${styles.large}`}>
      <img
        src={profilePhoto} 
        alt="Profile photo"
        className={`${styles.roundedImage} ${darkMode ? styles.dark : styles.light}`}
        draggable={false}
      />
    </div>
  );
};

export default RoundedImage;