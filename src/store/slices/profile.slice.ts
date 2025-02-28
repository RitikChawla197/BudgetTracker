import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProfileState {
    username: string;
    email: string;
    dp: string;
};

const initialState: ProfileState = {
    username: '',
    dp: '',
    email: ''
}

const profileSlice = createSlice({
    initialState,
    name: 'profile',
    reducers: {
        changeProfileWhenRegister: (state, action: PayloadAction<{ email: string, username:string }>) => {
            state.email = action.payload.email;
            state.username = action.payload.username;
        },
        removeProfile: (state) => {
            state.dp = '';
            state.email = '';
            state.username = '';
        }
    }
});

export const { changeProfileWhenRegister, removeProfile } = profileSlice.actions;
export default profileSlice.reducer;