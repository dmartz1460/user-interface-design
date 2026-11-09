import { mount } from 'svelte'
import './25live.css'
import Dashboard from './lib/results.svelte'

const dashboard = mount(Dashboard, {
  target: document.getElementById('dashboard'),
})

export default dashboard
