import axios from "axios";
import { useState, useEffect, use } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import { serverAPI } from "../services/apis";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const {authLoading, storeToken, user} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && user) {
            navigate("/");
        }
    }, [authLoading, user]);

    const validateForm = () => {
        if (!email || !password) {
            alert("Both email and password are required.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        try {
            const payload = { email, password };
            console.log("Login payload:", payload);
            const response = await axios.post(`${serverAPI}/auth/login`, payload);
            console.log("Login successful:", response);
            if (response?.status === 200) {
                toast.success(`Welcome back ${response?.data?.name}`)
                storeToken(response?.data?.token)
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong";
            toast.error(errorMessage);
            console.error("Signup error details:", error.response?.data);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                    className: '',
                    style: {
                        fontSize: '13px',
                        fontWeight: '300',
                        padding: '5px 16px',
                        borderRadius: '8px',
                    },
                }}
            />
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-md w-96 mx-2"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <input
                    type="text"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-4 border p-3 rounded-lg"
                    required
                />
                <input
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-4 border p-3 rounded-lg"
                    required
                />
                <button className="w-full bg-purple-600 text-white p-3 rounded-lg">Login</button>
                <p className="text-sm text-center mt-4">
                    No account?{" "}
                    <Link to="/signup" className="text-purple-600 font-medium">Signup</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;