import { RootState } from '@/store';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface ModalState {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

const initialState: ModalState = {
  isOpen: false,
  setOpen: () => {},
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    reset: () => initialState,
  },
});

export const { setOpen: setModalOpen, reset: resetModal } = modalSlice.actions;
export const isModalOpen = (state: RootState) => state.modal.isOpen;

export default modalSlice.reducer;
