import { loggedUser } from "@/states/loggedUser";
import { updateAlgoliaRecords } from "./algolia";
import { ref } from "vue";

const apiEmergencies = import.meta.env.VITE_API_BASE_URL + "/emergencies/";

export const emergency = ref([]);
export const emergencies = ref([]);
export const emergenciesInProgress = ref([]);

// Funzione per recuperare l'id delle emergenze
function recuperaId(self) {
    return self.substring(self.lastIndexOf("/") + 1);
}

// Funzione per formattare la data delle emergenze
function formattaData(date) {
    return new Date(date).toLocaleString("it-IT", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
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
                    id: recuperaId(data.self),
                };
            });
        })
        .catch((error) => {
            console.error("Errore da getEmergencies(): ", error);
            emergencies.value = null;
        });
}

export function getEmergencyById(id) {
    fetch(apiEmergencies + id)
        .then((response) => response.json())
        .then((data) => {
            emergency.value = {
                ...data,
                startDate: formattaData(data.startDate),
                id: recuperaId(data.self),
            };
        })
        .catch((error) => {
            console.error("Errore da getEmergencyById(" + id + "): ", error);
            emergency.value = null;
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
                    id: recuperaId(data.self),
                };
            });
        })
        .catch((error) => {
            console.error("Errore da getEmergenciesInProgress(): ", error);
            emergenciesInProgress.value = null;
        });
}

export function createEmergency(data) {
    fetch(apiEmergencies, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loggedUser.token}`,
        },
        body: JSON.stringify(data),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Errore generico da createEmergency()");
            }
            if (response.status === 204) {
                return null;
            }
            return response.json();
        })
        .then((newEmergency) => {
            emergencies.value.push(newEmergency);
        })
        .catch((error) => {
            console.error("Errore da createEmergency(): ", error);
        });
}

// export function updateEmergency(data) {}

export function deleteEmergencyById(id) {
    fetch(apiEmergencies + id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loggedUser.token}`,
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(
                    "Errore generico da deletemergencyById(" + id + ")"
                );
            }
            if (response.status === 204) {
                return null;
            }
            return response.json();
        })
        .then(() => {
            emergencies.value = emergencies.value.filter(
                (emergencies) => emergencies.id !== id
            );
        })
        .catch((error) => {
            console.error("Errore da deletemergencyById(" + id + "): ", error);
        });
}
