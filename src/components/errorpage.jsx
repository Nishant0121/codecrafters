import React from "react";
import { Button } from "@/components/ui/button"; // Import from ShadCN UI
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center px-4">
      <h1 className="text-9xl font-bold text-blue-600">404</h1>
      <h2 className="text-3xl font-semibold text-gray-700 mt-4">
        Oops! Page Not Found
      </h2>
      <p className="text-gray-500 mt-2">
        The page you are looking for doesn't exist.
      </p>

      <Link to="/">
        <Button className="mt-6 px-6 py-3 text-lg">Go Back Home</Button>
      </Link>
    </div>
  );
};

export default ErrorPage;
