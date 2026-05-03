<script>
  import { searchProducts, getProductByCode } from '$lib/api/products.api.js';

  let { onAddProduct } = $props();

  let searchQuery = $state('');
  let results = $state([]);
  let isOpen = $state(false);
  let loading = $state(false);
  let error = $state(null);

  let selectedQty = $state({});
  let selectedDiscount = $state({});
  
  let debounceTimer;

  function isValidSearchQuery(query) {
    return /^[a-zA-Z0-9]+$/.test(query);
  }

  async function performSearch(query) {
    if (!query.trim() || query.length < 3) {
      results = [];
      isOpen = false;
      return;
    }

    if (!isValidSearchQuery(query)) {
      results = [];
      isOpen = false;
      return;
    }

    loading = true;
    error = null;

    try {
      const isNumeric = /^\d+$/.test(query);

      if (isNumeric) {
        // Buscar por código de barras
        try {
          const product = await getProductByCode(query);
          results = [product];
          
          // Inicializar valores por defecto
          if (!selectedQty.hasOwnProperty(product.id)) {
            selectedQty[product.id] = 1;
          }
          if (!selectedDiscount.hasOwnProperty(product.id)) {
            selectedDiscount[product.id] = 0;
          }
          
          isOpen = true;

          // Auto-agregar si hay un único resultado
          if (results.length === 1) {
            handleAddProduct(product.id, product.name, 1, product.price, 0);
            searchQuery = '';
            results = [];
            isOpen = false;
          }
        } catch {
          results = [];
          isOpen = false;
        }
      } else {
        // Buscar por query
        const searchResults = await searchProducts(query, 1);
        results = searchResults;
        
        // Inicializar valores por defecto para cada producto
        searchResults.forEach(product => {
          if (!selectedQty.hasOwnProperty(product.id)) {
            selectedQty[product.id] = 1;
          }
          if (!selectedDiscount.hasOwnProperty(product.id)) {
            selectedDiscount[product.id] = 0;
          }
        });
        
        isOpen = true;
      }
    } catch (err) {
      error = err.message;
      results = [];
    } finally {
      loading = false;
    }
  }

  function handleInput(query) {
    searchQuery = query;
    
    // Limpiar timer anterior
    clearTimeout(debounceTimer);
    
    // Iniciar nueva búsqueda con debounce
    debounceTimer = setTimeout(() => {
      performSearch(query);
    }, 300);
  }

  function handleAddProduct(productId, productName, quantity, price, discount) {
    if (onAddProduct) {
      onAddProduct({
        productId,
        productName,
        quantity: parseInt(quantity) || 1,
        price: parseFloat(price),
        discount: parseInt(discount) || 0,
        iva: 0
      });
    }
    searchQuery = '';
    results = [];
    isOpen = false;
    selectedQty = {};
    selectedDiscount = {};
  }

  function closeDropdown() {
    isOpen = false;
  }
</script>

<div class="search-container">
  <input
    type="text"
    placeholder="Buscar por nombre o código (mín. 3 caracteres)..."
    value={searchQuery}
    oninput={(e) => handleInput(e.target.value)}
    class="search-input"
  />

  {#if isOpen && results.length > 0}
    <div class="dropdown">
      {#each results as product (product.id)}
        <div class="search-result-item">
          <div class="product-info">
            <div class="product-name">{product.name}</div>
            <div class="product-code">Código: {product.code}</div>
          </div>

          <div class="product-controls">
            <div class="control-group">
              <label>Cant:</label>
              <input
                type="number"
                bind:value={selectedQty[product.id]}
                min="1"
                step="1"
                class="input-small"
              />
            </div>
            <div class="control-group">
              <label>Desc %:</label>
              <input
                type="number"
                bind:value={selectedDiscount[product.id]}
                min="0"
                max="100"
                step="1"
                class="input-small"
              />
            </div>
          </div>

          <button
            type="button"
            onclick={() =>
              handleAddProduct(
                product.id,
                product.name,
                selectedQty[product.id] || 1,
                product.price,
                selectedDiscount[product.id] || 0
              )}
            class="btn-vender"
          >
            Vender
          </button>
        </div>
      {/each}
    </div>
  {/if}

  {#if loading}
    <div class="dropdown">
      <p class="loading-message">Buscando...</p>
    </div>
  {/if}

  {#if error}
    <div class="dropdown">
      <p class="error-message">{error}</p>
    </div>
  {/if}

  <!-- Cerrar dropdown al hacer clic fuera -->
  {#if isOpen}
    <div class="overlay" onclick={closeDropdown}></div>
  {/if}
</div>

<style>
  .search-container {
    margin-bottom: 20px;
    position: relative;
  }

  .search-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1em;
    box-sizing: border-box;
  }

  .search-input:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
  }

  .dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    max-height: 400px;
    overflow-y: auto;
    z-index: 1000;
    margin-top: 5px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .search-result-item {
    padding: 15px;
    border-bottom: 1px solid #eee;
    display: flex;
    gap: 15px;
    align-items: center;
  }

  .search-result-item:last-child {
    border-bottom: none;
  }

  .product-info {
    flex: 1;
  }

  .product-name {
    font-weight: 600;
    margin-bottom: 5px;
  }

  .product-code {
    font-size: 0.85em;
    color: #666;
  }

  .product-controls {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .control-group {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .control-group label {
    font-size: 0.85em;
    font-weight: 600;
  }

  .input-small {
    width: 50px;
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.85em;
  }

  .btn-vender {
    padding: 8px 16px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9em;
    white-space: nowrap;
  }

  .btn-vender:hover {
    background-color: #218838;
  }

  .loading-message,
  .error-message {
    padding: 15px;
    text-align: center;
  }

  .loading-message {
    color: #666;
  }

  .error-message {
    color: #dc3545;
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
  }
</style>
