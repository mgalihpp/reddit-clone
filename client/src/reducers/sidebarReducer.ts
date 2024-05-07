import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '@/store';

type SideBarState = {
  resourcesOpen: boolean;
  communityOpen: boolean;
};

const initialState: SideBarState = {
  resourcesOpen: true,
  communityOpen: false,
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggleResources: (state, action: PayloadAction<boolean>) => {
      state.resourcesOpen = action.payload;
    },
    toggleCommunity: (state, action: PayloadAction<boolean>) => {
      state.communityOpen = action.payload;
    },
  },
});

export const { toggleResources, toggleCommunity } = sidebarSlice.actions;

export const selectResourcesOpen = (state: RootState) =>
  state.sidebar.resourcesOpen;
export const selectCommunityOpen = (state: RootState) =>
  state.sidebar.communityOpen;

export default sidebarSlice.reducer;
