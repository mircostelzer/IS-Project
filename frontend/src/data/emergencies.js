import { ref } from 'vue'

const apiEmergencies = import.meta.env.VITE_API_BASE_URL + "/emergencies/"

export const emergency = ref([])
export const emergencies = ref([])
export const emergenciesInProgress = ref([])

// Funzione per recuperare l'id delle emergenze
function recuperaId(self) {
    return self.substring(self.lastIndexOf('/') + 1)
}

// Funzione per formattare la data delle emergenze
function formattaData(date) {
    return new Date(date).toLocaleString('it-IT', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

export function getEmergencyById(id) {
    fetch(apiEmergencies + id)
        .then((response) => response.json())
        .then((data) => {
            emergency.value = {
                ...data,
                startDate: formattaData(data.startDate),
                id: recuperaId(data.self)
            };
        })
        .catch((error) => {
            console.error("Errore da getEmergencyById(" + id + "): ", error)
            emergency.value = null
        });
}

export function getEmergencies() {
    fetch(apiEmergencies)
        .then((response) => response.json())
        .then((data) => {
            emergencies.value = data.map((data) => {
                return {
                    ...data,
                    startDate: formattaData(data.startDate),
                    id: recuperaId(data.self)
                };
            });
        })
        .catch((error) => {
            console.error("Errore da getEmergencies(): ", error)
            emergencies.value = null
        });
}

export function getEmergenciesInProgress() {
    fetch(apiEmergencies + "/?state=in_progress")
        .then((response) => response.json())
        .then((data) => {
            emergenciesInProgress.value = data.map((data) => {
                return {
                    ...data,
                    startDate: formattaData(data.startDate),
                    id: recuperaId(data.self)
                };
            });
        })
        .catch((error) => {
            console.error("Errore da getEmergenciesInProgress(): ", error)
            emergenciesInProgress.value = null
        });
}
