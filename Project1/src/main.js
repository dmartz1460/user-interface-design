import { mount } from 'svelte'
import './bank.css'
import Bank from './Bank.svelte'

const app = mount(Bank, {
  target: document.getElementById('app'),
})

export default app
