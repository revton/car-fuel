import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/Layout/MainLayout';
import { VehicleList, VehicleForm } from './pages/Vehicles';
import { FuelingList, FuelingForm } from './pages/Fuelings';
import { HomePage } from './pages/HomePage';
import { HealthProvider } from './shared/context/HealthContext';
import './App.css';

// Placeholder Pages removed


import { TankList } from './pages/Tanks/TankList';
import { TankForm } from './pages/Tanks/TankForm';

function App() {
  return (
    <HealthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="dashboard" element={<HomePage />} />
            <Route path="vehicles" element={<VehicleList />} />
            <Route path="vehicles/new" element={<VehicleForm />} />
            <Route path="vehicles/:vehicleId/tanks" element={<TankList />} />
            <Route path="vehicles/:vehicleId/tanks/new" element={<TankForm />} />
            <Route path="fuelings" element={<FuelingList />} />
            <Route path="fuelings/new" element={<FuelingForm />} />
          </Route>
        </Routes>
      </Router>
    </HealthProvider>
  );
}

export default App;
