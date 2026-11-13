import { mount } from 'svelte'
import './25live.css'
import './lib/popups.css'
import Dashboard from './Dashboard.svelte'

const dashboard = mount(Dashboard, {
  target: document.getElementById('dashboard'),
})

export default dashboard
