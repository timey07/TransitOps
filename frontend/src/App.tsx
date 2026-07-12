import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import VehicleRegistry from "./pages/VehicleRegistry";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<div>Dashboard Page Placeholder</div>} />
          <Route path="vehicles" element={<VehicleRegistry />} />
          <Route path="drivers" element={<div>Driver Profiles Placeholder</div>} />
          <Route path="trips" element={<div>Trip Dispatcher Placeholder</div>} />
          <Route path="maintenance" element={<div>Maintenance Placeholder</div>} />
          <Route path="expenses" element={<div>Fuel & Expenses Placeholder</div>} />
          <Route path="reports" element={<div>Reports Placeholder</div>} />
          <Route path="settings" element={<div>Settings Placeholder</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
