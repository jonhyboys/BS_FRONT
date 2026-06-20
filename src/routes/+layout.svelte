<script>
  import { afterNavigate } from '$app/navigation';
  import '../app.css';

  const { children } = $props();
</script>

<header>
  <div class="brand">
    <img src="Genil.png" alt="Logo" />
  </div>
  <nav>
    <ul class="menu">
      <li><a href="/">Inicio</a></li>
      <li><a href="/products">Productos</a></li>
      <li><a href="/clients">Clientes</a></li>
      <li><a href="/categories">Categorías</a></li>
      <li><a href="/selling">Vender</a></li>
      <li><a href="/invoices">Facturas</a></li>
      <li><a href="/clousures">Cierres</a></li>
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
    justify-content: space-between;
    margin-bottom: 1em;
  }

  .brand { gap: 1em; }

  .brand img { height: 4em; }

  .menu { display: flex; }

  .menu a {
    background: none;
    border: none;
    color: #333;
    cursor: pointer;
    display: block;
    font: inherit;
    padding: .5em;
    text-decoration: none;
  }

  .menu a:hover {
    background-color: #333;
    color: #FFF;
  }
</style>