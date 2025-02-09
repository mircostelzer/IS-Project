import { reactive } from 'vue'

const loggedUser = reactive({
    self: undefined,
    token: undefined,
    id: undefined,
    email: undefined,
    hiddenPassword: undefined,
    role: undefined,
    createdAt: undefined,
    updatedAt: undefined
})

function setLoggedUser (data) {
    loggedUser.self = data.self;
    loggedUser.token = data.token;
    loggedUser.id = data.id;
    loggedUser.email = data.email;
    loggedUser.hiddenPassword = data.hiddenPassword;
    loggedUser.role = data.role;
    loggedUser.createdAt = data.createdAt;
    loggedUser.updatedAt = data.updatedAt;
}

function clearLoggedUser () {
    loggedUser.self = undefined;
    loggedUser.token = undefined;
    loggedUser.id = undefined;
    loggedUser.email = undefined;
    loggedUser.hiddenPassword = undefined;
    loggedUser.role = undefined;
    loggedUser.createdAt = undefined;
    loggedUser.updatedAt = undefined;
}

export { loggedUser, setLoggedUser, clearLoggedUser }