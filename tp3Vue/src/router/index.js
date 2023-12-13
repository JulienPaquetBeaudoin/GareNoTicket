import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import SignUpView from '../views/SignUpView.vue'
import ValetView from '../views/ValetView.vue'
import TransactionView from '../views/TransactionView.vue'
import DeplacementView from '../views/DeplacementView.vue'
import ProfilView from '../views/ProfilView.vue'
import NotFound404View from '../views/NotFound404View.vue'
import store from '../store'
import { useToast } from "vue-toastification";

const toast = useToast();


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
      beforeEnter: (to, from, next) => {
        // Vérifiez si le token JWT existe
        const token = localStorage.getItem('jwt');
        if (!token) {
          toast.error("Vous devez être connecté pour accéder à Ma Place.");
          next({ name: 'Login' })
        } else {
          // Vérifiez si user.voiture est null
          if (!store.state.user.isValet) {
            if (store.state.user.voiture === null) {
              toast.error("Vous devez avoir une voiture pour accéder à Ma Place.");
              next({ name: 'Profil' })
            } else {
              next()
            }
          } else {
            next({ name: 'Valet' })
          }
          
        }
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUpView
    },
    {
      path: '/Valet',
      name: 'Valet',
      component: ValetView,
      beforeEnter: (to, from, next) => {
        // Vérifiez si l'utilisateur est un valet
        if (store.state.user.isValet) {
          next();
        } else {
          toast.error("Vous devez être un valet pour accéder à Valet.");
          next({ name: 'Home' });
        }
      }
    },
    {
      path: '/deconnexion',
      name: 'Deconnexion',
      beforeEnter() {
        localStorage.removeItem('jwt')
        store.dispatch('logoutUser');
        toast.success("Vous êtes déconnecté.",{
          timeout: 2000
        });
        router.push({ name: 'Login' })
      }
    },
    {
      path: '/transaction',
      name: 'Transaction',
      component: TransactionView,
      beforeEnter: (to, from, next) => {
        if (store.state.user === null) {
          toast.error("Vous devez être connecté pour accéder à Transaction.");
          next({ name: 'Login' })
        } else {
          next()
        }
      }
    },
    {
      path: '/profil',
      name: 'Profil',
      component: ProfilView,
      beforeEnter: (to, from, next) => {
        if (store.state.user === null) {
          toast.error("Vous devez être connecté pour accéder à Profil.");
          next({ name: 'Login' })
        } else {
          next()
        }
      }

    },
    {
      path: '/deplacement/:id_voiture/:id_user',
      name: 'Deplacement',
      component: DeplacementView,
      beforeEnter: (to, from, next) => {
        if (store.state.user === null) {
          toast.error("Vous devez être connecté pour accéder à Deplacement.");
          next({ name: 'Login' })
        } else {
          if (!store.state.user.isValet) {
            toast.error("Vous devez être un valet pour accéder à Deplacement.");
            next({ name: 'Home' })
          }
          else {
            next()
          }
        }
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound404View
    }
  ]
})

export default router
