import axios from "axios";
import { useState, useEffect, use } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import { serverAPI } from "../services/apis";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false)

    const { authLoading, storeToken, user } = useAuth();
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
                toast.success(` ${response?.data?.name}, Welcome back`)
                storeToken(response?.data?.token)
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Something went wrong";
            toast.error(errorMessage);
            console.error("Signup error details:", error.response?.data);
        }
    };

    return (
        <div
            className="h-screen flex items-center justify-center "
            style={{
                backgroundImage: `url("AlluraCity.png")`,
                backgroundSize: 'cover',
                backgroundPosition: 'top',
                backgroundRepeat: 'no-repeat',
                height: '100vh',
            }}
        >
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
                className=" p-8 rounded-2xl shadow-md w-96 mx-2"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <input
                    type="text"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-4 border border-transparent hover:border-gray-200 focus:outline outline-gray-500 p-3 rounded-lg transition-all duration-200 ease-in-out"
                    required
                />
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mb-4 border border-transparent hover:border-gray-200 focus:outline outline-gray-500 p-3 pe-10 rounded-lg transition-all duration-200 ease-in-out"
                        required
                    />
                    {showPassword ?
                        <svg className="text-gray-500 absolute top-3 right-2" onClick={() => setShowPassword(false)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M2.54 4.71L3.25 4L20 20.75l-.71.71l-3.34-3.35c-1.37.57-2.87.89-4.45.89c-4.56 0-8.5-2.65-10.36-6.5c.97-2 2.49-3.67 4.36-4.82zM11.5 18c1.29 0 2.53-.23 3.67-.66l-1.12-1.13c-.73.5-1.6.79-2.55.79C9 17 7 15 7 12.5c0-.95.29-1.82.79-2.55L6.24 8.41a10.64 10.64 0 0 0-3.98 4.09C4.04 15.78 7.5 18 11.5 18m9.24-5.5C18.96 9.22 15.5 7 11.5 7c-1.15 0-2.27.19-3.31.53l-.78-.78C8.68 6.26 10.06 6 11.5 6c4.56 0 8.5 2.65 10.36 6.5a11.47 11.47 0 0 1-4.07 4.63l-.72-.73c1.53-.96 2.8-2.3 3.67-3.9M11.5 8C14 8 16 10 16 12.5c0 .82-.22 1.58-.6 2.24l-.74-.74c.22-.46.34-.96.34-1.5A3.5 3.5 0 0 0 11.5 9c-.54 0-1.04.12-1.5.34l-.74-.74c.66-.38 1.42-.6 2.24-.6M8 12.5a3.5 3.5 0 0 0 3.5 3.5c.67 0 1.29-.19 1.82-.5L8.5 10.68c-.31.53-.5 1.15-.5 1.82" /></svg>
                        :
                        <svg className="text-gray-500 absolute top-3 right-2" onClick={() => setShowPassword(true)} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256"><path fill="currentColor" d="M243.66 126.38c-.34-.76-8.52-18.89-26.83-37.2C199.87 72.22 170.7 52 128 52S56.13 72.22 39.17 89.18c-18.31 18.31-26.49 36.44-26.83 37.2a4.08 4.08 0 0 0 0 3.25c.34.77 8.52 18.89 26.83 37.2c17 17 46.14 37.17 88.83 37.17s71.87-20.21 88.83-37.17c18.31-18.31 26.49-36.43 26.83-37.2a4.08 4.08 0 0 0 0-3.25m-32.7 35c-23.07 23-51 34.62-83 34.62s-59.89-11.65-83-34.62A135.7 135.7 0 0 1 20.44 128A135.7 135.7 0 0 1 45 94.62C68.11 71.65 96 60 128 60s59.89 11.65 83 34.62A135.8 135.8 0 0 1 235.56 128A135.7 135.7 0 0 1 211 161.38ZM128 84a44 44 0 1 0 44 44a44.05 44.05 0 0 0-44-44m0 80a36 36 0 1 1 36-36a36 36 0 0 1-36 36" /></svg>
                    }
                </div>
                <div className="text-center">
                    <button className="w-full bg-[#0033ff72] hover:bg-[#1542f59a] text-white p-3 rounded-lg transition-colors duration-300 ease-in-out">Login</button>
                </div>
                <p className="text-sm text-center mt-4">
                    No account?{" "}
                    <Link to="/signup" className="text-purple-600 font-medium">Signup</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;