<script>
  import { afterNavigate } from '$app/navigation';

  const { children } = $props();
  let ventasAbierto = $state(false);

  function toggleVentas() { ventasAbierto = !ventasAbierto; }

  afterNavigate(() => { ventasAbierto = false;});
</script>

<header>
  <div class="brand">
    <img src="/src/img/Genil.png" alt="Logo" />
    <span>Librería Genil</span>
  </div>
  <nav>
    <ul class="menu">
      <li><a href="/">Inicio</a></li>
      <li><a href="/products">Productos</a></li>
      <li><a href="/clients">Clientes</a></li>
      <li><a href="/categories">Categorías</a></li>
      <li class="has-submenu">
        <button type="button" class="menu-button" onclick={toggleVentas}>
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
    align-items: center;
    display: flex;
    padding: 1em;
    justify-content: space-between;
  }

  .brand { gap: 1em; }

  .brand img { height: 4em; }

  .brand span { 
    color: #FFF;
    user-select: none;
   }

  .menu {
    display: flex;
    gap: 1em;
  }

  .menu a,
  .menu-button {
    background: none;
    border: none;
    color: #333;
    cursor: pointer;
    display: block;
    font: inherit;
    padding: 1em;
    text-decoration: none;
  }

  .menu a:hover,
  .menu-button:hover {
    background-color: #333;
    color: #FFF;
  }

  .has-submenu { position: relative; }

  .submenu {
    border: 1px solid #BBB;
    left: 0;
    min-width: 6em;
    padding: 0;
    position: absolute;
    top: 100%;
    z-index: 1;
  }

  .submenu a { padding: .5em; }

  main { padding: 1em; }
</style>