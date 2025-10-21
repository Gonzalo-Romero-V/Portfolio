import '../../index.css';
import Header from '../../layout/header/Header';
import styles from './home.module.css';

function Home() {
  return (

    <div className={`${styles.homeContainer}`}>
      <Header />
    </div>
  );
}
export default Home;