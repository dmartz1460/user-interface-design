import { mount } from 'svelte'
import './bank.css'
import Bank from './Primary.svelte'

const app = mount(Bank, {
  target: document.getElementById('app'),
})

export default app
