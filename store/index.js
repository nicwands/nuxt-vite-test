import Vue from 'vue'

export const state = () => {
    return {
        settings: {},
        channels: [],
        currentChannel: 0,
        merchAgreeHovered: false,
        loadingCompleted: false,
    }
}

export const mutations = {
    SET_SITE_SETTINGS: (state, data) => {
        return (state.settings = data)
    },
    SET_ALL_CHANNELS: (state, data) => {
        state.channels = data
    },
    SET_CURRENT_CHANNEL: (state, channel) => {
        return (state.currentChannel = channel)
    },
    SET_MERCH_AGREE_HOVER: (state, val) => {
        state.merchAgreeHovered = val
    },
    SET_LOADING_COMPLETED: (state, val) => {
        state.loadingCompleted = val
    },
}

export const actions = {}

export const getters = {}
