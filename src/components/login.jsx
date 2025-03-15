"use client";

import { useContext, useState } from "react";
import {
  auth,
  provider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "../firebase";
import { AppContext } from "../context/appContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LockIcon, MailIcon, LogOutIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

export default function Login() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { loginUser, setloginUser } = useContext(AppContext);

  // Function to fetch JWT token
  const fetchJWT = async () => {
    try {
      const response = await axios.get("http://localhost:3000/jwt");
      if (response.data.token) {
        Cookies.set("jwt_token", response.data.token, { expires: 7 }); // Store token in cookies (expires in 7 days)
        return response.data.token;
      }
    } catch (err) {
      console.error("JWT Fetch Error:", err);
    }
    return null;
  };

  // Google Sign-In
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      setloginUser(result.user);
      localStorage.setItem("ADuser", JSON.stringify(result.user));

      // Fetch and store JWT
      await fetchJWT();

      navigate("/");
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  // Email & Password Login
  const handleEmailLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
      setloginUser(userCredential.user);
      localStorage.setItem("ADuser", JSON.stringify(userCredential.user));

      // Fetch and store JWT
      await fetchJWT();

      navigate("/");
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  // Sign Up
  const handleSignup = async () => {
    setLoading(true);
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
      setloginUser(userCredential.user);
      localStorage.setItem("ADuser", JSON.stringify(userCredential.user));

      // Fetch and store JWT
      await fetchJWT();

      navigate("/");
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  // Logout
  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setloginUser(null);
      localStorage.removeItem("ADuser");
      Cookies.remove("jwt_token"); // Remove token from cookies
      navigate("/login");
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-slate-900">
      <div className="relative w-full max-w-md p-8 overflow-hidden backdrop-blur-xl bg-black/30 border border-gray-800/50 rounded-2xl shadow-[0_0_40px_rgba(8,_112,_184,_0.2)]">
        {user ? (
          <div className="text-center relative z-10">
            <h2 className="text-2xl font-bold mb-6 text-white">
              Welcome, {loginUser?.displayName || "User"}!
            </h2>
            {user.photoURL && (
              <img
                src={user.photoURL || "/placeholder.svg"}
                alt="User Avatar"
                className="w-28 h-28 rounded-full mx-auto border-2 border-white/20 object-cover"
              />
            )}
            <Button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white py-3 rounded-lg"
            >
              <LogOutIcon className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        ) : (
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white text-center mb-2">
              Welcome Back
            </h2>
            {error && <p className="text-red-300 text-center">{error}</p>}
            <div className="space-y-4 mb-6">
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white"
                />
              </div>

              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white"
                />
              </div>
            </div>

            <Button
              onClick={handleEmailLogin}
              className="w-full bg-blue-600 text-white py-3 rounded-lg"
            >
              Login
            </Button>
            <Button
              onClick={handleSignup}
              className="w-full bg-green-600 text-white py-3 rounded-lg mt-3"
            >
              Sign Up
            </Button>

            <div className="text-center my-6 text-gray-400">or</div>

            <Button
              onClick={handleGoogleLogin}
              className="w-full bg-red-600 text-white py-3 rounded-lg"
            >
              Sign in with Google
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
