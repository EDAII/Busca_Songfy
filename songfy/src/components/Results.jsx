function Results({ result, performanceTime }) {
    if (performanceTime === null && (!result || result.length === 0)) {
      return <div className="results-header">Aguardando busca...</div>;
    }
  
    const scrollThreshold = 5;
    const shouldScroll = result.length > scrollThreshold;
  
    return (
      <div className="results-wrapper">
        <h3 className="results-header">
          Resultados ({result.length} encontrados)
        </h3>
  
        <div
          className={`song-list-container ${shouldScroll ? "scrollable" : ""}`}
        >
          {result.length > 0 ? (
            result.map((song, index) => (
              <div className="song-card" key={index}>
                <h4>{song.track_name}</h4>
                <p>
                  <strong>Artista:</strong> {song.artists} |{" "}
                  <strong>Álbum:</strong> {song.album_name}
                </p>
              </div>
            ))
          ) : (
            <div className="song-card">
              <p>Nenhum resultado encontrado.</p>
            </div>
          )}
        </div>
  
        {performanceTime && (
          <div className="performance-details">
            Busca levou: <strong>{performanceTime}</strong> milissegundos.
          </div>
        )}
      </div>
    );
  }
  
  export default Results;
  