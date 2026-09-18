import { mount } from 'svelte'
import './bank.css'
import ControlDisplay from './Control.svelte'
import ReactiveDisplay from './Reactive.svelte'

const controlApp = mount(ControlDisplay, {
  target: document.getElementById('controlApp')
})

const reactiveApp = mount(ReactiveDisplay, {
  target: document.getElementById('reactiveApp')
})

export default controlApp
