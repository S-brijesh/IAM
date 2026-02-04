import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authAPI.login({ email, password });
            const { token } = response.data;

            // Decode JWT to get user info (simple base64 decode)
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userData = {
                userId: payload.userId,
                role: payload.role,
            };

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);

            console.log('Login successful:', userData);
            return { success: true };
        } catch (error) {
            console.log('Login failed:', error.response?.data?.message);
            // Ensure user state is cleared on failed login
            setUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            return {
                success: false,
                message: error.response?.data?.message || 'Invalid email or password',
            };
        }
    };

    const register = async (employeeData) => {
        try {
            await authAPI.register(employeeData);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed',
                field: error.response?.data?.field || null,
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const value = {
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isHRManager: user?.role === 'HR_MANAGER' || user?.role === 'IT_ADMIN',
        isITAdmin: user?.role === 'IT_ADMIN',
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
