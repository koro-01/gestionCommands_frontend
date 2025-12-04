import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>MyApp</h2>
      <ul style={styles.links}>
        <li><Link to="/commandes">Commandes</Link></li>
        <li><Link to="/produits">Products</Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 25px",
    background: "#222",
    color: "#fff",
  },
  logo: {
    margin: 0,
  },
  links: {
    listStyle: "none",
    display: "flex",
    gap: "20px",
  }
};
