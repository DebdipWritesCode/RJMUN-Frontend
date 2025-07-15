import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/Home/HomePage";
import CommitteesPage from "../pages/Committees/CommitteesPage";
import EBsPage from "../pages/EBs/EBPage";
import TeamsPage from "../pages/Teams/TeamsPage";
import SponsorsPage from "../pages/Sponsors/SponsorsPage";
import FAQPage from "../pages/FAQ/FAQsPage";
import CAPortalPage from "../pages/CA/CAPortalPage";

import RegisterLanding from "../pages/Register/RegisterLanding";
import NewRegistration from "../pages/Register/NewRegistration";
import CheckAllotment from "../pages/Register/CheckAllotment";

import AdminLayout from "../layouts/AdminLayout";
import AdminLogin from "../pages/Admin/AdminLogin";
import AdminDashboard from "../pages/Admin/Dashboard";
import AdminCommittees from "../pages/Admin/Committees";
import AdminEBs from "../pages/Admin/EBs";
import AdminTeams from "../pages/Admin/Teams";
import AdminSponsors from "../pages/Admin/Sponsors";
import AdminFAQ from "../pages/Admin/FAQs";
import Coupons from "@/pages/Admin/Coupons";
import Portfolios from "@/pages/Admin/Portfolios";

import ProtectedRoute from "./ProtectedRoute";

import NotFoundPage from "@/pages/NotFoundPage";

const Router = () => {
  return (
    <Routes>
      {/* Public Layout with Navbar */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/committees" element={<CommitteesPage />} />
        <Route path="/ebs" element={<EBsPage />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/sponsors" element={<SponsorsPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/ca" element={<CAPortalPage />} />
        <Route path="/register" element={<RegisterLanding />} />
        <Route path="/register/new" element={<NewRegistration />} />
        <Route path="/register/check" element={<CheckAllotment />} />
      </Route>

      <Route path="/admin" element={<AdminLogin />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/committees" element={<AdminCommittees />} />
          <Route path="/admin/ebs" element={<AdminEBs />} />
          <Route path="/admin/teams" element={<AdminTeams />} />
          <Route path="/admin/sponsors" element={<AdminSponsors />} />
          <Route path="/admin/faq" element={<AdminFAQ />} />
          <Route path="/admin/coupons" element={<Coupons />} />
          <Route path="/admin/portfolios" element={<Portfolios />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default Router;
