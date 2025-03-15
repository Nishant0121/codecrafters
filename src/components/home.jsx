import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../context/config"; // Import the global variable
import { AppContext } from "@/context/appContext";

export default function Home() {
  const [data, setData] = useState(null);
  const { loginUser } = useContext(AppContext);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/hello`)
      .then((response) => {
        setData(response.data.message);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div>
      <h1>Home Page</h1>
      {/* <h1>{loginUser}</h1> */}
      {data ? <pre>{data}</pre> : <p>Loading...</p>}
    </div>
  );
}
