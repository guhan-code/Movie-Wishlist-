import { Link } from "react-router-dom";
import "./style.css";
function Navbar() {
  return (
    <nav >
      <Link className="link" to="/">Home</Link>
      <Link className="link" to="/allMovies">Movie List</Link>
    </nav>
  );
}


export default Navbar;
