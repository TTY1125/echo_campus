import { createStore } from 'vuex';

const store = createStore({
    state: {
        isLogin: false,
        token:localStorage.getItem('token') ? localStorage.getItem('token'):'',
    },
    getters: {

    },
    mutations: {
        setToken(state, token) {
            state.token = token;
            localStorage.setItem('token', token);
        },
    },
    actions: {
        setToken({ commit }, token) {
            commit('setToken', token);
        },
    },
});

export default store;
