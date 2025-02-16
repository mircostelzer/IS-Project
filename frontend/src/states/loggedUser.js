import { reactive, watch } from 'vue';
import Cookies from 'js-cookie';
import { resetUser } from '@/data/users';
import { resetEmergencies } from '@/data/emergencies';
import { resetReports } from '@/data/reports';

const loggedUser = reactive({
    saveDate: undefined,
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
        const parsedUserData = JSON.parse(userData);
        const timeLimit = 24 * 60 * 60 * 1000;

        // Check if saveDate is older than 24 hours
        if (parsedUserData.saveDate && (Date.now() - new Date(parsedUserData.saveDate).getTime()) > timeLimit) {
            clearLoggedUser();
        } else {
            Object.assign(loggedUser, parsedUserData);
        }
    }
};

function setLoggedUser(data) {
    loggedUser.saveDate = new Date();
    loggedUser.self = data.self;
    loggedUser.token = data.token;
    loggedUser.id = data.id;
    loggedUser.email = data.email;
    loggedUser.hiddenPassword = data.hiddenPassword;
    loggedUser.role = data.role;
    loggedUser.createdAt = data.createdAt;
    loggedUser.updatedAt = data.updatedAt;

    // Save to cookies
    Cookies.set('loggedUser', JSON.stringify(loggedUser), { expires: 30 * 6 }); // Scadenza tra 6 mesi
}

function clearLoggedUser() {
    loggedUser.saveDate = undefined;
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
