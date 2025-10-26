import {ref, computed, onMounted, onBeforeUnmount} from 'vue'

/**
 * Composable para detetar tipo de dispositivo e orientação
 *
 * Breakpoints usados (baseados em Material Design / Tailwind):
 *  - Mobile: < 768px
 *  - Tablet: 768px – 1023px
 *  - Desktop: ≥ 1024px
 *
 * Retorna refs/computed reativos:
 *  - width, height -> dimensões visíveis da viewport
 *  - isMobile, isTablet, isDesktop -> booleanos
 *  - deviceType -> 'mobile' | 'tablet' | 'desktop'
 *  - isPortrait, isLandscape -> booleanos
 */
export function DeviceService() {

    const width = ref(0);
    const height = ref(0);
    const orientation = ref('portrait');

    function update() {
        width.value = window.visualViewport?.width || window.innerWidth
        height.value = window.visualViewport?.height || window.innerHeight
        orientation.value = width.value > height.value ? 'landscape' : 'portrait'
    }

    /** Registers listeners on mount  */
    onMounted(() => {
        update()
        window.addEventListener('resize', update, {passive: true})
        window.addEventListener('orientationchange', update, {passive: true})
    })

    /** Removes listeners on unmount */
    onBeforeUnmount(() => {
        window.removeEventListener('resize', update)
        window.removeEventListener('orientationchange', update)
    })

    /** Computed breakpoints */
    const isMobile = computed(() => width.value < 768)
    const isTablet = computed(() => width.value >= 768 && width.value < 1024)
    const isDesktop = computed(() => width.value >= 1024)

    /** Computed orientation */
    const isPortrait = computed(() => orientation.value === 'portrait')
    const isLandscape = computed(() => orientation.value === 'landscape')

    return {
        width,
        height,
        isMobile,
        isTablet,
        isDesktop,
        isPortrait,
        isLandscape
    }
}