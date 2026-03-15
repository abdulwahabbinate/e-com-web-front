import React from "react";
import ReactDOM from "react-dom/client";
import "../node_modules/font-awesome/css/font-awesome.min.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./admin/scss/style.scss";
import "./index.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

import store from "./redux/store";
import ScrollToTop from "./components/ScrollToTop";

import {
  Home,
  Product,
  Products,
  AboutPage,
  ContactPage,
  Cart,
  Wishlist,
  Login,
  Register,
  Checkout,
  OrderSuccess,
  PageNotFound,
} from "./pages";

import DefaultLayout from "./admin/layout/DefaultLayout";
import AdminLogin from "./admin/views/pages/login/Login";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <ScrollToTop>
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Products />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<DefaultLayout />} />

          <Route path="/product/*" element={<PageNotFound />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Provider>
    </ScrollToTop>
    <Toaster />
  </BrowserRouter>
);
