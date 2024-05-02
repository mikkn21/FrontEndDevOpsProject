import React, { useEffect } from "react";
import ProtectedRoute from "./components/ProtectedRoute/protectedRoute";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/login/login";
import Page1 from "./pages/page1/page1";
import Page2 from "./pages/Page2/page2";
import Home from "./pages/home/home";
import { loadConfig, config } from "./config";

const App: React.FC = () => {
  loadConfig();
  console.log("config", config);
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
          path="/p1"
          element={<ProtectedRoute requireAdmin={false} element={<Page1 />} />}
        />
        <Route
          path="/p2"
          element={<ProtectedRoute requireAdmin={false} element={<Page2 />} />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
