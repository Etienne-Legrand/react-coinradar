import { CoinList } from "./components/CoinList";

function App() {
  return (
    <div className="min-h-screen bg-white font-sans transition-colors duration-200 dark:bg-gray-900">
      <div className="container mx-auto max-w-4xl">
        <CoinList />
      </div>
    </div>
  );
}

export default App;
