import styles from './App.module.css';
import Home from './pages/home/Home';
import { ThemeProvider, useTheme } from './context/themeContext';
import GeneralBackground from './components/global/generalBackground/GeneralBackground';

function AppContent() {
  const { darkMode } = useTheme();

  return (
    <div className={`${styles.appContainer} ${darkMode ? styles.dark : styles.light}`}>
            <GeneralBackground darkMode={darkMode} />
      <Home />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;



