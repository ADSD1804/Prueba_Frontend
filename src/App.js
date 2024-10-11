import React, { useState, useEffect } from 'react';
import './App.css';


const App = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Estados para los filtros, buscador y carrito
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showAvailable, setShowAvailable] = useState(false);
  const [showBestSellers, setShowBestSellers] = useState(false);
  const [priceFilter, setPriceFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const [cart, setCart] = useState([]); // Estado para el carrito

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data.json');
        const data = await response.json();
        setProducts(data.products);
        setCategories(data.categories);
      } catch (error) {
        console.error("Error al cargar los datos: ", error);
      }
    };
    fetchData();
  }, []);

  // Función para filtrar los productos
  const filteredProducts = products
    .filter((product) => {
      // Filtro por término de búsqueda
      if (searchTerm) {
        return product.name.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return true;
    })
    .filter((product) => {
      // Filtro por categoría
      if (selectedCategory) {
        return product.categories.includes(parseInt(selectedCategory));
      }
      return true;
    })
    .filter((product) => {
      // Filtro por disponibilidad
      if (showAvailable) {
        return product.available;
      }
      return true;
    })
    .filter((product) => {
      // Filtro por mejor vendido
      if (showBestSellers) {
        return product.best_seller;
      }
      return true;
    })
    .filter((product) => {
      // Filtro por precio
      if (priceFilter === "above-30000") {
        return parseFloat(product.price.replace('.', '')) > 30000;
      }
      if (priceFilter === "below-10000") {
        return parseFloat(product.price.replace('.', '')) < 10000;
      }
      return true;
    })
    .sort((a, b) => {
      // Ordenar los productos
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "low-price") {
        return parseFloat(a.price.replace('.', '')) - parseFloat(b.price.replace('.', ''));
      }
      if (sortBy === "high-price") {
        return parseFloat(b.price.replace('.', '')) - parseFloat(a.price.replace('.', ''));
      }
      return 0;
    });

  // Función para agregar un producto al carrito
  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  // Función para eliminar un producto del carrito
  const removeFromCart = (productId) => {
    setCart(cart.filter((product) => product.id !== productId));
  };

  return (
    <div className="container">
      <h1>Lista de Productos</h1>

      <div className="container1">
        {/* Buscador */}
        <div className="left">
          <div>
            <h2>Buscar productos</h2>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre..."
            />
          </div>

          {/* Filtros */}
          <div className="filters">
            <h2>Filtros</h2>

            <label>Categoría:</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="">Todas</option>
              {categories.map((category) => (
                <option key={category.categori_id} value={category.categori_id}>
                  {category.name}
                </option>
              ))}
            </select>

            <label>
              <input
                type="checkbox"
                checked={showAvailable}
                onChange={() => setShowAvailable(!showAvailable)}
              />
              Mostrar solo disponibles
            </label>

            <label>
              <input
                type="checkbox"
                checked={showBestSellers}
                onChange={() => setShowBestSellers(!showBestSellers)}
              />
              Mostrar solo los más vendidos
            </label>

            <label>Precio:</label>
            <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
              <option value="">Todos los precios</option>
              <option value="above-30000">Mayor a 30,000</option>
              <option value="below-10000">Menor a 10,000</option>
            </select>

            <label>Ordenar por:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="">Sin ordenar</option>
              <option value="name">Nombre</option>
              <option value="low-price">Menor precio</option>
              <option value="high-price">Mayor precio</option>
            </select>
          </div>
        </div>
        {/* Mostrar productos filtrados */}
        <div className="center">
          <ul>
            {filteredProducts.map((product) => (
              <li key={product.id}>
                <h2>{product.name}</h2>
                <img src={product.img} alt={product.name} />
                <p>Precio: {product.price}</p>
                <p>Disponible: {product.available ? "Sí" : "No"}</p>
                <p>Mejor vendido: {product.best_seller ? "Sí" : "No"}</p>
                <p>{product.description}</p>
                <button onClick={() => addToCart(product)}>Agregar al carrito</button>
              </li>
            ))}
          </ul>
        </div>
        {/* Mostrar carrito */}
        <div className="cart">
          <h2>Carrito de Compras</h2>
          {cart.length === 0 ? (
            <p>El carrito está vacío</p>
          ) : (
            <ul>
              {cart.map((product) => (
                <li key={product.id}>
                  <h3>{product.name}</h3>
                  <p>Precio: {product.price}</p>
                  <button onClick={() => removeFromCart(product.id)}>Eliminar</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;

