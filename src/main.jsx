import React, { Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./base.css";
import Gate from "./gate";
import { SiteLayout } from "./layout";
import { loaders } from "./routes";
import { ScrollManager, TransitionProvider } from "./transition";

// GATE ships in the entry bundle. Every other route is its own lazily loaded chunk.
const Hub = lazy(loaders.hub);
const WorkPage = lazy(loaders.work);
const ImpactPage = lazy(loaders.impact);
const ExperiencePage = lazy(loaders.experience);
const ProfilePage = lazy(loaders.profile);
const ProjectDetail = lazy(loaders.detail);

function LegacyProject() {
  const { id } = useParams();
  return <Navigate to={`/main/work/${id}`} replace />;
}

function App() {
  return (
    <BrowserRouter>
      <TransitionProvider>
        <ScrollManager />
        <Routes>
          <Route path="/" element={<Gate />} />
          <Route path="/main" element={<SiteLayout />}>
            <Route index element={<Hub />} />
            <Route path="work" element={<WorkPage />} />
            <Route path="work/:id" element={<ProjectDetail />} />
            <Route path="impact" element={<ImpactPage />} />
            <Route path="experience" element={<ExperiencePage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route path="/projects/:id" element={<LegacyProject />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </TransitionProvider>
    </BrowserRouter>
  );
}

// After a redeploy an open tab can ask for a chunk that no longer exists: reload once to pick up the new build.
window.addEventListener("vite:preloadError", () => {
  try {
    if (sessionStorage.getItem("chunk-reloaded")) return;
    sessionStorage.setItem("chunk-reloaded", "1");
  } catch {
    /* ignore */
  }
  window.location.reload();
});

createRoot(document.getElementById("root")).render(
  <Suspense fallback={null}>
    <App />
  </Suspense>,
);
