import { useEffect, useState } from "react";
import "./Home.css";

function Home({ cart, setCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // 🔎 Search Filter
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );

  // 🔢 Pagination Logic (after filtering)
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  return (
    <div className="container">
      <h2 className="title">Products</h2>

      {/* 🔎 Search Input */}
      <input
        type="text"
        placeholder="Search products..."
        className="search"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1); // reset to first page after search
        }}
      />

      <div className="grid">
        {currentProducts.map((product) => (
          <div key={product.id} className="card">
            <img
              src={product.image}
              alt={product.title}
              style={{ height: "150px", objectFit: "contain" }}
            />
            <h4>{product.title.substring(0, 40)}...</h4>
            <p className="price">₹{product.price}</p>
            <button onClick={() => addToCart(product)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* 🔢 Pagination */}
      <div className="pagination">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={currentPage === index + 1 ? "active" : ""}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Home;