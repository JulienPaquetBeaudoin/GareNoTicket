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
        // Définir l'utilisateur dans l'état
        setUser(state, user) {
            state.user = user
        },
        // Définir la voiture dans l'état
        setVoiture(state, voiture) {
            state.voiture = voiture  
        },
        // Mettre à jour la voiture dans l'état
        updateVoiture(state, newVoiture) {
            state.voiture = newVoiture;
        },
        // Mettre à jour l'utilisateur dans l'état
        updateUser(state, updatedUser) {
            state.user = updatedUser;
        },
    },
    actions: {
        // Obtenir l'utilisateur
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
        // Connecter l'utilisateur
        loginUser({ commit }, token) {
            const decodedToken = jwtDecode(token)
            const user = decodedToken
            commit('setUser', user)
            if (user && user.maVoiture) {
                commit('setVoiture', user.maVoiture)
            }
        },
        
        // Déconnecter l'utilisateur
        logoutUser({ commit }) {
            commit('setUser', null)
            commit('setVoiture', null)
        }
    }
})