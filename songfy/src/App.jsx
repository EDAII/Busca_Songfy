import "./App.css";

// 1. Buscar Binária
const binarySearch = (array, target, key) => {
  if (!target) return null;
  const targetLower = target.toLowerCase();
  let start = 0;
  let end = array.length - 1;

  while (start <= end) {
    const mid = Math.floor((start + end) / 2);

    if (!array[mid] || !array[mid][key]) {
      if (targetLower > "") start = mid + 1;
      else end = mid - 1;
      continue;
    }

    const midValue = array[mid][key].toLowerCase();

    if (midValue === targetLower) {
      return array[mid];
    }

    if (midValue < targetLower) {
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }

  return null;
};

// 2. Buscar Linear
const linearSearch = (array, target, keys) => {
  if (!target) return [];
  const targetLower = target.toLowerCase();
  return array.filter((item) =>
    keys.some(
      (key) =>
        item && item[key] && item[key].toLowerCase().includes(targetLower)
    )
  );
};

function App() {
  return (
    <>
      <div></div>
      <h1>Songfy: Busca binaria x Busca linear</h1>
      <label>Busca Binaria - Digite o nome da musica:</label>
      <input />
      <label>Busca Linear - Digite o nome da musica:</label>
      <input />
    </>
  );
}

export default App;
