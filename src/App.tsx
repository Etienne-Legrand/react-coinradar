import { ThemeProvider } from "./context/ThemeContext";
import { CoinList } from "./components/CoinList";

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white font-sans transition-colors duration-200 dark:bg-gray-900">
        <div className="max-w-dvh m-auto">
          <CoinList />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
