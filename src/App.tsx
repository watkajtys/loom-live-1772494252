import { Routes, Route, Navigate } from 'react-router-dom';
import Logger from './Logger';

export default function App() {
  return (
    <Routes>
      <Route path="/logger" element={<Logger />} />
      <Route path="*" element={<Navigate to="/logger" replace />} />
    </Routes>
  );
}
