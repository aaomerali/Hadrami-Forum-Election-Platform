import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import VoterLogin from "./pages/VoterLogin";
import VotePage from "./pages/VotePage";
import VoteSuccess from "./pages/VoteSuccess";
import Dashboard from "./pages/Dashboard";
import UsersTab from "./pages/UsersTab";
import CandidatesTab from "./pages/CandidatesTab";
import ControlTab from "./pages/ControlTab";
import ResultsTab from "./pages/ResultsTab";
import DashboardHome from "./pages/DashboardHome";
import ProtectedRoute from "./components/ProtectedRoute";
import VoteClosed from "./pages/VoteClosed"; // حسب مسار الحفظ



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="users" element={<UsersTab />} />
          <Route path="candidates" element={<CandidatesTab />} />
          <Route path="control" element={<ControlTab />} />
          <Route path="results" element={<ResultsTab />} />
        </Route>
        <Route path="/voter-login" element={<VoterLogin />} />
        <Route path="/vote/:voteId" element={<VotePage />} />
        <Route path="/vote-success" element={<VoteSuccess />} />
        <Route path="/vote-closed" element={<VoteClosed />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
