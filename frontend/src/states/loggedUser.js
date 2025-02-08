import { reactive } from 'vue'

// Funzione per recuperare l'id delle emergenze
const recuperaId = (self) => {
    !self ? null : self.substring(self.lastIndexOf('/') + 1);
};

const loggedUser = reactive({
    token: undefined,
    email: undefined,
    role: undefined,
    id: undefined,
    self: undefined
})

function setLoggedUser (data) {
    loggedUser.token = data.token;
    loggedUser.email = data.email;
    loggedUser.role = data.role;
    loggedUser.id = recuperaId(data.self);
    loggedUser.self = data.self;
}

function clearLoggedUser () {
    loggedUser.token = undefined;
    loggedUser.email = undefined;
    loggedUser.role = undefined;
    loggedUser.id = undefined;
    loggedUser.self = undefined;
}

export { loggedUser, setLoggedUser, clearLoggedUser }