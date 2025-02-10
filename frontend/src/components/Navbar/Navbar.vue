<script setup>
import { RouterLink } from "vue-router";
import { loggedUser } from '../../states/loggedUser.js'
import OcioDinamicoLetsgoski from "./OcioDinamicoLetsgoski.vue";

import {
    Bars3BottomLeftIcon,
    MagnifyingGlassIcon,
    BellIcon,
    CalendarIcon,
    UserIcon,
    MapIcon,
    ExclamationCircleIcon,
    LockClosedIcon,
    MegaphoneIcon,
    KeyIcon,
    UserCircleIcon
} from "@heroicons/vue/24/solid";

// Per chiudere il menu della navbar dopo il click ad un'altra pagina
function chiudiMenuNavbar() {
    document.getElementById("navbarDrawer").checked = false;
}
</script>

<template>
    <!-- Menù laterale -->
    <div className="drawer">
        <input id="navbarDrawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-side z-50">
            <label htmlFor="navbarDrawer" aria-label="close sidebar" className="drawer-overlay">
            </label>
            <div class="menu w-80 bg-base-200 text-base-content min-h-full p-2">
                <div class="p-4">
                    <div class="to-center">
                        <OcioDinamicoLetsgoski :imgWidth="150" />
                    </div>
                    <div class="divider"></div>
                    <ul class="p-0 -mt-0.5">
                        <li class="menu-title px-0">
                            <router-link to="/" class="px-0 flex" @click="chiudiMenuNavbar()">
                                <MapIcon class="size-6 mx-2" />
                                <p class="ms-1 mt-0.5">Homepage - Mappa</p>
                            </router-link>
                        </li>
                        <li class="menu-title px-0">
                            <router-link to="/storico" class="px-0 flex" @click="chiudiMenuNavbar()">
                                <CalendarIcon class="size-6 mx-2" />
                                <p class="ms-1 mt-0.5">Storico emergenze</p>
                            </router-link>
                        </li>
                        <li class="menu-title px-0">
                            <router-link to="/accedi" class="px-0 flex" @click="chiudiMenuNavbar()">
                                <KeyIcon class="size-6 mx-2" />
                                <p class="ms-1 mt-0.5">Accedi</p>
                            </router-link>
                        </li>
                        <div v-if="loggedUser.token">
                            <div class="divider"></div>
                            <p class="text-lg text-primary mb-2">Sezione privata:</p>
                            <li class="menu-title px-0">
                                <router-link to="/profilo" class="px-0 flex" @click="chiudiMenuNavbar()">
                                    <UserIcon class="size-6 mx-2" />
                                    <p class="ms-1 mt-0.5">Il tuo profilo</p>
                                </router-link>
                            </li>
                            <li v-if="loggedUser.role !== 'admin'" class="menu-title px-0">
                                <router-link to="/invia_segnalazione" class="px-0 flex" @click="chiudiMenuNavbar()">
                                    <ExclamationCircleIcon class="size-6 mx-2" />
                                    <p class="ms-1 mt-0.5">Invia segnalazione</p>
                                </router-link>
                            </li>
                            <li v-if="loggedUser.role === 'admin'" class="menu-title px-0">
                                <router-link to="/pubblica_comunicazione" class="px-0 flex" @click="chiudiMenuNavbar()">
                                    <MegaphoneIcon class="size-6 mx-2" />
                                    <p class="ms-1 mt-0.5">Pubblica comunicazione</p>
                                </router-link>
                            </li>
                            <li v-if="loggedUser.role === 'admin'" class="menu-title px-0">
                                <router-link to="/dashboard" class="px-0 flex" @click="chiudiMenuNavbar()">
                                    <LockClosedIcon class="size-6 mx-2" />
                                    <p class="ms-1 mt-0.5">Dashboard admin</p>
                                </router-link>
                            </li>
                        </div>
                    </ul>
                </div>
                <div class="absolute bottom-0 p-4">
                    <p class="text-gray-200 mb-1">Progetto di Ingegneria del software</p>
                    <p class="text-gray-400">2024/2025</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Navbar -->
    <div class="navbar sticky top-0 bg-secondary w-full z-40">
        <div class="navbar-start">
            <label htmlFor="navbarDrawer" class="btn btn-ghost drawer-button px-2">
                <Bars3BottomLeftIcon class="size-8" />
            </label>
        </div>
        <div class="navbar-center">
            <RouterLink to="/">
                <OcioDinamicoLetsgoski :imgWidth="100" />
            </RouterLink>
        </div>
        <div class="navbar-end gap-1">
            <router-link to="/storico">
                <button class="btn btn-ghost btn-circle">
                    <MagnifyingGlassIcon class="size-6" />
                </button>
            </router-link>
            <button class="btn btn-ghost btn-circle" onclick="modalNotifiche.showModal()">
                <BellIcon class="size-6" />
            </button>
            <router-link to="/profilo">
                <button class="btn btn-ghost btn-circle">
                    <UserCircleIcon class="size-6" />
                </button>
            </router-link>
        </div>
    </div>

    <!-- Modal notifiche -->
    <dialog id="modalNotifiche" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 class="text-2xl font-bold">Notifiche da Ocio</h3>
            <p class="py-4 text-gray-300">Nessuna notifica ricevuta: sei a posto!</p>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button></button>
        </form>
    </dialog>
</template>

<style scoped>
.navbar {
    height: var(--navbar-height);
}

.modal-box {
    background-color: var(--background);
}

.menu {
    background-color: var(--verdeScuro);
}

.menu-title {
    margin: 5px 0;
    border-radius: 5px;
    color: #cccccc;
    transition: color 0.3s ease, background-color 0.5s ease, transform 0.5s ease;
}

.menu-title:hover,
.menu-title:active,
.menu-title:focus,
.menu-title:focus-within {
    color: #8cd87d;
    background-color: #3f3f3f;
    transform: translateX(5px);
}
</style>
