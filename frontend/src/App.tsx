import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import VehicleRegistry from "./pages/VehicleRegistry";
import Login from "./pages/Login";
import Drivers from "./pages/Drivers";
import Maintenance from "./pages/Maintenance";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<div>Dashboard Page Placeholder</div>} />
          <Route path="vehicles" element={<VehicleRegistry />} />
          <Route path="drivers" element={<Drivers />} />
          <Route path="trips" element={<div>Trip Dispatcher Placeholder</div>} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="expenses" element={<div>Fuel & Expenses Placeholder</div>} />
          <Route path="reports" element={<div>Reports Placeholder</div>} />
          <Route path="settings" element={<div>Settings Placeholder</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
