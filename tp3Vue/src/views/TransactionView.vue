<template>
    <MainTitle :title="'Transaction'" />
    <section>
        <div class="flex border-2 border-rose-600 bg-rose-400 div-payer-facture items-center justify-around text-white">
            <p class="border-2 rounded-md border-purple-600 bg-purple-500 py-[5px] px-[20px]">Votre Facture: {{ this.montantAPayer }}$</p>
            <button
                class="border-2 rounded-md border-purple-600 bg-purple-500  hover:border-indigo-600 hover:bg-indigo-500 px-[10px] py-[5px]"
                @click="payerFacture"
            >
                Payer
            </button>
        </div>
    </section>
    <section>
        <div>
            <SecondTitle :title="'Historique des Transactions'" />
            <table
                class="table-facture border-2 border-rose-600 bg-rose-400 border-collapse my-[15px] text-white"
            >
                <thead>
                    <tr>
                        <th class="border border-rose-600">Date</th>
                        <th class="border border-rose-600">Montant</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(facture, index) in factures" :key="index">
                        <td class="border border-rose-600">
                            {{ new Date(facture.createdAt).toLocaleString() }}
                        </td>
                        <td class="border border-rose-600">{{ facture.price }}$</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
    <section>
        <div>
            <SecondTitle :title="'Historique des Factures'" />
            <table
                class="table-facture border-2 border-rose-600 bg-rose-400 border-collapse my-[15px] text-white"
            >
                <thead>
                    <tr>
                        <th class="border border-rose-600">Date</th>
                        <th class="border border-rose-600">Montant</th>
                        <th class="border border-rose-600">Statut</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(facture, index) in historique" :key="index">
                        <td class="border border-rose-600">
                            {{ new Date(facture.createdAt).toLocaleDateString() }}
                        </td>
                        <td class="border border-rose-600">{{ facture.price }}$</td>
                        <td class="border border-rose-600">
                            <span v-if="facture.isPaid" class="paye">Payé</span>
                            <span v-else class="non-paye">Non Payé</span>
                        </td>
                    </tr>
                </tbody>
            </table>
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
            montantAPayer: 0,
            token: localStorage.getItem('jwt'),
            factures: {},
            historique: {},
            histoIds: [],
        }
    },
    setup() {
        // Get toast interface
        const toast = useToast();
        return { toast };
    },
    methods: {
        async getFactureUser() {
            try {
                const response = await axios.get('http://localhost:3000/facture', {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                })
                this.factures = response.data.factures
            } catch (error) {
                console.log(error)
            }
        },
        calculerMontantAPayer() {
            this.montantAPayer = Object.values(this.historique).reduce((total, facture) => {
                return facture.isPaid ? total : total + facture.price;
            }, 0);
        },
        async getHistoriqueFacture() {
            try {
                const response = await axios.get('http://localhost:3000/historique', {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                })
                this.historique = response.data.histo                
            } catch (error) {
                console.log(error)
            }
        },
        async payerFacture() {
            try {
                const reponse =await axios.put('http://localhost:3000/effectuerPaiement', {
                    price: this.montantAPayer
                }, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                })
                this.getFactureUser()
                this.getHistoriqueFacture().then(() => {
                    this.calculerMontantAPayer()
                })   
                this.toast.success(`${reponse.data.message}`), {
                    timeout: 2000
                };
            } catch (error) {
                console.log(error)
            }
        }
    
    },
    computed: {
        ...mapState(['user', 'voiture'])
    },
    mounted() {
        this.getFactureUser()
        this.getHistoriqueFacture().then(() => {
            this.calculerMontantAPayer()
        })
        this.$store.dispatch('getUser')
    },
    components: { MainTitle, SecondTitle }
}
</script>

<style scoped>
.table-facture {
    width: 80%;
    margin: 15px auto;
    font-size: 1.2rem;
    font-weight: 500;
}

td {
    padding: 8px;
}

th {
    padding: 10px 8px 10px 8px;
}

.div-payer-facture {
    width: 80%;
    margin: 15px auto;
    padding: 15px;
    font-size: 1.2rem;
}

.non-paye {
    color: #881337;
}

.paye {
    color: rgb(51, 240, 70)
}
</style>