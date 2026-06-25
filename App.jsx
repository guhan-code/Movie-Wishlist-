import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Card from "./Card";
import "./style.css";

// const Home = (
//   <div id="parent">
//     <div className="form-container">
//       <h1>Add Movies</h1>
//       <label>Movie Name:</label>
//       <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
//       <label>Poster Link:</label>
//       <input type="text" value={link} onChange={(e) => setLink(e.target.value)} />
//       <label>Genre:</label>
//       <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} />
//       <label>Rating:</label>
//       <input type="text" value={rating} onChange={(e) => setRating(e.target.value)} />
//       <label>Schedule:</label>
//       <input type="text" value={time} onChange={(e) => setTime(e.target.value)} />
//       <button onClick={handleClick}>Add Movie</button>
//     </div>
//   </div>
// );

function App() {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState("");
  const [time, setTime] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();


  useEffect(() => {
    if (location.pathname === "/allMovies") {
      setLoading(true);
      setError("");
      fetch("http://localhost:3000/allMovies")
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setMovies(data.data || []);
          } else {
            setError("Failed to load movies.");
          }
        })
        .catch(() => {
          setError("Failed to load movies.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [location.pathname]);


  const handleClick = async () => {
    const newMovie = {
      name,
      link,
      genre,
      rating,
      time,
    };


    if (name && link && genre && rating && time) {
      const response = await fetch("http://localhost:3000/submited", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMovie),
      });


      const data = await response.json();
      console.log(data);
      if (data.success) {
        setMovies((prevMovies) => [
          ...prevMovies,
          { ...newMovie, _id: data.insertedId },
        ]);
        setName("");
        setLink("");
        setGenre("");
        setRating("");
        setTime("");
      }
    }
  };


  const handleDelete = async (movieId) => {
    try {
      const response = await fetch(`http://localhost:3000/movies/${movieId}`, {
        method: "DELETE",
      });
      const data = await response.json();


      if (!data.success) {
        setError(data.error || "Failed to delete movie.");
        return;
      }


      setMovies((prevMovies) => prevMovies.filter((movie) => movie._id !== movieId));
    } catch (err) {
      setError("Failed to delete movie.");
    }
  };


  const Home = (
  <div id="parent">
    <div className="form-container">
      <h1>Add Movies</h1>
      <label>Movie Name:</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <label>Poster Link:</label>
      <input type="text" value={link} onChange={(e) => setLink(e.target.value)} />
      <label>Genre:</label>
      <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} />
      <label>Rating:</label>
      <input type="text" value={rating} onChange={(e) => setRating(e.target.value)} />
      <label>Schedule:</label>
      <input type="text" value={time} onChange={(e) => setTime(e.target.value)} />
      <button onClick={handleClick}>Add Movie</button>
    </div>
  </div>
);



  const MovieList = (
    <div id="container">
      {loading ? (
        <h2 style={{ color: "black", width: "100%" }}>Loading movies...</h2>
      ) : error ? (
        <h2 style={{ color: "black", width: "100%" }}>{error}</h2>
      ) : movies.length > 0 ? (
        movies.map((movie) => (
          <Card
            key={movie._id}
            name={movie.name}
            link={movie.link}
            genre={movie.genre}
            rating={movie.rating}
            time={movie.time}
            onDelete={() => handleDelete(movie._id)}
          />
        ))
      ) : (
        <h2 style={{ color: "black", width: "100%" }}>
          No movies yet. Add some from Home.
        </h2>
      )}
    </div>
  );


  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={Home} />
        <Route path="/allMovies" element={MovieList} />
      </Routes>
    </>
  );
}


export default App;
