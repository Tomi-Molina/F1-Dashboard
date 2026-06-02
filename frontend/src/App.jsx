import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import RaceDetails from "./pages/RaceDetails";
import DriverComparison from "./pages/DriverComparison";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/races/:raceId" element={<RaceDetails />} />
          <Route path="/compare" element={<DriverComparison />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
