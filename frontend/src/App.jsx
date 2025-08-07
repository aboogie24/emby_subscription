import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Welcome from "./pages/Welcome";
import Signup from "./pages/Signup";
import Account from "./pages/Account";
import Login from "./pages/Login";
import SetupInfo from "./pages/SetupInfo";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <>
            <Navbar />
            <Welcome />
          </>
        } />
        <Route path="/signup" element={
          <>
            {/* Space background elements for signup page */}
            <div className="space-background"></div>
            <div className="space-particles">
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
            </div>
            <div className="space-planet"></div>
            <Navbar />
            <Signup />
          </>
        } />
        <Route path="/login" element={
          <>
            {/* Space background elements for login page */}
            <div className="space-background"></div>
            <div className="space-particles">
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
            </div>
            <div className="space-planet"></div>
            <Navbar />
            <Login />
          </>
        } />
        <Route path="/account" element={
          <>
            {/* Space background elements for account page */}
            <div className="space-background"></div>
            <div className="space-particles">
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
            </div>
            <div className="space-planet"></div>
            <Navbar />
            <Account />
          </>
        } />
        <Route path="/setup" element={
          <>
            {/* Space background elements for setup page */}
            <div className="space-background"></div>
            <div className="space-particles">
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
              <div className="particle"></div>
            </div>
            <div className="space-planet"></div>
            <Navbar />
            <SetupInfo />
          </>
        } />
      </Routes>
    </Router>
  );
}
