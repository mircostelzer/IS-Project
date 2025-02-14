import { reactive, watch } from 'vue';
import Cookies from 'js-cookie';
import { resetUser } from '@/data/users';
import { resetEmergencies } from '@/data/emergencies';
import { resetReports } from '@/data/reports';

const loggedUser = reactive({
    self: undefined,
    token: undefined,
    id: undefined,
    email: undefined,
    hiddenPassword: undefined,
    role: undefined,
    createdAt: undefined,
    updatedAt: undefined
});

// Load user data from cookies when the app initializes
function loadUserFromCookies() {
    const userData = Cookies.get('loggedUser');

    if (userData) {
        Object.assign(loggedUser, JSON.parse(userData))
    }
};

function setLoggedUser(data) {
    loggedUser.self = data.self;
    loggedUser.token = data.token;
    loggedUser.id = data.id;
    loggedUser.email = data.email;
    loggedUser.hiddenPassword = data.hiddenPassword;
    loggedUser.role = data.role;
    loggedUser.createdAt = data.createdAt;
    loggedUser.updatedAt = data.updatedAt;

    // Save to cookies
    Cookies.set('loggedUser', JSON.stringify(loggedUser), { expires: 30 }); // expires in 1 month
}

function clearLoggedUser() {
    loggedUser.self = undefined;
    loggedUser.token = undefined;
    loggedUser.id = undefined;
    loggedUser.email = undefined;
    loggedUser.hiddenPassword = undefined;
    loggedUser.role = undefined;
    loggedUser.createdAt = undefined;
    loggedUser.updatedAt = undefined;

    // Remove from cookies
    Cookies.remove('loggedUser');

    // Reset all data states
    resetUser()
    resetEmergencies()
    resetReports()
}

export { loggedUser, setLoggedUser, clearLoggedUser, loadUserFromCookies };
