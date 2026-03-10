import { useEffect, useState } from "react";
// import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
// import api from "../api/axios";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { serverAPI } from "../services/apis";
import { useAuth } from "../context/Authcontext";

const Signup = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { authLoading, storeToken, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user) {
      navigate("/");
    }
  }, [authLoading, user]);

  const validateForm = () => {
    if (!name || !email || !password || !confirmPassword) {
      alert("All fields are required.");
      return false;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    // signup({ name, email });
    try {
      const payload = { name, email, password };
      const response = await axios.post(`${serverAPI}/auth/register`, payload);
      console.log("Signup successful:", response);
      if (response?.status === 201) {
        toast.success('Account created successfully!');
        storeToken(response?.data?.token)
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
      console.error("Signup error details:", error.response?.data);
    }
    // navigate("/");
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
        position="top-right"
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
        <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>

        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 border border-transparent hover:border-gray-200 focus:outline outline-gray-500 p-3 pe-10 rounded-lg transition-all duration-200 ease-in-out"
          required
        />
        <input
          type="text"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 border border-transparent hover:border-gray-200 focus:outline outline-gray-500 p-3 pe-10 rounded-lg transition-all duration-200 ease-in-out"
          required
        />
        <input
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 border border-transparent hover:border-gray-200 focus:outline outline-gray-500 p-3 pe-10 rounded-lg transition-all duration-200 ease-in-out"
          required
        />
        <input
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mb-4 border border-transparent hover:border-gray-200 focus:outline outline-gray-500 p-3 pe-10 rounded-lg transition-all duration-200 ease-in-out"
          required
        />

        <button className="w-full bg-[#000000b7] hover:bg-black text-white p-3 rounded-lg  transition-all duration-300 ease-in-out">
          Create Account
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 font-medium">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;