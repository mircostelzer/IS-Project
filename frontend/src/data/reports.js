import { loggedUser } from "@/states/loggedUser";
import { ref } from "vue";

const apiReports = import.meta.env.VITE_API_BASE_URL + "/reports/";
const apiUsers = import.meta.env.VITE_API_BASE_URL + "/users/";

export const report = ref([]);
export const reports = ref([]);

// Funzione per recuperare l'id delle segnalazioni
function recuperaId(self) {
    return self.substring(self.lastIndexOf("/") + 1);
}

// Funzione per formattare la data delle segnalazioni
function formattaData(date) {
    return new Date(date).toLocaleString("it-IT", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function resetReports() {
    report.value = [];
    reports.value = [];
}

export async function nReports(role) {
    try {
        const response = await fetch(apiReports, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${loggedUser.token}`,
            },
        });

        const data = await response.json();
        return data.filter((user) => user.role === role).length;
    } catch (error) {
        console.error("Errore da nReports(): ", error);
        return 0;
    }
}

export async function getReports() {
    try {
        const response = await fetch(apiReports, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${loggedUser.token}`,
            },
        });
        const data = await response.json();

        // Wait for all emails to resolve
        const reportsData = await Promise.all(data.map(async (item) => {
            const email = await getEmailByUserId(item.createdBy);
            return {
                ...item,
                email: email,
                startDate: formattaData(item.startDate),
                createdAt: formattaData(item.createdAt),
                id: recuperaId(item.self),
            };
        }));

        reports.value = reportsData;
    } catch (error) {
        console.error("Errore da getReports(): ", error);
        reports.value = null;
    }
}

export async function getMyReports() {
    try {
        const response = await fetch(apiReports + "myReports", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${loggedUser.token}`,
            },
        });

        const data = await response.json();
        const reportsData = data.map((item) => ({
            ...item,
            startDate: formattaData(item.startDate),
            createdAt: formattaData(item.createdAt),
            id: recuperaId(item.self),
        }));
        reports.value = reportsData;
    } catch (error) {
        console.error("Errore da getMyReports(): ", error);
        reports.value = null;
    }
}


export async function getReportById(id) {
    fetch(apiReports + id, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loggedUser.token}`,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            emergency.value = {
                ...data,
                email: getEmailByUserId(data.createdBy),
                startDate: formattaData(data.startDate),
                createdAt: formattaData(data.createdAt),
                id: recuperaId(data.self),
            };
        })
        .catch((error) => {
            console.error("Errore da getReportById(" + id + "): ", error);
            emergency.value = null;
        });
}

export async function getEmailByUserId(id) {
    try {
        const response = await fetch(apiUsers + id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${loggedUser.token}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            return data.email;
        } else {
            return null;
        }
    } catch (error) {
        if (response.status === 404) {
            console.error("Utente rimosso!");
        } else {
            console.error("Errore da getEmailByUserId(" + id + "): ", error);
        }
        
        return null;
    }
}

export async function createReport(data) {
    try {
        const response = await fetch(apiReports, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${loggedUser.token}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Errore nella creazione del report");
        }

        if (response.status === 204 || response.headers.get("content-length") === "0") {
            return null;
        }

        return response.json();
    } catch (error) {
        console.error("Errore da createReport(): ", error);
        return null;
    }
}

export async function updateReport(data) {
    try {
        const response = await fetch(apiReports + data.id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${loggedUser.token}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Errore nell'aggiornamento del report");
        }

        return response.json();
    } catch (error) {
        console.error("Errore da updateReport(): ", error);
        return null;
    }
}
