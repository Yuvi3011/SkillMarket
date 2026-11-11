
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Login from "./modules/auth/pages/Login";
import Signup from "./modules/auth/pages/Signup";
import Profile from "./modules/auth/pages/Profile";

import Home from "./modules/marketplace/pages/Home";
import Explore from "./modules/marketplace/pages/Explore";

import Exchange from "./modules/exchange/pages/Exchange";

import MyOrders from "./modules/orders/pages/MyOrders";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        {/* Member 1 */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />

        {/* Member 2 */}
        <Route path="/explore" element={<Explore />} />

        {/* Member 3 */}
        <Route path="/exchange" element={<Exchange />} />

        {/* Member 4 */}
        <Route path="/orders" element={<MyOrders />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
