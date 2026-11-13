<script>
  export let trigger;
  let menu;

  const menuItems = [
    { label: 'Settings', icon: 'M6 12h12M12 6v12' },
    { label: 'Reports', icon: 'M6 18v-8M12 18V6M18 18v-5' },
    { label: 'About', icon: 'M12 11v6M12 6v.1' },
    { label: 'API documentation', icon: 'M8 7l-5 5 5 5M16 7l5 5-5 5' }
  ];

  function handleKeydown(event) {
    if (event.key === 'Escape' && menu.matches(':popover-open')) {
      menu.hidePopover();
      trigger?.focus();
    }
  }
</script>

<svelte:window onkeydowncapture={handleKeydown} />

<div id="profile-menu" class="profile-menu" popover="auto" aria-label="Profile menu" bind:this={menu}>
  <div class="profile-heading">
    <span class="profile-initials" aria-hidden="true">JD</span>
    <span class="profile-name">John Doe</span>
  </div>

  <nav class="menu-links" aria-label="Profile navigation">
    {#each menuItems as item}
      <button class="menu-item" type="button">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d={item.icon}></path>
        </svg>
        <span>{item.label}</span>
      </button>
    {/each}
  </nav>

  <div class="menu-footer">
    <button class="sign-out" type="button">Sign out</button>
  </div>
</div>

<style>
  .profile-menu {
    position: fixed;
    inset: 60px 2.5% auto auto;
    width: min(280px, calc(100vw - 24px));
    max-height: calc(100vh - 72px);
    overflow-y: auto;
    margin: 0;
    padding: 0 16px 18px;
    border: 1px solid #e3e3e6;
    border-radius: 16px;
    background: #fff;
    color: #1c1c1e;
    box-shadow: 0 12px 28px #00000038;
  }

  .profile-heading {
    min-height: 92px;
    display: flex;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid #e3e3e6;
  }

  .profile-initials {
    width: 48px;
    height: 48px;
    flex: none;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: #e00122;
    color: #fff;
    font-weight: 700;
  }

  .profile-name { font-size: 17px; font-weight: 700; }
  .menu-links { padding: 4px 0 10px; }
  .menu-item {
    width: 100%;
    min-height: 52px;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 0 12px;
    border: 0;
    border-radius: 10px;
    background: transparent;
    color: #1c1c1e;
    text-align: left;
    font-size: 15px;
    font-weight: 500;
  }

  .menu-item:hover, .menu-item:focus-visible { background: #f3f3f5; }
  .menu-item svg {
    width: 24px;
    height: 24px;
    flex: none;
    fill: none;
    stroke: #6b6b73;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .menu-footer { padding-top: 18px; border-top: 1px solid #e3e3e6; }
  .sign-out {
    width: 100%;
    min-height: 46px;
    border: 0;
    border-radius: 10px;
    background: #e00122;
    color: #fff;
    font-size: 15px;
    font-weight: 700;
  }
  .sign-out:hover { background: #b9001b; }
  button:focus-visible { outline: 2px solid #2f6fed; outline-offset: 2px; }

  @media (max-width: 800px) {
    .profile-menu { right: 5%; }
  }
</style>