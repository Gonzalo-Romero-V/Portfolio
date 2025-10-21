// Header.jsx
import styles from './Header.module.css';
import { useTheme } from '../../context/themeContext';


function Header() {
    const { darkMode, toggleTheme } = useTheme();

    return (
        
        <header className={`${styles.headerContainer} ${darkMode ? styles.dark : styles.light}`}>
            <nav className={styles.navBar}>

                <div className={styles.controlButtons}>
                    <a className={`${styles.navItem} ${darkMode ? styles.dark : styles.light}`} href='#'>
                        <i className={`bi bi-translate ${darkMode ? `${styles.dark} TEXT_WHITE_100` : `${styles.light} TEXT_BLUE_1`} FS_ICON_XL`}></i>
                    </a>
                    <a className={`${styles.navItem} ${darkMode ? styles.dark : styles.light}`} onClick={toggleTheme} style={{ cursor: 'pointer' }}>
                        <i className={`bi ${darkMode ? 'bi-brightness-high-fill' : 'bi-moon-stars'} ${darkMode ? `${styles.dark} TEXT_WHITE_100` : `${styles.light} TEXT_BLUE_1`} FS_ICON_XL `}></i>
                    </a>

                </div>


                <div className={styles.menuButtons}>
                    <a className={`${styles.navItem} FONT_POPPINS FW_LIGHT FS_BODY_REGULAR ${darkMode ? `${styles.dark} TEXT_WHITE_100` : `${styles.light} TEXT_BLUE_1`}`} href='#'>Home</a>

                    <a className={`${styles.navItem} FONT_POPPINS FW_LIGHT FS_BODY_REGULAR ${darkMode ? `${styles.dark} TEXT_WHITE_100` : `${styles.light} TEXT_BLUE_1`}`} href='#'>Skills</a>

                    <a className={`${styles.navItem} FONT_POPPINS FW_LIGHT FS_BODY_REGULAR ${darkMode ? `${styles.dark} TEXT_WHITE_100` : `${styles.light} TEXT_BLUE_1`}`} href='#'>Projects</a>

                    <a className={`${styles.navItem} FONT_POPPINS FW_LIGHT FS_BODY_REGULAR ${darkMode ? `${styles.dark} TEXT_WHITE_100` : `${styles.light} TEXT_BLUE_1`}`} href='#'>Blog</a>

                    <a className={`${styles.navItem} FONT_POPPINS FW_LIGHT FS_BODY_REGULAR ${darkMode ? `${styles.dark} TEXT_WHITE_100` : `${styles.light} TEXT_BLUE_1`}`} href='#'>Contact</a>
                </div>


            </nav>
        </header>
    );
}

export default Header;
