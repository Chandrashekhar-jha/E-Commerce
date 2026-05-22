import {createSlice} from "@reduxjs/toolkit";


const intialState = {
    cartItems: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [],
};



const cartSlice = createSlice({
    name: "cart",
    initialState: {
        reducers
    },
});