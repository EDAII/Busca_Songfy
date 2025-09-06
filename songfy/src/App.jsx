import { useState, useEffect } from "react";
import Papa from "papaparse";
import Results from "./components/Results";
import "./App.css";

// 1. Buscar Binária
const binarySearch = (array, target, key) => {
  if (!target) return [];
  const targetLower = target.toLowerCase();
  let start = 0,
    end = array.length - 1,
    firstMatchIndex = -1;
  while (start <= end) {
    const mid = Math.floor((start + end) / 2);
    if (!array[mid] || !array[mid][key]) {
      start = mid + 1;
      continue;
    }
    const midValue = array[mid][key].toLowerCase();
    if (midValue === targetLower) {
      firstMatchIndex = mid;
      break;
    }
    if (midValue < targetLower) {
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }
  if (firstMatchIndex === -1) return [];
  const allResults = [array[firstMatchIndex]];
  let left = firstMatchIndex - 1;
  while (left >= 0 && array[left][key].toLowerCase() === targetLower) {
    allResults.unshift(array[left]);
    left--;
  }
  let right = firstMatchIndex + 1;
  while (
    right < array.length &&
    array[right][key].toLowerCase() === targetLower
  ) {
    allResults.push(array[right]);
    right++;
  }
  return allResults;
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
  const [isLoading, setIsLoading] = useState(true);
  const [allSongs, setAllSongs] = useState([]);
  const [songsByTrack, setSongsByTrack] = useState([]);
  const [songsByArtist, setSongsByArtist] = useState([]);

  const [binaryTrackTerm, setBinaryTrackTerm] = useState("");
  const [binaryArtistTerm, setBinaryArtistTerm] = useState("");
  const [binaryResult, setBinaryResult] = useState([]);
  const [binaryPerf, setBinaryPerf] = useState(null);

  const [linearTerm, setLinearTerm] = useState("");
  const [linearResults, setLinearResults] = useState([]);
  const [linearPerf, setLinearPerf] = useState(null);

  useEffect(() => {
    const fetchAndProcess = async () => {
      const response = await fetch("/dataset.csv");
      const csvText = await response.text();
      Papa.parse(csvText, {
        header: true,
        complete: (results) => {
          const songs = results.data.filter(
            (s) => s && s.track_name && s.artists
          );
          setAllSongs(songs);
          const sortedByTrack = [...songs].sort((a, b) =>
            a.track_name && b.track_name
              ? a.track_name.localeCompare(b.track_name)
              : 0
          );
          const sortedByArtist = [...songs].sort((a, b) =>
            a.artists && b.artists ? a.artists.localeCompare(b.artists) : 0
          );
          setSongsByTrack(sortedByTrack);
          setSongsByArtist(sortedByArtist);
          setIsLoading(false);
        },
      });
    };
    fetchAndProcess();
  }, []);

  const handleBinaryTrackSearch = () => {
    setBinaryArtistTerm("");
    const t0 = window.performance.now();
    const result = binarySearch(songsByTrack, binaryTrackTerm, "track_name");
    const t1 = window.performance.now();
    setBinaryResult(result);
    setBinaryPerf((t1 - t0).toFixed(4));
  };

  const handleBinaryArtistSearch = () => {
    setBinaryTrackTerm("");
    const t0 = window.performance.now();
    const result = binarySearch(songsByArtist, binaryArtistTerm, "artists");
    const t1 = window.performance.now();
    setBinaryResult(result);
    setBinaryPerf((t1 - t0).toFixed(4));
  };

  const handleLinearSearch = () => {
    const t0 = window.performance.now();
    const results = linearSearch(allSongs, linearTerm, [
      "track_name",
      "artists",
    ]);
    const t1 = window.performance.now();
    setLinearResults(results);
    setLinearPerf((t1 - t0).toFixed(4));
  };

  return (
    <div className="app-container">
      <header>
        <h1>Songfy</h1>
        {isLoading && <p>Carregando...</p>}
      </header>

      <div className="search-sections-container">
        <section className="search-section">
          <h2>Busca Binária</h2>
          <p className="section-description"></p>
          <div className="search-group">
            <label htmlFor="track-search">Buscar por Nome da Música</label>
            <div className="search-input-wrapper">
              <input
                id="track-search"
                type="text"
                placeholder="Digite para buscar..."
                value={binaryTrackTerm}
                onChange={(e) => setBinaryTrackTerm(e.target.value)}
                disabled={isLoading}
              />
              <button onClick={handleBinaryTrackSearch} disabled={isLoading}>
                Buscar
              </button>
            </div>
          </div>
          <div className="search-group">
            <label htmlFor="artist-search">Buscar por Nome do Artista</label>
            <div className="search-input-wrapper">
              <input
                id="artist-search"
                type="text"
                placeholder="Digite para buscar..."
                value={binaryArtistTerm}
                onChange={(e) => setBinaryArtistTerm(e.target.value)}
                disabled={isLoading}
              />
              <button onClick={handleBinaryArtistSearch} disabled={isLoading}>
                Buscar
              </button>
            </div>
          </div>
          <Results result={binaryResult} performanceTime={binaryPerf} />
        </section>

        <section className="search-section">
          <h2>Busca Linear</h2>
          <p className="section-description"></p>
          <div className="search-group">
            <label htmlFor="linear-search">Buscar por Música ou Artista</label>
            <div className="search-input-wrapper">
              <input
                id="linear-search"
                type="text"
                placeholder="Digite para buscar..."
                value={linearTerm}
                onChange={(e) => setLinearTerm(e.target.value)}
                disabled={isLoading}
              />
              <button onClick={handleLinearSearch} disabled={isLoading}>
                Buscar
              </button>
              <span></span>
            </div>
          </div>
          <Results result={linearResults} performanceTime={linearPerf} />
        </section>
      </div>
    </div>
  );
}

export default App;
