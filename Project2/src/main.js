import { mount } from 'svelte'
import './25live.css'
import App from './App.svelte'
import './lib/popups.css'

const app = mount(App, {
  target: document.getElementById('dashboard'),
})

export default app
