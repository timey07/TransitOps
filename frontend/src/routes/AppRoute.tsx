import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Trips from "../pages/Trips";
import Expenses from "../pages/Expenses";
import Report from "../pages/Report";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/trips" element={<Trips />} />
      <Route path="/expenses" element={<Expenses />} />
      <Route path="/reports" element={<Report/>} />
    </Routes>
  );
}

export default AppRoutes;