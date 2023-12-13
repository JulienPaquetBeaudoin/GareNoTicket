<template>
    
    <form
        class="flex flex-col items-center m-[50px] bg-rose-400 p-[20px] text-lg text-white font-semibold border-2 rounded-md"
        novalidate
        @submit.prevent="submitResgister"
    >
        <h1 class="text-4xl">Créer un Compte</h1>
        <div>
            <div class="m-3">
                <label class="mr-3" for="nom">Nom:</label>
                <div class="flex flex-col">
                    <input
                        class="bg-rose-200 rounded-sm"
                        type="text"
                        id="nom"
                        v-model.trim="nom"
                        required
                    />
                    <span v-if="usernameError" class="error">{{ usernameError }}</span>
                </div>
            </div>

            <div class="m-3">
                <label class="mr-3" for="emailUp">Courriel:</label>
                <div class="flex flex-col">
                    <input
                        class="bg-rose-200 rounded-sm"
                        type="email"
                        id="emailUp"
                        v-model.trim="email"
                        required
                    />
                    <span v-if="emailError" class="error">{{ emailError }}</span>
                </div>
            </div>

            <div class="m-3">
                <label class="mr-3" for="passwordUp">Mot de passe:</label>
                <div class="flex flex-col">
                    <input
                        class="bg-rose-200 rounded-sm"
                        type="password"
                        id="passwordUp"
                        v-model.trim="password"
                        required
                    />
                </div>
            </div>

            <div class="m-3">
                <label class="mr-3" for="confirmPassword">Mot de passe:</label>
                <div class="flex flex-col">
                    <input
                        class="bg-rose-200 rounded-sm"
                        type="password"
                        id="confirmPassword"
                        v-model.trim="confirmPassword"
                        required
                    />
                    <span v-if="passwordError" class="error">{{ passwordError }}</span>
                </div>
            </div>
        </div>
        <div class="m-3">
            <span v-if="champError" class="error">{{ champError }}</span>
        </div>
        <button
            class="border-2 rounded-md border-rose-600 bg-rose-500 px-[10px] py-[5px] hover:border-purple-600 hover:bg-purple-500"
            type="submit"
        >
            Connexion
        </button>
    </form>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            nom: '',
            email: '',
            password: '',
            confirmPassword: '',
            usernameError: '',
            emailError: '',
            passwordError: '',
            champError: '',
        }
    },
    methods: {
        validateForm(){
            let isValid = false
            this.usernameError = ''
            this.emailError = ''
            this.passwordError = ''
            let regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

            if (!this.nom) {
                this.usernameError = 'Veuillez entrer votre nom'
            }

            if (!this.email) {
                this.emailError = 'Veuillez entrer votre courriel'
            } else { 
                if (!regex.test(this.email)) {
                    this.emailError = 'Veuillez entrer un courriel valide'
                }
            }

            if (!this.password) {
                this.passwordError = 'Veuillez entrer votre mot de passe'
            } else if (this.password !== this.confirmPassword) {
                this.passwordError = 'Les mots de passe ne correspondent pas'
            }

            if (!this.usernameError && !this.emailError && !this.passwordError) {
                isValid = true
            }

            return isValid
        },
        submitResgister() {
            if (this.validateForm()) {
                axios.post('https://gare-no-ticket-iota.vercel.app/auth/signup', {
                    email: this.email,
                    username: this.nom,
                    password: this.password,
                    confirmPassword: this.confirmPassword
                })
                .then(() => {
                    this.$router.push('/login');
                })
                .catch(error => {
                    if (error.response) {
                        if (error.response.data.message) {
                            this.champError += error.response.data.message;                           
                        }
                    }
                });
            }
        }    
    }
}
    

</script>

<style>
.error {
    color: #881337;
}
</style>
