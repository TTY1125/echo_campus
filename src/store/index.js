import { createStore } from 'vuex';

const store = createStore({
    state: {
        isLogin: localStorage.getItem('token'),//如果存了token,说明登陆了
        token: localStorage.getItem('token') ? localStorage.getItem('token'):'',
        id: localStorage.getItem('id') ? Number(localStorage.getItem('id')):Number(-1),
    },
    getters: {
        getId: state => {
            return state.id;
        }
    },
    mutations: {
        setId(state, id) {
            state.id = id;
            localStorage.setItem('id', id);
        },
        setToken(state, token) {
            state.token = token;
            localStorage.setItem('token', token);
        },
        logout(state) {
            state.token = '';
            state.isLogin = false;
            localStorage.setItem('token', '');
            localStorage.setItem('id', -1);
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
