/* eslint-disable */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { io } from 'socket.io-client'

const app = createApp(App)
const socket = io()

app.config.globalProperties.$socket = socket
app.use(router).use(store).mount('#app')