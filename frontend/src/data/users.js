import { loggedUser } from "@/states/loggedUser";
import { ref } from "vue";

const apiUsers = import.meta.env.VITE_API_BASE_URL + "/users/";

export const user = ref([]);
export const users = ref([]);

// Funzione per recuperare l'id degli utenti
function recuperaId(self) {
    return self.substring(self.lastIndexOf("/") + 1);
}

// Funzione per formattare la data degli utenti
function formattaData(date) {
    return new Date(date).toLocaleString("it-IT", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function getUserById(id) {
    fetch(apiUsers + id)
        .then((response) => response.json())
        .then((data) => {
            user.value = {
                ...data,
                createdAt: formattaData(data.createdAt),
                updatedAt: formattaData(data.updatedAt),
                id: recuperaId(data.self),
            };
        })
        .catch((error) => {
            console.error("Errore da getUserById(" + id + "): ", error);
            user.value = null;
        });
}

export function getUsers() {
    fetch(apiUsers, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loggedUser.token}`,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            users.value = data.map((data) => {
                return {
                    ...data,
                    createdAt: formattaData(data.createdAt),
                    updatedAt: formattaData(data.updatedAt),
                    id: recuperaId(data.self),
                };
            });
        })
        .catch((error) => {
            console.error("Errore da getUsers(): ", error);
            users.value = null;
        });
}
