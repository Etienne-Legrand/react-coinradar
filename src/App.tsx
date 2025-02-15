import { ThemeProvider } from "./context/ThemeContext";
import { CoinList } from "./components/CoinList";

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        <CoinList />
      </div>
    </ThemeProvider>
  );
}

export default App;
