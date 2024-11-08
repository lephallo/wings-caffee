// src/Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRoleSelection = () => {
        if (role === 'admin') {
            navigate('/'); // Redirect to home page for admin
        } else {
            navigate('/Dashboard'); // Redirect to Dashboard for regular user
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const url = isRegistering ? 'http://localhost:5400/register' : 'http://localhost:5400/login';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, role: isRegistering ? role : undefined }),
            });
            const data = await response.json();

            if (response.ok) {
                if (isRegistering) {
                    alert('Registration successful!'); // Notify on registration
                } else {
                    handleRoleSelection(); // Redirect based on role after successful login
                }
            } else {
                setError(data.message); // Show error message
            }
        } catch (error) {
            console.error('Fetch Error:', error); // Log network or other errors
            setError('An error occurred, please try again.');
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>{isRegistering ? 'Register' : 'Login Here'}</h2>
            <form onSubmit={handleSubmit} style={styles.formContainer}>
                <div style={styles.inputGroup}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>
                <div style={styles.inputGroup}>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        required
                    />
                </div>

                {isRegistering && (
                    <div style={styles.inputGroup}>
                        <select value={role} onChange={(e) => setRole(e.target.value)} style={styles.input}>
                            <option value="" disabled>Select Role</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select>
                    </div>
                )}

                <button type="submit" style={styles.button}>
                    {isRegistering ? 'Register' : 'Login'}
                </button>
            </form>

            <button onClick={() => setIsRegistering(!isRegistering)} style={styles.switchButton}>
                {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
            </button>

            {error && <p style={styles.errorText}>{error}</p>}
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        maxWidth: '400px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    title: {
        textAlign: 'center',
        color: '#4CAF50',
        fontSize: '24px',
        marginBottom: '20px',
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    input: {
        width: '100%',
        padding: '12px',
        borderRadius: '6px',
        border: '1px solid #4CAF50',
        boxSizing: 'border-box',
    },
    button: {
        padding: '12px',
        border: 'none',
        borderRadius: '6px',
        backgroundColor: '#4CAF50',
        color: '#fff',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    switchButton: {
        marginTop: '10px',
        padding: '10px',
        backgroundColor: 'transparent',
        border: 'none',
        color: '#4CAF50',
        cursor: 'pointer',
        textDecoration: 'underline',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: '10px',
    },
};

export default Login;