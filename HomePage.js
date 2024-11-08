import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div style={styles.container}>
            <nav style={styles.navBar}>
                <h1 style={styles.title}>Welcome to Wings Cafe Inventory System</h1>
            </nav>

            <div style={styles.buttonContainer}>
                <Link to="/dashboard" style={styles.button}>Go to Dashboard</Link>
                <Link to="/product-management" style={styles.button}>Manage Products</Link>
                <Link to="/user-management" style={styles.button}>Manage Users</Link>
                <Link to="/login" style={styles.button}>Login</Link>
                <Link to="/register" style={styles.button}>Register</Link>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#ffffff', // White background
        padding: '20px',
        boxSizing: 'border-box',
    },
    navBar: {
        width: '100%',
        borderBottom: '3px solid #4CAF50', // Green border for the nav bar
        marginBottom: '20px', // Space below the nav bar
        textAlign: 'center',
        padding: '10px 0',
    },
    title: {
        color: '#4CAF50', // Green for title
        fontSize: '36px',
        margin: '0',
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '15px', // Space between buttons
    },
    button: {
        padding: '12px 20px',
        border: 'none',
        borderRadius: '5px',
        backgroundColor: '#4CAF50', // Green for buttons
        color: '#fff',
        fontWeight: 'bold',
        textDecoration: 'none',
        textAlign: 'center',
        transition: 'background-color 0.3s, transform 0.2s',
        width: '200px',
        textAlign: 'center',
    },
    buttonHover: {
        backgroundColor: '#45a049', // Darker green for hover effect
    },
};

export default HomePage;
