import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import ProductManagement from './ProductManagement'; // Import the combined component
import UserManagement from './UserManagement';
import Dashboard from './Dashboard';
import HomePage from './HomePage';
import Login from './Login';
import './App.css';

const App = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const storedLoggedInUser = JSON.parse(localStorage.getItem('loggedInUser')) || null;

    setProducts(storedProducts);
    setUsers(storedUsers);
    setLoggedInUser(storedLoggedInUser);
  }, []);

  const addProduct = (product) => {
    const updatedProducts = [...products, { ...product, id: Date.now() }];
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const updateProduct = (updatedProduct) => {
    const updatedProducts = products.map((product) =>
      product.id === updatedProduct.id ? updatedProduct : product
    );
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const deleteProduct = (id) => {
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const addUser = (user) => {
    const updatedUsers = [...users, user];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const updateUser = (updatedUser) => {
    const updatedUsers = users.map((user) =>
      user.email === updatedUser.email ? updatedUser : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const handleLogin = (username, password) => {
    const user = users.find(
      (user) => user.username === username && user.password === password
    );
    if (user) {
      setLoggedInUser(user);
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const handleRegister = (newUser) => {
    const userExists = users.some((user) => user.username === newUser.username);
    if (!userExists) {
      addUser(newUser);
      setLoggedInUser(newUser);
      localStorage.setItem('loggedInUser', JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem('loggedInUser');
  };

  return (
    <Router>
      <div className="app">
        <nav style={styles.nav}>
          {loggedInUser && <Link to="/">Home</Link>}
          {loggedInUser ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/products">Products</Link>
              <Link to="/users">Users</Link>
              <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>

        <Routes>
          <Route path="/" element={loggedInUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login onLogin={handleLogin} onRegister={handleRegister} />} />
          <Route path="/dashboard" element={loggedInUser ? <Dashboard products={products} /> : <Navigate to="/login" />} />
          <Route path="/products" element={loggedInUser ? (
            <ProductManagement 
              products={products}
              addProduct={addProduct}
              updateProduct={updateProduct}
              deleteProduct={deleteProduct}
            />
          ) : <Navigate to="/login" />} />
          <Route path="/users" element={loggedInUser ? (
            <UserManagement
              users={users}
              addUser={addUser}
              updateUser={updateUser} 
              deleteUser={(user) => {
                const updatedUsers = users.filter(u => u.email !== user.email);
                setUsers(updatedUsers);
                localStorage.setItem('users', JSON.stringify(updatedUsers));
              }} 
            />
          ) : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#ffffff',
    border: '2px solid #4CAF50',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  logoutButton: {
    backgroundColor: 'transparent',
    color: '#4CAF50',
    border: 'none',
    cursor: 'pointer',
    padding: '8px 12px',
  },
};

export default App;