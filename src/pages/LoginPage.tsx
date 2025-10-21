import React, { useState } from 'react'
import { History, Eye, EyeOff } from 'lucide-react';
import LoadingSpinner from '../icons/LoadingSpinner';
import { useGlobalConfigStore } from '../store/globalConfigStore';

const mockLogin = async (email?: string, password?: string) => {
    console.log('Login attempt with:', email, password);
    return new Promise<{ token: string }>(resolve => {
        setTimeout(() => {
            resolve({ token: 'fake-jwt-token' });
        }, 500);
    });
};

const LoginPage = ({ onLoginSuccess, onNavigateToRegister }: { onLoginSuccess: any, onNavigateToRegister: any }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const setAuthToken = useGlobalConfigStore(state => state.setAuthToken);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await mockLogin(email, password);
            if (data.token) {
                setAuthToken(data.token);
                onLoginSuccess();
            } else {
                setError('Authentication token not received.');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to login. Please check your credentials.');
            setAuthToken(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6 animate-fade-in">
                <div className="flex flex-col items-center space-y-3">
                    <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full">
                        <History className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 text-center">Access Your Mind Map</h2>
                    <p className="text-gray-500 text-center">Welcome back! Enter your details to continue.</p>
                </div>

                {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-md text-sm animate-shake">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="text-sm font-semibold text-gray-700">E-mail</label>
                        <input
                            id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                            className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                            placeholder="your@email.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</label>
                        <div className="relative">
                            <input
                                id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required
                                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                                placeholder="Your password"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-4 flex items-center text-gray-500 hover:text-indigo-600">
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit" disabled={loading}
                        className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105 disabled:bg-indigo-400 disabled:scale-100 flex justify-center items-center"
                    >
                        {loading ? <LoadingSpinner size="h-6 w-6" color="border-white" /> : 'Login'}
                    </button>
                </form>
                <p className="text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <button onClick={onNavigateToRegister} className="font-semibold text-indigo-600 hover:underline cursor-pointer">
                        Sign up
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;