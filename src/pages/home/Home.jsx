import '../../index.css';
import styles from './Home.module.css';

import Header from '../../layout/header/Header';

import ProfileCard from '../../components/global/profileCard/ProfileCard';  

import { useTheme } from '../../context/themeContext';

function Home() {
  const { darkMode } = useTheme();

  return (

    <div className={`${styles.homeContainer}`}>
      <Header />
      <main className={`${styles.mainContent}`}>
        <div className={styles.leftSection}>
          <ProfileCard />
        </div>
        <div className={styles.rightSection}>
          <h2 className={`${styles.tittle} FONT_POPPINS FS_SECTION FW_BLACK ${darkMode ? styles.dark + ' TEXT_WHITE_100' : styles.light + ' TEXT_BLUE_2'}`}>About Me</h2>
          <p className={`${styles.paragraph} FONT_POPPINS FS_BODY_REGULAR FW_LIGHT LS_WIDE ${darkMode ? styles.dark + ' TEXT_WHITE_100' : styles.light + ' TEXT_BLUE_1'}`}>
            Soy tu nombre, una persona comprometida, proactiva y con gran interés en 
            el aprendizaje continuo. Me destaco por mi capacidad de adaptación, 
            trabajo en equipo y resolución de problemas, buscando siempre aportar valor 
            en los proyectos que desarrollo. Me apasiona tu área de interés o especialidad
            y disfruto enfrentar desafíos que me permitan crecer tanto profesional como 
            personalmente. Mi objetivo es contribuir de manera significativa en entornos 
            dinámicos y seguir fortaleciendo mis habilidades y conocimientos</p>
        </div>
      </main>
    </div>
  );
}
export default Home;