import { useState } from "react";
import LoadingSpinner from "../icons/LoadingSpinner";
import { History } from "lucide-react";

const mockRegister = async (name?: string, email?: string, password?: string) => {
    console.log('Register attempt with:', name, email, password);
    return new Promise<{ success: boolean }>(resolve => {
        setTimeout(() => {
            resolve({ success: true });
        }, 500);
    });
};

const RegisterPage = ({ onRegisterSuccess, onNavigateToLogin }: { onRegisterSuccess: any, onNavigateToLogin: any }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await mockRegister(name, email, password);
            onRegisterSuccess();
        } catch (err: any) {
            setError(err.message || 'Could not create account.');
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
                    <h2 className="text-3xl font-bold text-gray-800 text-center">Create Your Account</h2>
                    <p className="text-gray-500 text-center">Start organizing your ideas today.</p>
                </div>

                {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-md text-sm animate-shake">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="text-sm font-semibold text-gray-700">Name</label>
                        <input
                            id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required
                            className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                            placeholder="Your full name"
                        />
                    </div>
                    <div>
                        <label htmlFor="email-register" className="text-sm font-semibold text-gray-700">E-mail</label>
                        <input
                            id="email-register" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                            className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                            placeholder="your@email.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="password-register" className="text-sm font-semibold text-gray-700">Password</label>
                        <input
                            id="password-register" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                            className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                            placeholder="Create a strong password"
                        />
                    </div>
                    <button
                        type="submit" disabled={loading}
                        className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105 disabled:bg-indigo-400 disabled:scale-100 flex justify-center items-center"
                    >
                        {loading ? <LoadingSpinner size="h-6 w-6" color="border-white" /> : 'Sign Up'}
                    </button>
                </form>
                <p className="text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <button onClick={onNavigateToLogin} className="font-semibold text-indigo-600 hover:underline cursor-pointer">
                        Log in
                    </button>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;