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
                    <span v-if="champErrorUser" class="error" v-html="champErrorUser"></span>
                </div>
                <div v-if="user.isValet" class="flex-form">
                    <label for="prix">Prix:</label>
                    <input
                        type="number"
                        min="0"
                        v-model="user.price"
                        @input="detectChangeInfoUser"
                    />
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
    <SecondTitle v-if="!user.isValet" :title="'Informations de votre Voiture'" />
    <section v-if="!user.isValet">
        <div class="flex flex-col items-center text-2xl text-white m-2">
            <div
                v-if="user.voiture"
                class="bg-rose-600 text-center py-[20px] px-[25px] info-perso-div"
            >
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
                    <span v-if="champErrorCar" class="error" v-html="champErrorCar"></span>
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
            <div v-else class="bg-rose-600 text-center py-[20px] px-[25px] info-perso-div">
                <div class="flex-form">
                    <label for="marque">Marque:</label>
                    <input type="text" v-model="marqueNull" @input="detectChangeInfoVoiture" />
                </div>
                <div class="flex-form">
                    <label for="modele">Modèle:</label>
                    <input type="text" v-model="modeleNull" @input="detectChangeInfoVoiture" />
                </div>
                <div class="flex-form">
                    <label for="couleur">Couleur:</label>
                    <input type="text" v-model="couleurNull" @input="detectChangeInfoVoiture" />
                </div>
                <div class="flex-form">
                    <label for="plaque">Plaque:</label>
                    <input type="text" v-model="plaqueNull" @input="detectChangeInfoVoiture" />
                    <span v-if="champErrorCar" class="error" v-html="champErrorCar"></span>
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
    <section v-if="user.voiture">
        <div v-if="voiture.isParked == false && voiture.isMoving == false" class="flex items-center justify-center flex-col div-btn-delete text-2xl text-white">
            <div class="w-full">
                <button
                    @click="confirmationDelete"
                    class="btn-info-user border-2 rounded-md border-purple-600 bg-purple-500 hover:border-indigo-600 hover:bg-indigo-500 px-[10px] py-[5px]"
                >
                    Supprimer votre Compte
                </button>
            </div>
            <div class="w-full" v-if="isConfirmDelete">
                <button
                    @click="deleteUser"
                    class="btn-info-user border-2 rounded-md border-purple-600 bg-purple-500 hover:border-indigo-600 hover:bg-indigo-500 px-[10px] py-[5px]"
                >
                    Confirmermation de la Suppression
                </button>
            </div>
        </div>
    </section>
    <section v-else>
        <div class="flex items-center justify-center flex-col div-btn-delete text-2xl text-white">
            <div class="w-full">
                <button
                    @click="confirmationDelete"
                    class="btn-info-user border-2 rounded-md border-purple-600 bg-purple-500 hover:border-indigo-600 hover:bg-indigo-500 px-[10px] py-[5px]"
                >
                    Supprimer votre Compte
                </button>
            </div>
            <div class="w-full" v-if="isConfirmDelete">
                <button
                    @click="deleteUser"
                    class="btn-info-user border-2 rounded-md border-purple-600 bg-purple-500 hover:border-indigo-600 hover:bg-indigo-500 px-[10px] py-[5px]"
                >
                    Confirmermation de la Suppression
                </button>
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
            isValidPrice: false,
            champErrorUser: '',
            champErrorCar: '',
            isValidMarque: false,
            isValidModele: false,
            isValidCouleur: false,
            isValidPlaque: false,
            marqueNull: '',
            modeleNull: '',
            couleurNull: '',
            plaqueNull: '',
            isConfirmDelete: false
        }
    },
    methods: {
        // Détecter les changements dans les informations de l'utilisateur
        detectChangeInfoUser() {
            this.isChangedUser = false
        },
        // Détecter les changements dans les informations de la voiture
        detectChangeInfoVoiture() {
            this.isChangedVoiture = false
        },
        // Valider le formulaire de l'utilisateur
        vaildateUserForm() {
            let isValid = false
            this.isValidUsername = false
            this.isValidEmail = false
            this.isValidPrice = false
            this.champErrorUser = ''
            let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

            // Vérifier le nom
            if (!this.user.username) {
                this.isValidUsername = false
                this.champErrorUser += 'Veuillez entrer votre nom<br/>'
            } else if (this.user.username.length < 3 || this.user.username.length > 50) {
                this.isValidUsername = false
                this.champErrorUser += 'Veuillez entrer un nom entre 3 et 50 caractères<br/>'
            } else {
                this.isValidUsername = true
            }
            // Vérifier le prix
            if (this.user.isValet) {
                if (!this.user.price) {
                    this.isValidPrice = false
                    this.champErrorUser += 'Veuillez entrer votre prix<br/>'
                } else if (this.user.price < 0) {
                    this.isValidPrice = false
                    this.champErrorUser += 'Veuillez entrer un prix supérieur<br/>'
                } else {
                    this.isValidPrice = true
                }
            }
            // Vérifier le courriel
            if (!this.user.email) {
                this.isValidEmail = false
                this.champErrorUser += 'Veuillez entrer votre courriel<br/>'
            } else if (!regex.test(this.user.email)) {
                this.isValidEmail = false
                this.champErrorUser += 'Veuillez entrer un courriel valide<br/>'
            } else {
                this.isValidEmail = true
            }
            if (this.user.isValet) {
                if (this.isValidUsername && this.isValidEmail && this.isValidPrice) {
                    isValid = true
                }
            } else {
                if (this.isValidUsername && this.isValidEmail) {
                    isValid = true
                }
            }

            return isValid
        },
        // Mettre à jour les informations de l'utilisateur
        async updateUser() {
            let id_user = this.user.userId
            if (id_user == null) {
                id_user = this.user._id
            }
            if (this.vaildateUserForm()) {
                if (!this.user.isValet && this.user.voiture != null) {
                    if (this.voiture.isParked == false && this.voiture.isMoving == false)
                        try {
                            localStorage.removeItem('jwt')

                            const response = await axios.put(
                                `https://gare-no-ticket-iota.vercel.app/auth/profil-update/${id_user}`,
                                {
                                    username: this.user.username,
                                    email: this.user.email,
                                    price: this.user.price,
                                    userChange: true,
                                    carChange: false,
                                    marque: this.voiture.marque,
                                    modele: this.voiture.modele,
                                    couleur: this.voiture.couleur,
                                    plaque: this.voiture.plaque
                                }
                            )
                            localStorage.setItem('jwt', response.data.token)
                            this.$store.commit('updateVoiture', response.data.voiture)
                            this.$store.commit('updateUser', response.data.user)
                            this.toast.success('Votre profil a été mis à jour')
                        } catch (error) {
                            if (error.response) {
                                if (error.response.data.message) {
                                    this.toast.error(error.response.data.message)
                                }
                            }
                            console.log(error)
                            this.toast.error('Une erreur est survenue')
                        }
                    else {
                        this.toast.error(
                            'Vous ne pouvez pas modifier votre profil lorsque votre voiture est en mouvement ou stationnée'
                        )
                    }
                } else {
                    try {
                        localStorage.removeItem('jwt')
                        const response = await axios.put(
                            `https://gare-no-ticket-iota.vercel.app/auth/profil-valet-update/${id_user}`,
                            {
                                username: this.user.username,
                                email: this.user.email,
                                price: this.user.price
                            }
                        )
                        localStorage.setItem('jwt', response.data.token)
                        this.$store.commit('updateVoiture', null)
                        this.$store.commit('updateUser', response.data.user)
                        this.toast.success('Votre profil a été mis à jour')
                    } catch (error) {
                        if (error.response) {
                            if (error.response.data.message) {
                                this.toast.error(error.response.data.message)
                            }
                        }
                        console.log(error)
                        this.toast.error('Une erreur est survenue')
                    }
                }
            }
        },
        // Valider le formulaire de la voiture
        validateCarInfo() {
            let isValid = false
            this.isValidMarque = false
            this.isValidModele = false
            this.isValidCouleur = false
            this.isValidPlaque = false
            this.champErrorCar = ''

            
            if (this.user.voiture != null) {
                // Vérifier la marque
                if (!this.voiture.marque) {
                    this.isValidMarque = false
                    this.champErrorCar += 'Veuillez entrer la marque de votre voiture<br/>'
                } else if (this.voiture.marque.length < 1 || this.voiture.marque.length > 50) {
                    this.isValidMarque = false
                    this.champErrorCar += 'Veuillez entrer une marque entre 1 et 50 caractères<br/>'
                } else {
                    this.isValidMarque = true
                }
                // Vérifier le modèle
                if (!this.voiture.modele) {
                    this.isValidModele = false
                    this.champErrorCar += 'Veuillez entrer le modèle de votre voiture<br/>'
                } else if (this.voiture.modele.length < 1 || this.voiture.modele.length > 50) {
                    this.isValidModele = false
                    this.champErrorCar += 'Veuillez entrer un modèle entre 1 et 50 caractères<br/>'
                } else {
                    this.isValidModele = true
                }
                // Vérifier la couleur
                if (!this.voiture.couleur) {
                    this.isValidCouleur = false
                    this.champErrorCar += 'Veuillez entrer la couleur de votre voiture<br/>'
                } else if (this.voiture.couleur.length < 3 || this.voiture.couleur.length > 50) {
                    this.isValidCouleur = false
                    this.champErrorCar +=
                        'Veuillez entrer une couleur entre 1 et 50 caractères<br/>'
                } else {
                    this.isValidCouleur = true
                }
                // Vérifier la plaque
                if (!this.voiture.plaque) {
                    this.isValidPlaque = false
                    this.champErrorCar += 'Veuillez entrer la plaque de votre voiture<br/>'
                } else if (this.voiture.plaque.length != 6) {
                    this.isValidPlaque = false
                    this.champErrorCar += 'Veuillez entrer une plaque de 6 caractères<br/>'
                } else {
                    this.isValidPlaque = true
                }

                if (
                    this.isValidMarque &&
                    this.isValidModele &&
                    this.isValidCouleur &&
                    this.isValidPlaque
                ) {
                    isValid = true
                }

                return isValid
            } else {
                // Vérifier la marque
                if (!this.marqueNull) {
                    this.isValidMarque = false
                    this.champErrorCar += 'Veuillez entrer la marque de votre voiture<br/>'
                } else if (this.marqueNull.length < 1 || this.marqueNull.length > 50) {
                    this.isValidMarque = false
                    this.champErrorCar += 'Veuillez entrer une marque entre 1 et 50 caractères<br/>'
                } else {
                    this.isValidMarque = true
                }
                // Vérifier le modèle
                if (!this.modeleNull) {
                    this.isValidModele = false
                    this.champErrorCar += 'Veuillez entrer le modèle de votre voiture<br/>'
                } else if (this.modeleNull.length < 1 || this.modeleNull.length > 50) {
                    this.isValidModele = false
                    this.champErrorCar += 'Veuillez entrer un modèle entre 1 et 50 caractères<br/>'
                } else {
                    this.isValidModele = true
                }
                // Vérifier la couleur
                if (!this.couleurNull) {
                    this.isValidCouleur = false
                    this.champErrorCar += 'Veuillez entrer la couleur de votre voiture<br/>'
                } else if (this.couleurNull.length < 3 || this.couleurNull.length > 50) {
                    this.isValidCouleur = false
                    this.champErrorCar +=
                        'Veuillez entrer une couleur entre 1 et 50 caractères<br/>'
                } else {
                    this.isValidCouleur = true
                }
                // Vérifier la plaque
                if (!this.plaqueNull) {
                    this.isValidPlaque = false
                    this.champErrorCar += 'Veuillez entrer la plaque de votre voiture<br/>'
                } else if (this.plaqueNull.length != 6) {
                    this.isValidPlaque = false
                    this.champErrorCar += 'Veuillez entrer une plaque de 6 caractères<br/>'
                } else {
                    this.isValidPlaque = true
                }

                if (
                    this.isValidMarque &&
                    this.isValidModele &&
                    this.isValidCouleur &&
                    this.isValidPlaque
                ) {
                    isValid = true
                }

                return isValid
            }
        },
        // Mettre à jour les informations de la voiture
        async updateVoiture() {
            let id_user = this.user.userId
            if (id_user == null) {
                id_user = this.user._id
            }
            if (this.validateCarInfo()) {
                if (this.user.voiture != null) {
                    if (this.voiture.isParked == false && this.voiture.isMoving == false) {
                        try {
                            localStorage.removeItem('jwt')
                            if (this.user.voiture != null) {
                                const response = await axios.put(
                                    `https://gare-no-ticket-iota.vercel.app/auth/profil-update/${id_user}`,
                                    {
                                        username: this.user.username,
                                        email: this.user.email,
                                        userChange: false,
                                        carChange: true,
                                        marque: this.voiture.marque,
                                        modele: this.voiture.modele,
                                        couleur: this.voiture.couleur,
                                        plaque: this.voiture.plaque
                                    }
                                )
                                localStorage.setItem('jwt', response.data.token)
                                this.$store.commit('updateVoiture', response.data.voiture)
                                this.$store.commit('updateUser', response.data.user)
                                this.toast.success('Votre voiture a été mise à jour')
                            } else {
                                const response = await axios.put(
                                    `https://gare-no-ticket-iota.vercel.app/auth/profil-update/${id_user}`,
                                    {
                                        username: this.user.username,
                                        email: this.user.email,
                                        userChange: false,
                                        carChange: true,
                                        marque: this.marqueNull,
                                        modele: this.modeleNull,
                                        couleur: this.couleurNull,
                                        plaque: this.plaqueNull
                                    }
                                )
                                localStorage.setItem('jwt', response.data.token)
                                this.$store.commit('updateVoiture', response.data.voiture)
                                this.$store.commit('updateUser', response.data.user)
                                this.toast.success('Votre voiture a été mise à jour')
                            }
                        } catch (error) {
                            if (error.response) {
                                if (error.response.data.message) {
                                    this.toast.error(error.response.data.message)
                                }
                            }
                            console.log(error)
                            this.toast.error('Une erreur est survenue')
                        }
                    } else {
                        this.toast.error(
                            'Vous ne pouvez pas modifier votre profil lorsque votre voiture est en mouvement ou stationnée'
                        )
                    }
                } else {
                    try {
                        localStorage.removeItem('jwt')
                        if (this.user.voiture != null) {
                            const response = await axios.put(
                                `https://gare-no-ticket-iota.vercel.app/auth/profil-update/${id_user}`,
                                {
                                    username: this.user.username,
                                    email: this.user.email,
                                    userChange: false,
                                    carChange: true,
                                    marque: this.voiture.marque,
                                    modele: this.voiture.modele,
                                    couleur: this.voiture.couleur,
                                    plaque: this.voiture.plaque
                                }
                            )
                            localStorage.setItem('jwt', response.data.token)
                            this.$store.commit('updateVoiture', response.data.voiture)
                            this.$store.commit('updateUser', response.data.user)
                            this.toast.success('Votre voiture a été mise à jour')
                        } else {
                            const response = await axios.put(
                                `https://gare-no-ticket-iota.vercel.app/auth/profil-update/${id_user}`,
                                {
                                    username: this.user.username,
                                    email: this.user.email,
                                    userChange: false,
                                    carChange: true,
                                    marque: this.marqueNull,
                                    modele: this.modeleNull,
                                    couleur: this.couleurNull,
                                    plaque: this.plaqueNull
                                }
                            )
                            localStorage.setItem('jwt', response.data.token)
                            this.$store.commit('updateVoiture', response.data.voiture)
                            this.$store.commit('updateUser', response.data.user)
                            this.toast.success('Votre voiture a été mise à jour')
                        }
                    } catch (error) {
                        if (error.response) {
                            if (error.response.data.message) {
                                this.toast.error(error.response.data.message)
                            }
                        }
                        console.log(error)
                        this.toast.error('Une erreur est survenue')
                    }
                }
            }
        },
        // Confirmation de la suppression du compte
        confirmationDelete() {
            this.isConfirmDelete = true
            this.toast.warning('Etês-vous sûr de vouloir supprimer votre compte?')
        },
        // Supprimer le compte
        async deleteUser() {
            try {
                let token = localStorage.getItem('jwt')
                await axios.delete(`https://gare-no-ticket-iota.vercel.app/user/`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                localStorage.removeItem('jwt')
                this.$store.dispatch('logoutUser')
                this.toast.success('Votre compte a été supprimé')
                this.$router.push({ name: 'Login' })
            } catch (error) {
                if (error.response) {
                    if (error.response.data.message) {
                        this.toast.error(error.response.data.message)
                    }
                }
                console.log(error)
                this.toast.error('Une erreur est survenue')
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

.div-btn-delete {
    width: 30%;
    margin: 0 auto;
    margin-bottom: 20px;
}
</style>
