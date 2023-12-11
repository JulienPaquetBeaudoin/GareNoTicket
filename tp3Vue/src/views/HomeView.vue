<template>
    <main-title :title="'Accueil'"/>
    <div id="mapContainer">
        <div class="floating-button">
            <button
                class="border-2 rounded-md border-rose-500 bg-rose-400 px-[10px] py-[5px] hover:border-purple-500 hover:bg-purple-400"
                @click="centerMapOnMarker"
            >
                Centrer sur le marqueur
            </button>
        </div>
    </div>
    <div class="flex justify-center div-btn-place" v-if="!isMoving">
        <button
            v-bind:disabled="isDisabled"
            class="border-2 rounded-md border-rose-600 bg-rose-500 px-[10px] py-[12px] hover:border-purple-600 hover:bg-purple-500"
            @click="laisserVoiture" 
        >
            Je laisse ma voiture
        </button>
        <button
            v-bind:disabled="isDisabled"
            class="border-2 rounded-md border-rose-600 bg-rose-500 px-[10px] py-[12px] hover:border-purple-600 hover:bg-purple-500"
            @click="confirmation" 
        >
            Je confirme
        </button>
        <button
            v-bind:disabled="isDisabledRecup"
            class="border-2 rounded-md border-rose-600 bg-rose-500 px-[10px] py-[12px] hover:border-purple-600 hover:bg-purple-500"
            @click="recupererVoiture"
        >
            J'ai récupéré ma voiture
        </button>
    </div>
    <div v-else>
        <div class="flex flex-col items-center text-2xl text-white m-2">
            <div class="bg-rose-600 text-center py-[5px] px-[10px]">
                <p>Votre voiture est en cours de déplacement par un valet.</p>
                <p>Voici votre emplacement.</p>
            </div>
        </div>
        
    </div>
</template>

<script>
import MainTitle from '../components/MainTitle.vue'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { mapState } from 'vuex'
import { useToast } from "vue-toastification";
import axios from 'axios'
export default {
    data() {
        return {
            map: null,
            latitude: 0,
            longitude: 0,
            marker: null,
            isDisabled: false,
            isDisabledRecup: true,
            isMoving: false,
        }
    },
    setup() {
      // Get toast interface
      const toast = useToast();
      return { toast }
    },
    components: {
        MainTitle,
    },
    computed: {
        ...mapState(['user', 'voiture']),
    },
    methods: {
        initMap() {
            this.map = L.map('mapContainer').setView([this.latitude, this.longitude], 16)
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution:
                    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.map)
        },
        findUserLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        let latitude, longitude
                        console.log('user:', this.user)
                        console.log('voiture:', this.voiture)
                        if(this.user == null) {
                            console.log('user null')
                            this.$router.push({ name: 'Login' })
                        }
                        else if (this.user.price >= 20){
                            this.toast.warning("Vous avez dépassé le montant de 20$, vous ne pouvez plus garer votre voiture.");
                            this.isDisabled = true
                            this.isDisabledRecup = false
                        }
                        else{
                            if(this.voiture.isParked) {
                                console.log('voiture true')
                                latitude = this.voiture.latitude
                                longitude = this.voiture.longitude
                                this.isDisabled = true
                                this.isDisabledRecup = false
                            }   
                            else {
                                if(this.voiture.isMoving)
                                {
                                    console.log('voiture moving')
                                    latitude = position.coords.latitude
                                    longitude = position.coords.longitude
                                    this.isDisabled = true
                                    this.isDisabledRecup = true
                                    this.isMoving = true
                                }
                                else{
                                    console.log('voiture false')
                                    latitude = position.coords.latitude
                                    longitude = position.coords.longitude
                                    this.isDisabled = false
                                    this.isDisabledRecup = true
                                }
                            }
                        }
                        
                        this.latitude = latitude
                        this.longitude = longitude
                        
                        this.map.setView([latitude, longitude], 13)
                        this.marker = L.marker([latitude, longitude], { draggable: true }).addTo(
                            this.map
                        )

                    },
                    (error) => {
                        console.error('erreur:', error)
                        if (error.code == error.PERMISSION_DENIED) {
                            alert(
                                'Vous devez autoriser la géolocalisation pour utiliser cette fonctionnalité.'
                            )
                        }
                    }
                )
            } else {
                this.toast.error("La géolocalisation n'est pas supportée par votre navigateur.")
            }
        },
        laisserVoiture() {
            this.marker.dragging.disable()
            const position = this.marker.getLatLng()
            this.latitude = position.lat
            this.longitude = position.lng
            this.toast.info("Veuillez vérifier que votre voiture est bien stationnée à l'endroit indiqué sur la carte, ou déplacer lemarqueur sur la position de votre voiture.",{
                timeout: 7000,
            });

        },
        async confirmation() {
            try {
                this.isDisabled = true
                this.isDisabledRecup = false
                const response = await axios.put(`http://localhost:3000/car/location/${this.user.voiture}`, {
                    latitude: this.latitude,
                    longitude: this.longitude
                })
                this.$store.commit('updateVoiture', response.data.voiture);
                this.toast.success("Votre voiture est garée.",{
                    timeout: 3000,
                });
            } catch (error) {
                console.error('Erreur axios:', error)
            }
        },
        async recupererVoiture() {
            try{
                this.marker.dragging.enable()
                this.isDisabled = false
                this.isDisabledRecup = true
                const response = await axios.put(`http://localhost:3000/car/recup-car/${this.user.voiture}`)
                this.$store.commit('updateVoiture', response.data.voiture);
                this.toast.success("Vous avez récupéré votre voiture!",{
                    timeout: 1500,
                });
            }
            catch (error) {
                console.error('Erreur axios:', error)
            } 
        },
        centerMapOnMarker() {
            if (this.marker) {
                this.map.setView(this.marker.getLatLng(), 13);
            }
        },
    },
    async mounted() {
        this.$store.dispatch('getUser')
        this.initMap()
        this.findUserLocation()
    },
    
}  
</script>

<style scoped>
#mapContainer {
    height: 500px;
    width: 80%;
    margin: 15px auto;
}
.div-btn-place {
    width: 80%;
    margin: 15px auto;
    
}

button {
    width: 100%;
    font-weight: bold;
}

button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    color: black;
    font-weight: bold;
    background-color: #929292;
    border-color: #777777;
    
}

.floating-button {
    position: absolute;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
}
</style>
