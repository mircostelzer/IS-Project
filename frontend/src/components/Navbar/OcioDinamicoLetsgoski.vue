<script>
export default {
    name: "EyeComponent",
    mounted() {
        this.trackingPupilla();
    },
    props: {
        imgWidth: {
            type: Number,
            required: true
        }
    },
    methods: {
        trackingPupilla() {
            const pupilla = this.$refs.pupilla;
            const occhio = this.$refs.occhio;
            
            if (occhio) {
                document.addEventListener("mousemove", (e) => {
                    pupilla.style.translate = `0px 0px`;
                    const boundBox = occhio.getBoundingClientRect();
                    const centroX = boundBox.left + boundBox.width / 2;
                    const centroY = boundBox.top + boundBox.height / 2;

                    const angle = Math.atan2(
                        e.clientY - centroY,
                        e.clientX - centroX
                    );

                    const distance = Math.min(
                        Math.min(boundBox.width / 6, boundBox.height / 6),
                        Math.hypot(e.clientX - centroX, e.clientY - centroY) / 3
                    );

                    const pupilX =
                        centroX +
                        distance * Math.cos(angle) -
                        boundBox.left -
                        pupilla.offsetWidth / 2;
                    
                    const pupilY =
                        centroY +
                        distance * Math.sin(angle) -
                        boundBox.top -
                        pupilla.offsetHeight / 2;

                    pupilla.style.left = `${pupilX}px`;
                    pupilla.style.top = `${pupilY}px`;
                });
                
                document.addEventListener('mousedown', function() {
                    pupilla.classList.add('blink');

                    pupilla.addEventListener('animationend', function() {
                        pupilla.classList.remove('blink');
                    }, { once: true });
                });
            } else {
                console.error('Elemento "occhio" non trovato');
            }
        }
    },
};
</script>

<template>
    <div class="navbar-logo shine-anim-hover">
        <div class="div-logo-dinamico">
            <img class="logo" src="/loghi/logo_opaco_senza_pupilla.png">
            <div class="div-occhio" :style="{ '--image-width': imgWidth + 'px' }">
                <div class="occhio" ref="occhio">
                    <div class="pupilla" ref="pupilla"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.navbar-logo {
    transition: scale 0.5s ease-in-out;
}

.navbar-logo:hover {
    scale: 105%;
}

.div-logo-dinamico {
    position: relative;
}

.logo {
    position: absolute;
    top: 0;
    left: 0;
}

/* 4 ore per rendere la pupilla "responsive" */
.div-occhio {
    width: var(--image-width);

    .occhio {
        left: calc(var(--image-width) / 100 * 18);
        width: calc(var(--image-width) / 10);
        height: calc(var(--image-width) / 3.33);
        border-radius: 50%;
        position: relative;
    }

    .pupilla {
        translate: 0px calc(var(--image-width) / 10);
        width: calc(var(--image-width) / 10);
        height: calc(var(--image-width) / 10);
        background-color: black;
        border-radius: 50%;
        position: absolute;
    }
}

.blink {
    animation: blink 0.4s ease-in-out;
}

@keyframes blink {
    0% {
        transform: scaleY(100%);
    }
    50% {
        transform: scaleY(20%);
    }
    100% {
        transform: scaleY(100%);
    }
}
</style>
