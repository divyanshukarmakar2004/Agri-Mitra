import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Lazy load pages for better performance
const LoginPage = React.lazy(() => import("./pages/LoginPage"));
const DashboardPage = React.lazy(() => import("./pages/DashboardPage"));
const FarmersPage = React.lazy(() => import("./pages/FarmersPage"));
const FarmerDetailPage = React.lazy(() => import("./pages/FarmerDetailPage"));
const YieldAnalysisPage = React.lazy(() => import("./pages/YieldAnalysisPage"));
const PestTrackingPage = React.lazy(() => import("./pages/PestTrackingPage"));
const MarketPricesPage = React.lazy(() => import("./pages/MarketPricesPage"));
const AlertsPage = React.lazy(() => import("./pages/AlertsPage"));
const SchemesPage = React.lazy(() => import("./pages/SchemesPage"));
const ReportsPage = React.lazy(() => import("./pages/ReportsPage"));
const SettingsPage = React.lazy(() => import("./pages/SettingsPage"));

function App() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/farmers" element={<FarmersPage />} />
        <Route path="/farmers/:id" element={<FarmerDetailPage />} />
        <Route path="/yield-analysis" element={<YieldAnalysisPage />} />
        <Route path="/pest-tracking" element={<PestTrackingPage />} />
        <Route path="/market-prices" element={<MarketPricesPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/schemes" element={<SchemesPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
