// store.js
import { createStore } from 'vuex'
import { jwtDecode } from 'jwt-decode'
//import axios from 'axios'

export default createStore({
    state: {
        user: null,
        voiture: null  
    },
    mutations: {
        setUser(state, user) {
            state.user = user
        },
        setVoiture(state, voiture) {
            state.voiture = voiture  
        },
        updateVoiture(state, newVoiture) {
            state.voiture = newVoiture;
        },
        updateUser(state, updatedUser) {
            state.user = updatedUser;
        },
    },
    actions: {
        getUser({ commit }) {
            const token = localStorage.getItem('jwt')
            if (token) {
                const decodedToken = jwtDecode(token)
                const user = decodedToken
                commit('setUser', user)
                if (user && this.state.voiture == null) {
                    commit('setVoiture', user.maVoiture)
                }
            }
        },
        loginUser({ commit }, token) {
            const decodedToken = jwtDecode(token)
            const user = decodedToken
            commit('setUser', user)
            if (user && user.maVoiture) {
                commit('setVoiture', user.maVoiture)
            }
        },
        logoutUser({ commit }) {
            commit('setUser', null)
            commit('setVoiture', null)
        }
    }
})