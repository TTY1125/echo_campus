import { createStore } from 'vuex';

const store = createStore({
    state: {
        isLogin: localStorage.getItem('token'),//如果存了token,说明登陆了
        token:localStorage.getItem('token') ? localStorage.getItem('token'):'',
    },
    getters: {

    },
    mutations: {
        setToken(state, token) {
            state.token = token;
            localStorage.setItem('token', token);
        },
        logout(state) {
            state.token = '';
            state.isLogin = false;
            localStorage.setItem('token', '');
        },
        loginSuccess(state) {
            state.isLogin = true;
        },
    },
    actions: {
        setToken({ commit }, token) {
            commit('setToken', token);
        },
    },
});

export default store;
