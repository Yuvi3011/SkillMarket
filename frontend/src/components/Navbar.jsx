
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <h2>SkillMarket</h2>

      <div>
        <Link to="/">Home</Link>
        <Link to="/explore">Explore</Link>
        <Link to="/exchange">Skill Exchange</Link>
        <Link to="/orders">My Orders</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;

