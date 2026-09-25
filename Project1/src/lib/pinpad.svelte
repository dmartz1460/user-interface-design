<script>
  let { activeScreen = $bindable() } = $props();

  // --- PIN State ---
  const correctPin = '1234';
  const pinLength = 4;
  let enteredPin = $state('');
  let error = $state('');

  // Dot display: ● for entered digits, ○ for remaining
  let dots = $derived(
    '● '.repeat(enteredPin.length) + '○ '.repeat(pinLength - enteredPin.length)
  );

  function pressDigit(digit) {
    if (enteredPin.length < pinLength) {
      enteredPin += digit;
      error = '';
    }
  }

  function backspace() {
    enteredPin = enteredPin.slice(0, -1);
    error = '';
  }

  function submit() {
    if (enteredPin === correctPin) {
      enteredPin = '';
      activeScreen = 'home';
    } else {
      error = 'Incorrect PIN';
      enteredPin = '';
      setTimeout(() => { error = ''; }, 1500);
    }
  }

  function cancel() {
    enteredPin = '';
    activeScreen = 'lock';
  }
</script>

<!-- Header -->
<div class="screen-header">
  <button class="cancel-btn" onclick={cancel}>Cancel</button>
  <h1>Enter PIN</h1>
</div>

<div> 
  <p class="pin-dots">{dots}</p>
  {#if error}
    <p class="pin-error">{error}</p>
  {/if}
</div>

<!-- Pinpad -->
<div class="pinpad-grid">
  {#each [1, 2, 3] as digit}
    <button class="pin-key" onclick={() => pressDigit(String(digit))}>{digit}</button>
  {/each}
  {#each [4, 5, 6] as digit}
    <button class="pin-key" onclick={() => pressDigit(String(digit))}>{digit}</button>
  {/each}
  {#each [7, 8, 9] as digit}
    <button class="pin-key" onclick={() => pressDigit(String(digit))}>{digit}</button>
  {/each}
  <button class="pin-key" onclick={backspace}>⌫</button>
  <button class="pin-key" onclick={() => pressDigit('0')}>0</button>
  <button class="pin-key pin-key-enter" onclick={submit}>✓</button>
</div>
