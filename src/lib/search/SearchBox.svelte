<script>
  const {
    value = '',
    placeholder = 'Buscar...',
    onChange
  } = $props();
  function handleInput(event) { onChange?.(event.target.value); }
  function handleFocus(event) { event.target.select(); }
</script>

<div class="search-box">
  <input
    type="text"
    value={value}
    placeholder={placeholder}
    oninput={handleInput}
    onfocus={handleFocus}
  />
</div>

<style>
  .search-box {
    display: flex;
    justify-content: center;
    margin-bottom: 2em;
  }
  input {
    box-sizing: border-box;
    margin: 1em;
    max-width: 40em;
    padding: 1em;
    width: 100%;
  }
</style>