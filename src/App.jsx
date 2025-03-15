import { useContext, useEffect } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { AppContext } from "./context/appContext";
import Login from "./components/login";
import Register from "./components/register";
import Layout from "./layout";
import ErrorPage from "./components/errorpage";
import LiveObjectDetection from "./components/imageClass";
import Home from "./components/home";
// import StockRecommendation from "./components/AIrec";

function App() {
  const { setloginUser } = useContext(AppContext);

  useEffect(() => {
    const user = localStorage.getItem("ADuser");
    if (user) {
      setloginUser(JSON.parse(user));
    }
  }, [setloginUser]); // Added dependency array

  return (
    <Routes>
      {/* Authentication Routes (No Layout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Layout Wrapper for Other Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        {/* <Route path="/rec" element={<StockRecommendation />} /> */}
        <Route path="about" element={<LiveObjectDetection />} />
        <Route path="*" element={<ErrorPage />} />
      </Route>

      {/* Fallback Route for Unmatched Paths */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;
