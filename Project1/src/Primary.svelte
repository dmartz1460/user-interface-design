<script>
  import Home from './lib/home.svelte'
  import Lock from './lib/lock.svelte'
  import YourBank from './lib/yourBank.svelte'
  import Pinpad from './lib/pinpad.svelte'
  import Keyboard from './lib/keyboard.svelte'
  import Goals from './lib/goals.svelte'
  import Dispense from './lib/dispense.svelte'
  import Custom from './lib/custom.svelte'

  let currentScreen = $state('lock')
</script>

{#if currentScreen === 'home'}
  <Home />
{:else if currentScreen === 'lock'}
  <Lock />
{:else if currentScreen === 'yourBank'}
  <YourBank />
{:else if currentScreen === 'pinpad'}
  <Pinpad />
{:else if currentScreen === 'keyboard'}
  <Keyboard />
{:else if currentScreen === 'goals'}
  <Goals />
{:else if currentScreen === 'dispense'}
  <Dispense />
{:else if currentScreen === 'custom'}
  <Custom />
{/if}

