import { createSlice } from '@reduxjs/toolkit';

export const groupsSlice = createSlice({
    name: 'groups',
    initialState: {
        groups: [],
        loading: false,
        error: null
    },
    reducers: {
        setGroups: (state, action) => {
            state.groups = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setUserDetails: (state, action) => {
            state.userDetails = action.payload;
          },
        resetGroups: (state) => {
            state.groups = [],
            state.userDetails = []
            state.loading = false,
            state.error=  null 
        },
        updateInfoMembers: (state, action) => {
            const { groupId, infoMembers } = action.payload;
            const group = state.groups.find(group => group.id === groupId);
            if (group) {
                group.InfoMembers = infoMembers;
            }
        },
    }
});


export const { setGroups , setLoading , setError , setUserDetails, resetGroups, updateInfoMembers } = groupsSlice.actions;