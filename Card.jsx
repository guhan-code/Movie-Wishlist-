import "./style.css";


function Card({ link, name, rating, genre, time, onDelete }) {
  return (
    <div id="movie">
      <img id="img" src={link} alt={name} />
      <div id="details">
        <h1 id="movieName">{name}</h1>
        <h2>Genre: {genre}</h2>
        <h2>Rating: {rating}</h2>
        <h2>When to Watch: {time}</h2>
        <button type="button" className="delete-button" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}


export default Card;
