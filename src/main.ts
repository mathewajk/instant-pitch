import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVfm } from 'vue-final-modal'

import router from './routes/router'
import App from './App.vue'

import 'vue-final-modal/style.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(createVfm())
app.mount('#app')
