<template>
    <form class="flex flex-col items-center m-[100px] bg-rose-400 p-[20px] text-lg text-white font-semibold border-2 rounded-md" novalidate @submit.prevent="submitLogin">
        <div>
            <div class="m-3">
                <label class="mr-3" for="email">Courriel:</label>
                <div class="flex flex-col">
                    <input class="bg-rose-200 rounded-sm" type="email" id="email" v-model.trim="email" required />
                </div>
            </div>
        
            <div class="m-3">
                <label class="mr-3" for="password">Mot de passe:</label>
                <div class="flex flex-col">
                    <input class="bg-rose-200 rounded-sm" type="password" id="password" v-model.trim="password" required />
                    <span v-if="champError" class="error" v-html="champError"></span>
                </div>
            </div>
        </div>
        
        <button class="border-2 rounded-md border-rose-600 bg-rose-500 px-[10px] py-[5px] hover:border-purple-600 hover:bg-purple-500" type="submit">Connexion</button>
    </form>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex'
import { useToast } from "vue-toastification";
export default {
    data() {
        return {
            email: '',
            password: '',
            champError: '',
            isValidEmail: false,
            isValidPassword: false,
        }
    },
    setup() {
      // Get toast interface
      const toast = useToast();
      return { toast }
    },
    computed: {
    ...mapState(['user'])
    },
    methods: {
        // Valider le formulaire de connexion
        validateForm() {
            let isValid = false
            this.isValidEmail = false
            this.champError = ''

            // Vérifier l'e-mail
            if (!this.email) {
                this.isValidEmail = false
                this.champError += 'Veuillez entrer votre courriel<br/>'
                
            } else if (!this.email.includes('@')) {
                this.isValidEmail = false
                this.champError += 'Veuillez entrer un courriel valide<br/>'
            } else {
                this.isValidEmail = true
            }

            // Vérifier le mot de passe
            if (!this.password) {
                this.isValidPassword = false
                this.champError += 'Veuillez entrer votre mot de passe<br/>'
            } else {
                this.isValidPassword = true
            }

            // Vérifier la validité de l'e-mail et du mot de passe
            if (this.isValidEmail && this.isValidPassword) {
                isValid = true
            }

            return isValid
        },
        // Soumettre le formulaire de connexion
        async submitLogin() {
            if(this.validateForm()) {
                axios.post('https://gare-no-ticket-iota.vercel.app/auth/login', {
                    email: this.email,
                    password: this.password
                })
                .then(async response => {
                    const token = response.data.token;
                    localStorage.setItem('jwt', token);
                    await this.$store.dispatch('loginUser', token);
                    this.toast.success("Vous êtes connecté.", {
                        timeout: 2000,
                    });
                    if(this.user.isValet){
                        this.$router.push({ name: "Valet" });
                    }
                    else{
                        this.$router.push({ name: "Home" });
                    }
                   
                })
                .catch(error => {
                    if (error.response) {
                        if (error.response.data.message) {
                            this.toast.error(error.response.data.message);
                            this.password = "";
                            
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
