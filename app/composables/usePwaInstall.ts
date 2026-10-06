import { ref, computed } from 'vue'

const isInstallPromptVisible = ref(false)
const isAppInstalled = ref(false)
const isStandalone = ref(false)
const hasDismissed = ref(false)
let pwaInstallEvent: any = null
let isInitialized = false

export function usePwaInstall() {
  if (typeof window !== 'undefined' && !isInitialized) {
    isInitialized = true
    initPwaState()
  }

  const canInstall = computed(() => {
    return !isStandalone.value && !isAppInstalled.value
  })

  function initPwaState() {
    if (typeof window === 'undefined') return

    const isStandaloneMode = (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    )
    isStandalone.value = isStandaloneMode

    try {
      const storedInstalled = localStorage.getItem('isAppInstalled') === 'true'
      const storedDismissed = localStorage.getItem('appInstallationDismissed') === 'true'

      isAppInstalled.value = isStandaloneMode || storedInstalled
      hasDismissed.value = storedDismissed
    } catch {
      // Graceful fallback
    }

    window.addEventListener('beforeinstallprompt', (event: Event) => {
      event.preventDefault()
      pwaInstallEvent = event

      // Only show automatically on first visit if user hasn't dismissed and not installed
      if (!hasDismissed.value && !isAppInstalled.value && !isStandalone.value) {
        isInstallPromptVisible.value = true
      }
    })

    window.addEventListener('appinstalled', () => {
      isAppInstalled.value = true
      isInstallPromptVisible.value = false
      pwaInstallEvent = null
      try {
        localStorage.setItem('isAppInstalled', 'true')
        localStorage.setItem('appInstallationDismissed', 'true')
      } catch {}
      if (typeof (window as any).gtag === 'function') {
        (window as any).gtag('event', 'pwa_installed', {
          event_category: 'engagement',
          event_label: 'Among Us Detective App Installed',
        })
      }
    })
  }

  function promptInstall() {
    isInstallPromptVisible.value = false

    if (pwaInstallEvent != null) {
      try {
        pwaInstallEvent.prompt()
        pwaInstallEvent.userChoice?.then((choiceResult: any) => {
          if (choiceResult?.outcome === 'accepted') {
            isAppInstalled.value = true
            try {
              localStorage.setItem('isAppInstalled', 'true')
              localStorage.setItem('appInstallationDismissed', 'true')
            } catch {}
            if (typeof (window as any).gtag === 'function') {
              (window as any).gtag('event', 'pwa_installed', {
                event_category: 'engagement',
                event_label: 'User Accepted PWA Install',
              })
            }
          }
          pwaInstallEvent = null
        }).catch(() => {
          pwaInstallEvent = null
        })
      } catch (err) {
        console.warn('PWA prompt failed:', err)
      }
    }
  }

  function dismissPrompt() {
    isInstallPromptVisible.value = false
    hasDismissed.value = true
    try {
      localStorage.setItem('appInstallationDismissed', 'true')
    } catch {}
  }

  return {
    isInstallPromptVisible,
    isAppInstalled,
    isStandalone,
    hasDismissed,
    canInstall,
    promptInstall,
    dismissPrompt,
  }
}
