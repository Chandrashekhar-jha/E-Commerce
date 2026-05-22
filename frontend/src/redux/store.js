import {configureStore} from "@reduxjs/toolkit";
import cartReducer from "../redux/cartSlics";

const store = configureStore({
    reducer: {
        cart: cartReducer,
    },
});

export default store;