<template>
    <MainTitle :title="'Votre Profil'" />
    <SecondTitle :title="'Informations Personnelles'" />
    <section>
        <div class="flex flex-col items-center text-2xl text-white m-2">
            <div class="bg-rose-600 text-center py-[20px] px-[25px] info-perso-div">
                <div class="flex-form">
                    <label for="username">Nom:</label>
                    <input type="text" v-model="user.username" @input="detectChangeInfoUser" />
                </div>
                <div class="flex-form">
                    <label for="email">Courriel:</label>
                    <input type="text" v-model="user.email" @input="detectChangeInfoUser" />
                    <span v-if="champError" class="error" v-html="champError"></span>
                </div>
                <div class="flex-form">
                    <button
                        v-bind:disabled="isChangedUser"
                        class="btn-info-user border-2 rounded-md border-purple-600 bg-purple-500 hover:border-indigo-600 hover:bg-indigo-500 px-[10px] py-[5px]"
                        @click="updateUser"
                    >
                        Mettre à Jour votre Profil
                    </button>
                </div>
            </div>
        </div>
    </section>
    <SecondTitle :title="'Informations de votre Voiture'" />
    <section>
        <div class="flex flex-col items-center text-2xl text-white m-2">
            <div class="bg-rose-600 text-center py-[20px] px-[25px] info-perso-div">
                <div class="flex-form">
                    <label for="marque">Marque:</label>
                    <input type="text" v-model="voiture.marque" @input="detectChangeInfoVoiture" />
                </div>
                <div class="flex-form">
                    <label for="modele">Modèle:</label>
                    <input type="text" v-model="voiture.modele" @input="detectChangeInfoVoiture" />
                </div>
                <div class="flex-form">
                    <label for="couleur">Couleur:</label>
                    <input type="text" v-model="voiture.couleur" @input="detectChangeInfoVoiture" />
                </div>
                <div class="flex-form">
                    <label for="plaque">Plaque:</label>
                    <input type="text" v-model="voiture.plaque" @input="detectChangeInfoVoiture" />
                </div>
                <div class="flex-form">
                    <button
                        v-bind:disabled="isChangedVoiture"
                        class="btn-info-user border-2 rounded-md border-purple-600 bg-purple-500 hover:border-indigo-600 hover:bg-indigo-500 px-[10px] py-[5px]"
                        @click="updateVoiture"
                    >
                        Mettre à Jour votre Voiture
                    </button>
                </div>
            </div>
        </div>
    </section>

</template>

<script>
import MainTitle from '../components/MainTitle.vue'
import SecondTitle from '../components/SecondTitle.vue'
import { useToast } from 'vue-toastification'
import { mapState } from 'vuex'
import axios from 'axios'
export default {
    data() {
        return {
            isChangedUser: true,
            isChangedVoiture: true,
            isValidUsername: false,
            isValidEmail: false,
            champError: ''
        }
    },
    methods: {
        detectChangeInfoUser() {
            this.isChangedUser = false
        },
        detectChangeInfoVoiture() {
            this.isChangedVoiture = false
        },
        vaildateUserForm(){
            let isValid = false
            this.isValidUsername = false
            this.isValidEmail = false
            this.champError = ''

            if (!this.user.username) {
                this.isValidUsername = false
                this.champError += 'Veuillez entrer votre nom<br/>'
                
            } else {
                this.isValidUsername = true
            }

            if (!this.user.email) {
                this.isValidEmail = false
                this.champError += 'Veuillez entrer votre courriel<br/>'
                
            } else if (!this.user.email.includes('@')) {
                this.isValidEmail = false
                this.champError += 'Veuillez entrer un courriel valide<br/>'
            } else {
                this.isValidEmail = true
            }

            if (this.isValidUsername && this.isValidEmail) {
                isValid = true
            }

            return isValid
        },
        async updateUser(){

            let id_user = this.user.userId
            if (this.vaildateUserForm()) {
                try{
                    const response = await axios.put(`http://localhost:3000/profil-update/${id_user}`, {
                        username: this.user.username,
                        email: this.user.email,
                        userChange: true,
                        carChange: false,
                        marque: this.voiture.marque,
                        modele: this.voiture.modele, 
                        couleur: this.voiture.couleur,
                        plaque: this.voiture.plaque

                    })  
                    console.log("Reponse", response)
                    response.data.maVoiture = this.voiture
                    this.$store.commit('updateUser', response.data)
                    
                }
                catch(error){
                    if (error.response) {
                        if (error.response.data.message) {
                            this.toast.error(error.response.data.message);
                        }
                    }
                }
            }
        }
    },
    computed: {
        ...mapState(['user', 'voiture'])
    },
    mounted() {
        this.$store.dispatch('getUser')
    },
    setup() {
        const toast = useToast()
        return { toast }
    },
    components: {
        MainTitle,
        SecondTitle
    }
}
</script>

<style scoped>
/* Le code CSS de l'application */
input {
    background-color: rgb(251 113 133);
    border: 2px solid rgb(254 205 211);
    border-radius: 5px;
    margin-top: 5px;
    padding: 5px;
    width: 100%;
    height: 35px;
    font-size: 1.4rem;
    
}

button:disabled {
    cursor: not-allowed;
    color: white;
    font-weight: 600;
    background-color: rgb(196 181 253);
    border-color: rgb(139 92 246);
}

.flex-form {
    width: 100%;
    margin: 5px 0px 5px 0px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.info-perso-div {
    width: 60%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.btn-info-user {
    width: 100%;
    margin-top: 10px;
}
</style>
