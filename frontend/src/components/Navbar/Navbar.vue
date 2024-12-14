<script setup>
import { RouterLink, RouterView } from "vue-router";
import OcioDinamicoLetsgoski from "./OcioDinamicoLetsgoski.vue";

import { linkPagine } from "../../data/linkPagine.js";

import {
    Bars3BottomLeftIcon,
    MagnifyingGlassIcon,
    BellIcon,
    HomeIcon,
    CalendarIcon,
    UserIcon,
    LockClosedIcon,
    XMarkIcon,
} from "@heroicons/vue/24/solid";

// Per caricare le icone del menu laterale in maniera dinamica
function caricaIcona(nomeIcona) {
    return listaIcone[nomeIcona];
}

const listaIcone = {
    HomeIcon: HomeIcon,
    CalendarIcon: CalendarIcon,
    UserIcon: UserIcon,
    LockClosedIcon: LockClosedIcon,
    XMarkIcon: XMarkIcon,
};
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
                    <ul class="p-0">
                        <li v-for="(item, index) in linkPagine" :key="index" class="menu-title px-0">
                            <router-link :to="item.link" class="px-0 flex">
                                <component :is="caricaIcona(item.icona)" class="size-6 mx-2" />
                                <p class="ms-1 mt-0.5">{{ item.titolo }}</p>
                            </router-link>
                        </li>
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
        <div class="navbar-end">
            <router-link to="/storico">
                <button class="btn btn-ghost btn-circle">
                    <MagnifyingGlassIcon class="size-5" />
                </button>
            </router-link>
            <button class="btn btn-ghost btn-circle" onclick="modalNotifiche.showModal()">
                <BellIcon class="size-5" />
            </button>
        </div>
    </div>

    <!-- Modal notifiche -->
    <dialog id="modalNotifiche" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 class="text-2xl font-bold">Notifiche da Ocio</h3>
            <p class="py-4 text-gray-300">Nessuna notifica ricevuta: sei apposto!</p>
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
