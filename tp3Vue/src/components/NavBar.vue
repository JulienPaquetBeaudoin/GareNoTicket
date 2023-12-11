<template>
    <div class="flex justify-between p-5 text-xl shadow-md bg-rose-200 text-white">
        <h1 class="ml-4 font-bold">GareNoTicket</h1>
        <nav>
            <ul class="flex justify-around" v-if="!user">
                <li>
                    <router-link
                        class="border-2 rounded-md border-rose-500 bg-rose-400 px-[10px] py-[3px] hover:border-purple-400 hover:bg-purple-300"
                        :to="{ name: 'Login' }"
                        >Connexion</router-link
                    >
                </li>
                <li>
                    <router-link
                        class="ml-6 border-2 rounded-md border-rose-500 bg-rose-400 px-[10px] py-[3px] hover:border-purple-400 hover:bg-purple-300"
                        :to="{ name: 'SignUp' }"
                        >S'inscrire</router-link
                    >
                </li>
            </ul>
            <ul class="flex justify-around" v-else>
                <li>
                    <router-link
                        class="border-2 rounded-md border-rose-500 bg-rose-400 px-[10px] py-[3px] hover:border-purple-400 hover:bg-purple-300"
                        :to="{ name: 'Home' }"
                        >My Place</router-link
                    >
                </li>
                <li v-if="user.isValet">
                    <router-link
                        class="ml-6 border-2 rounded-md border-rose-500 bg-rose-400 px-[10px] py-[3px] hover:border-purple-400 hover:bg-purple-300"
                        :to="{ name: 'Valet' }"
                        >Valet</router-link
                    >
                </li>
                <li>
                    <router-link
                        class="ml-6 border-2 rounded-md border-rose-500 bg-rose-400 px-[10px] py-[3px] hover:border-purple-400 hover:bg-purple-300"
                        :to="{ name: 'Profil' }"
                        >Profil</router-link
                    >
                </li>
                <li>
                    <router-link
                        class="ml-6 border-2 rounded-md border-rose-500 bg-rose-400 px-[10px] py-[3px] hover:border-purple-400 hover:bg-purple-300"
                        :to="{ name: 'Transaction' }"
                        >Transaction</router-link
                    >
                </li>
                <li>
                    <router-link
                        class="ml-6 mr-4 border-2 rounded-md border-rose-500 bg-rose-400 px-[10px] py-[3px] hover:border-purple-400 hover:bg-purple-300"
                        :to="{ name: 'Deconnexion' }"
                        >Déconnexion</router-link
                    >
                </li>
            </ul>
        </nav>
    </div>
</template>


<script>
   import { mapState } from 'vuex'

   export default {
       computed: {
           ...mapState(['user'])
       },
       mounted() {
           this.$store.dispatch('getUser')
       }
   }
   </script>
