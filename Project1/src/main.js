import { mount } from 'svelte'
import './bank.css'
import ControlDisplay from './Control.svelte'

const controlApp = mount(ControlDisplay, {
  target: document.getElementById('bank-app')
})

export default controlApp
