<template>
    <MainTitle title="Menu Valet"/>
    <div id="mapContainer" class="flex"></div>
    <table
        class="table-auto border-2 border-rose-600 bg-rose-400 border-collapse my-[15px] text-white"
    >
        <thead>
            <tr>
                <th class="border border-rose-600">Propriétaire</th>
                <th class="border border-rose-600">Marque</th>
                <th class="border border-rose-600">Modèle</th>
                <th class="border border-rose-600">Immatriculation</th>
                <th class="border border-rose-600">Couleur</th>
                <th class="border border-rose-600">Temps Restant</th>
                <th class="border border-rose-600">Position</th>
                <th class="border border-rose-600">Déplacer cette Voiture</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="user in usersArray" :key="user.id">
                <td class="border border-rose-600">{{ user.username }}</td>
                <td class="border border-rose-600">{{ user.voiture.marque }}</td>
                <td class="border border-rose-600">{{ user.voiture.modele }}</td>
                <td class="border border-rose-600">{{ user.voiture.plaque }}</td>
                <td class="border border-rose-600">{{ user.voiture.couleur }}</td>
                <td class="border border-rose-600">
                    {{ remainingTimes[user._id] > 25200 ? 'Demain' : (remainingTimes[user._id] < 0 ? 0 : remainingTimes[user._id]) }}
                </td>
                <td class="border border-rose-600">
                    <button 
                         class="border-2 rounded-xl border-purple-600 bg-purple-500 p-[10px]"
                        @click="centerMapOnUser(user)">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="30"
                            fill="currentColor"
                            class="bi bi-geo-alt-fill"
                            viewBox="0 0 16 16"
                        >
                            <path
                                d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"
                            />
                        </svg>
                    </button>
                </td>
                <td class="border border-rose-600">
                    <button
                        class="border-2 rounded-xl border-purple-600 bg-purple-500 p-[10px]"
                        @click="navigateDeplacement(user.voiture._id, user._id)"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="30"
                            height="30"
                            fill="currentColor"
                            class="bi bi-car-front-fill"
                            viewBox="0 0 16 16"
                        >
                            <path
                                d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679c.033.161.049.325.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.807.807 0 0 0 .381-.404l.792-1.848ZM3 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2m10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2M6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2zM2.906 5.189a.51.51 0 0 0 .497.731c.91-.073 3.35-.17 4.597-.17 1.247 0 3.688.097 4.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 11.691 3H4.309a.5.5 0 0 0-.447.276L2.906 5.19Z"
                            />
                        </svg>
                    </button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
import MainTitle from '../components/MainTitle.vue'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import axios from 'axios'
export default {
    data() {
        return {
            map: null,
            latitude: 0,
            longitude: 0,
            markerValet: null,
            users: {},
            usersArray: [],
            markers: [],
            intervalId: null,
            remainingTimes: {}
        }
    },
    async mounted() {
        this.initMap()
        this.findUserLocation()
        this.getVoitureParked()
        this.updateRemainingTimes()
        this.intervalId = setInterval(() => {
            this.updateRemainingTimes()
        }, 1000)
    },
    beforeUnmount() {
        clearInterval(this.intervalId)
    },
    components: {
        MainTitle,
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
            var redIcon = new L.Icon({
                iconUrl:
                    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
                shadowUrl:
                    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords
                        this.latitude = latitude
                        this.longitude = longitude
                        this.map.setView([latitude, longitude], 13)
                        this.markerValet = L.marker([latitude, longitude], {
                            icon: redIcon,
                            draggable: true
                        }).addTo(this.map)
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
                console.error("La géolocalisation n'est pas supportée par votre navigateur.")
            }
        },
        async getVoitureParked() {
            try {
                const response = await axios.get('http://localhost:3000/users')
                this.users = response.data
                this.parkedMarker(response.data)
            } catch (error) {
                console.error(error)
            }
        },
        parkedMarker(users) {
            console.log('parkedMarker called')
            var greenIcon = new L.Icon({
                iconUrl:
                    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
                shadowUrl:
                    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })

            for (let key in users) {
                const user = users[key]
                for (let i = 0; i < user.length; i++) {
                    this.users[key] = user[i]
                    const voiture = user[i].voiture
                    const marker = L.marker([voiture.latitude, voiture.longitude], {
                        icon: greenIcon
                    }).addTo(this.map)
                    this.markers.push(marker)
                    this.usersArray.push(user[i])
                }
            }
        },
        updateRemainingTimes() {
            this.usersArray.forEach((user) => {
                this.tempsRestant(user)
            })
        },
        tempsRestant(user) {
            const dateFuture = new Date(user.voiture.timeToLeave)
            const dateNow = new Date()
            this.remainingTimes[user._id] = Math.round(
                (dateFuture.getTime() - dateNow.getTime()) / 1000
            )
        },
        centerMapOnUser(user) {
            if (user && user.voiture) {
                this.map.setView(
                    [user.voiture.latitude, user.voiture.longitude],
                    16
                )
                L.popup({ offset: L.point(0, -30) })
                    .setLatLng([user.voiture.latitude, user.voiture.longitude])
                    .setContent("Vous avez sélectionné cette voiture!")
                    .openOn(this.map);
            }
        },
        navigateDeplacement(idVoiture, idUser) {
            this.$router.push({ name: 'Deplacement', params: { id_voiture: idVoiture, id_user: idUser } })
        }
    }
}
</script>

<style scoped>
#mapContainer {
    height: 500px;
    width: 80%;
    margin: 15px auto;
}


table {
    width: 90%;
    margin: 15px auto;
    text-align: center;
}
td {
    padding: 8px;
}

th {
    padding: 10px 8px 10px 8px;
}
</style>
