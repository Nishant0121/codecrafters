"use client";

import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import {
  auth,
  provider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
} from "../firebase";
import { AppContext } from "../context/appContext";
import { saveUserToFirestore } from "../firebase/functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  UserIcon,
  PhoneIcon,
  MailIcon,
  LockIcon,
  CreditCardIcon,
} from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { setloginUser } = useContext(AppContext);
  const navigate = useNavigate(); // Initialize navigation

  // Google Sign-Up
  const handleGoogleSignup = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, provider);
      setloginUser(result.user);

      // Save user to Firestore with default PAN (user must update later)
      await saveUserToFirestore({
        uid: result.user.uid,
        name: result.user.displayName || "",
        email: result.user.email,
        mobile: result.user.phoneNumber || "",
        panNumber: "",
      });

      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  // Email & Password Sign-Up
  const handleSignup = async () => {
    setLoading(true);
    setError("");

    if (!name || !mobile || !email || !password || !panNumber) {
      setError("All fields are required!");
      setLoading(false);
      return;
    }

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber)) {
      setError("Invalid PAN number format!");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName: name });

      setloginUser({
        uid: userCredential.user.uid,
        displayName: name,
        email: userCredential.user.email,
        phoneNumber: mobile,
      });

      // Save to Firestore
      await saveUserToFirestore({
        uid: userCredential.user.uid,
        name,
        email,
        mobile,
        panNumber,
      });

      // Redirect to Dashboard after successful registration
      navigate("/login");
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-slate-900">
      <div className="relative w-full max-w-md p-8 overflow-hidden backdrop-blur-xl bg-black/30 border border-gray-800/50 rounded-2xl shadow-[0_0_40px_rgba(8,_112,_184,_0.2)]">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-gray-400">Join us today</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-300 text-sm text-center">{error}</p>
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <Input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white"
            />
          </div>

          <div className="relative">
            <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <Input
              type="text"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full pl-10 py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white"
            />
          </div>

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

          <div className="relative">
            <CreditCardIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <Input
              type="text"
              placeholder="PAN Number"
              value={panNumber}
              onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
              className="w-full pl-10 py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white"
            />
          </div>
        </div>

        <Button
          onClick={handleSignup}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg"
        >
          {loading ? "Creating account..." : "Register"}
        </Button>

        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-500/30"></div>
          <span className="mx-4 text-gray-400 text-sm">or</span>
          <div className="flex-grow h-px bg-gray-500/30"></div>
        </div>

        <Button
          onClick={handleGoogleSignup}
          className="w-full bg-red-600 text-white py-3 rounded-lg"
        >
          {loading ? "Signing up..." : "Sign up with Google"}
        </Button>
      </div>
    </div>
  );
}
