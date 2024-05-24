import React, { useEffect } from "react";
import ProtectedRoute from "./components/ProtectedRoute/protectedRoute";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/login/login";
import Admin from "./pages/admin/admin";
import Home from "./pages/home/home";
import { loadConfig } from "./config";

const App: React.FC = () => {
  loadConfig().then((config) => {
    console.log("config", config);
  });
  useEffect(() => {
    document.title = "Better Learning";
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={<ProtectedRoute requireAdmin={false} element={<Home />} />}
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute
              requireAdmin={true}
              element={<Admin testMode={false} />}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
