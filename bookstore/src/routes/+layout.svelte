<script>
  import { afterNavigate } from '$app/navigation';

  // Props del layout (RUNES MODE)
  const { children } = $props();

  // Estado reactivo (RUNES MODE)
  let ventasAbierto = $state(false);

  function toggleVentas() {
    ventasAbierto = !ventasAbierto;
  }

  // PASO 1: cerrar el submenú al navegar
  afterNavigate(() => {
    ventasAbierto = false;
  });
</script>

<header>
  <div class="brand">
    <img src="/svelte-logo.svg" alt="Logo" />
    <span>Librería Genil</span>
  </div>

  <nav>
    <ul class="menu">
      <li><a href="/">Inicio</a></li>
      <li><a href="/products">Productos</a></li>
      <li><a href="/clients">Clientes</a></li>
      <li><a href="/categories">Categorías</a></li>

      <li class="has-submenu">
        <!-- Ventas NO navega -->
        <button
          type="button"
          class="menu-button"
          onclick={toggleVentas}
        >
          Ventas
        </button>

        {#if ventasAbierto}
          <ul class="submenu">
            <li><a href="/sales/selling">Vender</a></li>
            <li><a href="/sales/all">Ver todas</a></li>
          </ul>
        {/if}
      </li>

      <li><a href="/invoices">Facturas</a></li>
    </ul>
  </nav>
</header>

<main>
  {@render children()}
</main>

<style>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    border-bottom: 1px solid #ccc;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
    font-weight: bold;
  }

  .brand img {
    height: 32px;
  }

  .menu {
    list-style: none;
    display: flex;
    gap: 20px;
    margin: 0;
    padding: 0;
  }

  .menu a,
  .menu-button {
    text-decoration: none;
    color: #333;
    background: none;
    border: none;
    cursor: pointer;
    font: inherit;
  }

  .menu a:hover,
  .menu-button:hover {
    text-decoration: underline;
  }

  .has-submenu {
    position: relative;
  }

  .submenu {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 6px;
    padding: 8px;
    list-style: none;
    border: 1px solid #ccc;
    background: white;
    min-width: 140px;
  }

  .submenu li {
    margin-bottom: 6px;
  }

  .submenu li:last-child {
    margin-bottom: 0;
  }

  main {
    padding: 20px;
  }
</style>