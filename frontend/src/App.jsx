import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import Account from "./pages/Account";
import Login from "./pages/Login"; 

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/account" element={<Account />} />
      </Routes>
    </Router>
  );
}
