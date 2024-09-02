import { configureStore } from "@reduxjs/toolkit";
import menuReducer from "../Slices/menuSlice";
import UsersReducer from "../Slices/UsersSlice";
import CategoryReducer from "../Slices/CategorySlice";
import Bank_AccountReducer from "../Slices/BankSlice";
import UpiReducer from "../Slices/UpiSlice";
import PlayRecordsReducer from "../Slices/PlayRecordsSlice";
import WalletHistoryReducer from "../Slices/WalletHistorySlice";
import RechargeReducer from "../Slices/RechargeSlice";
import WithdrawalReducer from "../Slices/WithdrawalSlice";
import AppReducer from "../Slices/AppSlice";
import ReferReducer from "../Slices/ReferSlice";
import MarqueeReducer from "../Slices/MarqueeSlice";
import GameListReducer from "../Slices/GameListSlice";

const Store = configureStore({
  reducer: {
    menu: menuReducer,
    Users: UsersReducer,
    Category: CategoryReducer,
    GameList: GameListReducer,
    Bank_Account: Bank_AccountReducer,
    Upi: UpiReducer,
    PlayRecords: PlayRecordsReducer,
    WalletHistory: WalletHistoryReducer,
    Recharge: RechargeReducer,
    Withdrawal: WithdrawalReducer,
    app: AppReducer,
    Refer: ReferReducer,
    Marquee: MarqueeReducer
  },
});

export default Store;
