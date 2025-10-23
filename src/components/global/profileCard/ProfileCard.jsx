import styles from './ProfileCard.module.css';
import { useTheme } from '../../../context/themeContext';
import RoundedImage from '../../ui/roundedImage/RoundedImage';

function ProfileCard() {
    const { darkMode } = useTheme();

    return (
        <div className={`${styles.profileCard} ${darkMode ? styles.dark : styles.light}`}>
            <RoundedImage className={`${styles.profilePhoto} ${styles.large} `} />
            <h2 className={`${styles.name} FONT_POPPINS FW_BLACK FS_HEADING_LG ${darkMode ? 'TEXT_WHITE_100' : 'TEXT_BLUE_2'}`}>Gonzalo Romero</h2>
            <p className={`${styles.title} FONT_POPPINS FW_LIGHT FS_SECTION ${darkMode ? 'TEXT_WHITE_60' : 'TEXT_BLUE_2'}`}>Software Developer</p>

            <div className={styles.socials}>

                <a href="">
                    <i className={`bi bi-github FS_ICON_LG ${darkMode ? 'TEXT_WHITE_60 ' + styles.dark : 'TEXT_BLUE_2 ' + styles.light}`}></i>
                </a>
                <a href="" >
                    <i className={`bi bi-linkedin FS_ICON_LG ${darkMode ? 'TEXT_WHITE_60 ' + styles.dark : 'TEXT_BLUE_2 ' + styles.light}`}></i>
                </a>
                <a href="" >
                    <i className={`bi bi-google FS_ICON_LG ${darkMode ? 'TEXT_WHITE_60 ' + styles.dark : 'TEXT_BLUE_2 ' + styles.light}`}></i>
                </a>
                <a href="" >
                    <i className={`bi bi-facebook FS_ICON_LG ${darkMode ? 'TEXT_WHITE_60 ' + styles.dark : 'TEXT_BLUE_2 ' + styles.light}`}></i>
                </a>
                <a href="" >
                    <i className={`bi bi-instagram FS_ICON_LG ${darkMode ? 'TEXT_WHITE_60 ' + styles.dark : 'TEXT_BLUE_2 ' + styles.light}`}></i>
                </a>
            </div>
        </div>
    );
}

export default ProfileCard;
