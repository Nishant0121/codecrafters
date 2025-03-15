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

export default function Login() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { loginUser, setloginUser } = useContext(AppContext);

  // Google Sign-In
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      setloginUser(result.user);
      localStorage.setItem("ADuser", JSON.stringify(result.user));
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
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  console.log(loginUser);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-slate-900">
      <div className="relative w-full max-w-md p-8 overflow-hidden backdrop-blur-xl bg-black/30 border border-gray-800/50 rounded-2xl shadow-[0_0_40px_rgba(8,_112,_184,_0.2)]">
        {/* Decorative elements */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>

        {user ? (
          <div className="text-center relative z-10">
            <h2 className="text-2xl font-bold mb-6 text-white">
              Welcome, {loginUser?.displayName || "User"}!
            </h2>
            {user.photoURL && (
              <div className="relative mx-auto w-28 h-28 mb-6 group">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse blur-md opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                <img
                  src={user.photoURL || "/placeholder.svg"}
                  alt="User Avatar"
                  className="relative w-28 h-28 rounded-full mx-auto border-2 border-white/20 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            )}
            <Button
              onClick={handleLogout}
              className="w-full bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span>Logging out...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <LogOutIcon className="w-4 h-4 mr-2" />
                  <span>Logout</span>
                </div>
              )}
            </Button>
          </div>
        ) : (
          <div className="relative z-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-400">Sign in to continue</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-300 text-sm text-center">{error}</p>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-gray-500 text-white transition-all duration-300"
                />
              </div>

              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-gray-500 text-white transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleEmailLogin}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span>Logging in...</span>
                  </div>
                ) : (
                  "Login with Email"
                )}
              </Button>

              <Button
                onClick={handleSignup}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                disabled={loading}
              >
                {loading ? "Signing up..." : "Sign Up"}
              </Button>
            </div>

            <div className="flex items-center my-6">
              <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-500/30 to-transparent"></div>
              <span className="mx-4 text-gray-400 text-sm font-medium">
                or continue with
              </span>
              <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-500/30 to-transparent"></div>
            </div>

            <Button
              onClick={handleGoogleLogin}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                    <path fill="none" d="M1 1h22v22H1z" />
                  </svg>
                  <span>Sign in with Google</span>
                </div>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
