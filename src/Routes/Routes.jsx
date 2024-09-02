import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate
} from "react-router-dom";
import FullLayout from "../Layouts/FullLayout";
import Dashboard from "../components/Dashboard/Dashboard";
import Notfound from "../components/NotFound/NotFound";
import Login from "../components/Login_Logout/Login";
import Logout from "../components/Login_Logout/Logout";
import Register from "../components/Login_Logout/Register";
import User_List from "../components/Users/User_List";
import Game_Category from "../components/Game/Game_Category/Game_Category";
import Game_List from "../components/Game/Game_List/Game_List";
import Bank_Account from "../components/Accounts/Bank_Account/Bank_Account";
import Upi_List from "../components/Accounts/Upi_lists/Upi_List";
import Play_Records from "../components/Wallet/Play_Records/Play_Records";
import Wallet_History from "../components/Wallet/Wallet_History/Wallet_History";
import Recharge_Request from "../components/Wallet/Recharge/Recharge_Request";
import Withdrawal_Request from "../components/Wallet/Withdrawal/Withdrawal_Request";
import App_Setting from "../components/Setting/App_Setting/App_Setting";
import Refer from "../components/Refer/Refer";
import Marquee from "../components/Marquee/Marquee";

const routes = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<Login />} />
      <Route path="/register-now" element={<Register />} />
      <Route path="/logout" element={<Logout />} />

      <Route
        path="/"
        element={
          sessionStorage.getItem("isAuthenticated") === "true" ? (
            <FullLayout />
          ) : (
            <Navigate to="/login" />
          )
        }
      >
        {" "}
        <Route index element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/user/user-list" element={<User_List />} />
        <Route path="/game/game-category" element={<Game_Category />} />
        <Route path="/game/game-list" element={<Game_List />} />
        <Route path="/accounts/bank-account" element={<Bank_Account />} />
        <Route path="/accounts/upi-list" element={<Upi_List />} />
        <Route path="/wallet/play-records" element={<Play_Records />} />
        <Route path="/wallet/wallet-history" element={<Wallet_History />} />
        <Route path="/wallet/recharge-request" element={<Recharge_Request />} />
        <Route
          path="/wallet/withdrawal-request"
          element={<Withdrawal_Request />}
        />
        <Route path="/setting/app-setting" element={<App_Setting />} />
        <Route path="/refer" element={<Refer />} />
        <Route path="/marquee" element={<Marquee />} />
      </Route>
      <Route path="*" element={<Notfound />} />
    </>
  )
);

export default routes;
