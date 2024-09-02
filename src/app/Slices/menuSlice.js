import { createSlice } from "@reduxjs/toolkit";

import { RiDashboardLine } from "react-icons/ri";
import { FaUsersLine } from "react-icons/fa6";
import { PiUserList } from "react-icons/pi";
import { MdAccountBalance } from "react-icons/md";
import { IoWalletOutline } from "react-icons/io5";
import { MdAppSettingsAlt } from "react-icons/md";
import { MdOutlineSettingsApplications } from "react-icons/md";
import { VscReferences } from "react-icons/vsc";
import { TbMarquee } from "react-icons/tb";
import { RiLogoutBoxLine } from "react-icons/ri";
import { MdCategory } from "react-icons/md";
import { IoGameControllerOutline } from "react-icons/io5";
import { TbGoGame } from "react-icons/tb";
import { PiBank } from "react-icons/pi";
import { BsQrCode } from "react-icons/bs";
import { FaHistory } from "react-icons/fa";
import { MdOutlineWallet } from "react-icons/md";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { BiMoneyWithdraw } from "react-icons/bi";

const initialState = {
  LinkItems: [],
};

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setLinkItems: (state, action) => {
      state.LinkItems = action.payload;
    },
  },
});

export const { setLinkItems } = menuSlice.actions;

export const fetchLinkItems = () => (dispatch) => {
  const isVisible = true;

  const LinkItems = [
    {
      id: 1,
      title: "Dashboard",
      icon: RiDashboardLine,
      href: "/dashboard",
      visible: isVisible,
    },
    {
      id: 2,
      title: "User",
      icon: FaUsersLine,
      href: "#",
      visible: isVisible,
      subItems: [
        {
          id: 21,
          title: "User List",
          icon: PiUserList,
          href: "/user/user-list",
        },
      ],
    },
    {
      id: 3,
      title: "Game",
      icon: IoGameControllerOutline,
      href: "#",
      visible: isVisible,
      subItems: [
        {
          id: 31,
          title: "Game Category",
          icon: MdCategory,
          href: "/game/game-category",
        },
        {
          id: 32,
          title: "Game List",
          icon: TbGoGame,
          href: "/game/game-list",
        },
      ],
    },
    {
      id: 4,
      title: "Accounts",
      icon: MdAccountBalance,
      href: "#",
      visible: isVisible,
      subItems: [
        {
          id: 41,
          title: "Bank Account",
          icon: PiBank,
          href: "accounts/bank-account",
        },
        {
          id: 42,
          title: "Upi Lists",
          icon: BsQrCode,
          href: "/accounts/upi-list",
        },
      ],
    },
    {
      id: 5,
      title: "Wallet",
      icon: IoWalletOutline,
      href: "#",
      visible: isVisible,
      subItems: [
        {
          id: 51,
          title: "Play Records",
          icon: FaHistory,
          href: "/wallet/play-records",
        },
        {
          id: 52,
          title: "Wallet History",
          icon: MdOutlineWallet,
          href: "/wallet/wallet-history",
        },
        {
          id: 53,
          title: "Recharge Request",
          icon: HiOutlineCurrencyRupee,
          href: "/wallet/recharge-request",
        },
        {
          id: 54,
          title: "Withdrawal Request",
          icon: BiMoneyWithdraw,
          href: "/wallet/withdrawal-request",
        },
      ],
    },
    {
      id: 6,
      title: "Setting",
      icon: MdOutlineSettingsApplications,
      href: "#",
      visible: isVisible,
      subItems: [
        {
          id: 61,
          title: "App Setting",
          icon: MdAppSettingsAlt,
          href: "/setting/app-setting",
        },
      ],
    },
    {
      id: 7,
      title: "Refer Team",
      icon: VscReferences,
      href: "/refer",
      visible: isVisible,
    },
    {
      id: 8,
      title: "Marquee",
      icon: TbMarquee,
      href: "/marquee",
      visible: isVisible,
    },
    {
      id: 9,
      title: "Logout",
      icon: RiLogoutBoxLine,
      href: "/logout",
      visible: isVisible,
    },
  ];

  const filteredLinkItems = LinkItems.filter((item) => item.visible);

  dispatch(setLinkItems(filteredLinkItems));
};

export default menuSlice.reducer;
