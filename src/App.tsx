import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/layouts/Layout";
import Home from "@/pages/Home";
import Product from "@/pages/Product";
import Inventory from "@/pages/Inventory";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/inventory" element={<Inventory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
