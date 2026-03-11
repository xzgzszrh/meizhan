import './assets/main.css'
import './assets/index.css'

import { createApp } from 'vue'
import VueMatomo from 'vue-matomo'
import { createLogto, UserScope } from '@logto/vue'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const parseLogtoResources = (rawValue, coreResource) => {
  if (!rawValue) {
    return coreResource ? [coreResource] : []
  }
  try {
    const parsed = JSON.parse(rawValue)
    if (Array.isArray(parsed)) {
      return parsed
    }
  } catch (e) {
    console.error('[CONFIG] VITE_LOGTO_RESOURCES is not valid JSON:', e)
  }
  return coreResource ? [coreResource] : []
}

const logtoCoreResource = import.meta.env.VITE_LOGTO_CORE_RESOURCE
const logtoConfig = {
  endpoint: import.meta.env.VITE_LOGTO_ENDPOINT,
  appId: import.meta.env.VITE_LOGTO_APPID,
  scopes: [
    UserScope.Profile,
    UserScope.Email,
    UserScope.Phone,
    UserScope.Identities,
    UserScope.Organizations,
    UserScope.CustomData
  ],
  resources: parseLogtoResources(import.meta.env.VITE_LOGTO_RESOURCES, logtoCoreResource)
}

app.use(router)
app.use(autoAnimatePlugin)
app.use(createLogto, logtoConfig)
if (import.meta.env.VITE_MATOMO_ENDPOINT) {
  app.use(VueMatomo, {
    host: import.meta.env.VITE_MATOMO_ENDPOINT,
    siteId: import.meta.env.VITE_MATOMO_SITE_ID,
    trackerFileName: 'matomo',
    router: router,
    enableLinkTracking: true
  })
}

app.mount('#app')

if (import.meta.env.VITE_MATOMO_ENDPOINT) {
  window._paq.push(['trackPageView'])
}
