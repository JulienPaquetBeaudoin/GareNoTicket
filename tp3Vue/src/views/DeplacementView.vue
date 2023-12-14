<template>
    <MainTitle :title="'Déplacer une Voiture'"></MainTitle>
    <div id="mapContainer">
        <div class="floating-button">
            <button
                class="border-2 rounded-md border-rose-500 bg-rose-400 px-[10px] py-[5px] mb-1 hover:border-purple-500 hover:bg-purple-400"
                @click="centerMapOnMarkerValet"
            >
                Centrer sur vous
            </button>
            <button
                class="border-2 rounded-md border-rose-500 bg-rose-400 px-[10px] py-[5px] hover:border-purple-500 hover:bg-purple-400"
                @click="centerMapOnMarkerVoiture"
            >
                Centrer sur la voiture
            </button>
        </div>
    </div>
    <div class="div-btn-deplacement flex">
        <button
            v-bind:disabled="moveIsDisabled"
            class="border-2 rounded-md border-rose-500 bg-rose-400 px-[10px] py-[5px] hover:border-purple-500 hover:bg-purple-400"
            @click="moveCar"
        >
            Déplacer la voiture
        </button>
        <button
            v-bind:disabled="confirmationIsDisabled"
            class="border-2 rounded-md border-rose-500 bg-rose-400 px-[10px] py-[5px] hover:border-purple-500 hover:bg-purple-400"
            @click="confirmation"
        >
            Validation du stationnement
        </button>
    </div>
    <div class="redirect-button flex">
        <button
            v-if="showRedirectButton"
            @click="retournerVersValet"
            class="border-2 rounded-md border-rose-500 bg-rose-400 px-[10px] py-[5px] hover:border-purple-500 hover:bg-purple-400"
        >
            Retourner vers Valet
        </button>
    </div>
    
</template>

<script>
import MainTitle from '../components/MainTitle.vue'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import axios from 'axios'
import { useToast } from 'vue-toastification'
import { mapState } from 'vuex'
export default {
    // Les propriétés de l'application
    data() {
        return {
            map: null,
            latitude: 0,
            longitude: 0,
            markerValet: null,
            markerCar: null,
            idCar: null,
            idUser: null,
            car: null,
            moveIsDisabled: false,
            confirmationIsDisabled: true,
            showRedirectButton: false
        };
    },
    setup() {
        // Get toast interface
        const toast = useToast();
        return { toast };
    },
    computed: {
        ...mapState(['user']),
    },
    // Les méthodes de l'application
    methods: {
        // Initialisation de la carte
        initMap() {
            this.map = L.map('mapContainer').setView([this.latitude, this.longitude], 16);
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(this.map);
        },
        // Trouver la position de l'utilisateur
        findUserLocation() {
            // Définition de l'icône rouge
            var redIcon = new L.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });
            // Vérification de la géolocalisation
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const { latitude, longitude } = position.coords;
                    this.latitude = latitude;
                    this.longitude = longitude;
                    this.map.setView([latitude, longitude], 13);
                    // Ajout du marqueur du valet à la carte
                    this.markerValet = L.marker([latitude, longitude], {
                        icon: redIcon,
                        draggable: false
                    }).addTo(this.map);
                }, (error) => {
                    console.error('erreur:', error);
                    if (error.code == error.PERMISSION_DENIED) {
                        alert('Vous devez autoriser la géolocalisation pour utiliser cette fonctionnalité.');
                    }
                });
            }
            else {
                console.error("La géolocalisation n'est pas supportée par votre navigateur.");
            }
        },
        // Trouver la voiture garée
        async getVoitureParked() {
            try {
                const response = await axios.get(`https://gare-no-ticket-iota.vercel.app/car/${this.idCar}`);
                this.car = response.data.voiture;
                // Ajout du marqueur de la voiture à la carte
                this.markerCar = L.marker([response.data.voiture.latitude, response.data.voiture.longitude], {
                    draggable: false
                }).addTo(this.map);
            }
            catch (error) {
                console.error(error);
            }
        },
        // Déplacer la voiture
        async moveCar() {
            try {
                this.markerValet.dragging.enable();
                this.markerCar.remove();
                this.moveIsDisabled = true;
                this.confirmationIsDisabled = false;
                const response = await axios.put(`https://gare-no-ticket-iota.vercel.app/car/move/${this.idCar}`);
                this.car = response.data.voiture;
                this.toast.info(`${response.data.message}`, {
                    timeout: 2000
                });
            }
            catch (error) {
                console.error(error);
            }
        },
        // Confirmer le déplacement de la voiture
        async confirmation() {
            try {
                const token = localStorage.getItem('jwt');
                const position = this.markerValet.getLatLng();
                // Mettre à jour la position de la voiture
                await axios.put(`https://gare-no-ticket-iota.vercel.app/car/location/${this.idCar}`, {
                    latitude: position.lat,
                    longitude: position.lng
                });
                // Enregistrer le nouveau déplacement
                await axios.put(`https://gare-no-ticket-iota.vercel.app/nouveauDeplacement`, {
                    id_user: this.idUser,
                    id_valet: this.user._id,
                    prix: this.user.price
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                this.markerValet.dragging.disable();
                // Ajout du marqueur de la voiture à la nouvelle position
                this.markerCar = L.marker([position.lat, position.lng], {
                    draggable: false
                }).addTo(this.map);
                this.moveIsDisabled = true;
                this.confirmationIsDisabled = true;
                this.showRedirectButton = true;
                this.toast.success('Voiture déplacée avec succès.'), {
                    timeout: 2000
                };
            }
            catch (error) {
                console.error(error);
            }
        },
        // Centrer la carte sur le marqueur du valet
        centerMapOnMarkerValet() {
            if (this.markerValet) {
                this.map.setView(this.markerValet.getLatLng(), 13);
            }
        },
        // Centrer la carte sur le marqueur de la voiture
        centerMapOnMarkerVoiture() {
            if (this.markerCar) {
                this.map.setView(this.markerCar.getLatLng(), 13);
            }
            else {
                this.toast.info('La voiture n\'est pas encore garée.', {
                    timeout: 2000
                });
            }
        },
        // Retourner vers la page du valet
        retournerVersValet(){
            this.$router.push({ name: 'Valet' });
        }
    },
    async mounted() {
        this.$store.dispatch('getUser');
        this.initMap();
        this.getVoitureParked();
        this.findUserLocation();
    },
    created() {
        this.idCar = this.$route.params.id_voiture;
        this.idUser = this.$route.params.id_user;
    },
    components: { MainTitle }
}
</script>

<style scoped>
#mapContainer {
    height: 500px;
    width: 80%;
    margin: 15px auto;
}

button {
    width: 100%;
    font-weight: bold;
}
.div-btn-deplacement {
    width: 80%;
    margin: 15px auto;
}
.redirect-button {
    width: 80%;
    margin: 15px auto;
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
    width: 15%;
}
</style>
