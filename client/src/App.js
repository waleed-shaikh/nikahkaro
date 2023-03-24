import "./stylesheets/theme.css";
import "./stylesheets/alignments.css";
import "./stylesheets/textelements.css";
import "./stylesheets/custom-components.css";
import "./stylesheets/form-elements.css";
import "./stylesheets/layout.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/common/Login";
import Register from "./pages/common/Register";
import Dashboard from "./pages/common/Dashboard";
import Loader from "./components/Loader";
import { useSelector } from "react-redux";
import Home from "./pages/common/Home";

function App() {
  const { loading } = useSelector((state) => state.loader);
  return (
    <>
      {loading && <Loader/>}
      <BrowserRouter>
        <Routes>
          {/* Common Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
