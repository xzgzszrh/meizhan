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

const fallbackLogtoEndpoint = 'https://auth.sh.creativone.cn'
const fallbackLogtoAppId = '6aa8l1189gr6fwhkulr4h'
const fallbackLogtoCoreResource = 'https://default.logto.app/api'

const logtoEndpoint = import.meta.env.VITE_LOGTO_ENDPOINT || fallbackLogtoEndpoint
const logtoAppId = import.meta.env.VITE_LOGTO_APPID || fallbackLogtoAppId
const logtoCoreResource = import.meta.env.VITE_LOGTO_CORE_RESOURCE || fallbackLogtoCoreResource
const logtoConfig = {
  endpoint: logtoEndpoint,
  appId: logtoAppId,
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
