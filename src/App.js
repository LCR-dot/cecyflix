import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [peliculas, setPeliculas] = useState([]);
  const [peliculasFiltradas, setPeliculasFiltradas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [modoDescripcion, setModoDescripcion] = useState(false);
  const [recomendacion, setRecomendacion] = useState('');

  // Cargar películas al iniciar
  useEffect(() => {
    //fetch('/api/peliculas')
    fetch('https://recomendaciones-backend-0ng5.onrender.com/api/peliculas')
      .then(res => res.json())
      .then(data => {
        setPeliculas(data);
        setPeliculasFiltradas(data);
      })
      .catch(err => console.error('Error al obtener películas:', err));
  }, []);

  // Búsqueda por texto (título o género)
  const handleBuscar = async (e) => {
    e.preventDefault();
    const texto = busqueda.toLowerCase();

    if (modoDescripcion) {
      await handleBuscarPorDescripcion();
    } else {
      const resultado = peliculas.filter(p =>
        p.titulo.toLowerCase().includes(texto) ||
        p.genero.toLowerCase().includes(texto) ||
        p.titulo.toLowerCase().startsWith(texto)
      );
      setPeliculasFiltradas(resultado);
      setRecomendacion('');
    }
  };

  // Búsqueda con IA
  const handleBuscarPorDescripcion = async () => {
    setRecomendacion('Pensando...');
    try {
      const res = await fetch('https://recomendaciones-backend-0ng5.onrender.com/api/recomendaciones', {/*fetch('/api/recomendaciones',*/
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Dame una recomendación basada en esta descripción:
${busqueda}. Usa solo estas películas: ${peliculas.slice(0, 10).map(p => p.titulo).join(', ')}.`

        })
      });
      

      const data = await res.json();

      if (data.recomendacion && typeof data.recomendacion === 'string') {
        setRecomendacion(data.recomendacion);

        const seleccionadas = peliculas.filter(p =>
          data.recomendacion.toLowerCase().includes(p.titulo.toLowerCase())
        );
        setPeliculasFiltradas(seleccionadas.length > 0 ? seleccionadas : []);
      } else {
        setRecomendacion('❌ No se recibió una recomendación válida.');
        setPeliculasFiltradas([]);
      }



      /*const data = await res.json();
      setRecomendacion(data.recomendacion);

      const seleccionadas = peliculas.filter(p =>
        data.recomendacion.toLowerCase().includes(p.titulo.toLowerCase())
      );
      setPeliculasFiltradas(seleccionadas.length > 0 ? seleccionadas : []);*/



    } catch (err) {
      console.error('Error con IA:', err);
      setRecomendacion('❌ Error al obtener recomendación IA.');
    }
  };

  return (
    <div className="App">
      <h1 className="titulo">🎬 CECYFLIX</h1>

      <form className="buscador" onSubmit={handleBuscar}>
        <input
          type="text"
          placeholder={modoDescripcion
            ? 'Describe la peli que buscas...'
            : 'Busca por título o género'}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          required
        />
        <button type="submit">Buscar</button>
        <button
          type="button"
          className="btn-ia"
          onClick={() => setModoDescripcion(!modoDescripcion)}
        >
          {modoDescripcion ? '🔄 Modo texto' : '🧠 Modo descripción'}
        </button>
      </form>

      {recomendacion && (
        <div className="bloque-recomendaciones">
          <h2>✨ Recomendación IA</h2>
          <p>{recomendacion}</p>
        </div>
      )}

      <div className="galeria">
        <h2>🎞 Resultados</h2>
        <div className="grid">
          {peliculasFiltradas.map((p, i) => (
            <div className="tarjeta" key={i}>
              <img src={p.poster} alt={p.titulo} />
              <div className="info">
                <h3>{p.titulo}</h3>
                <p>{p.genero}</p>
                <span>{p.descripcion?.slice(0, 60)}...</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
