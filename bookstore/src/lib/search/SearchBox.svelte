<script>
  const {
    value = '',
    placeholder = 'Buscar...',
    onChange
  } = $props();

  function handleInput(event) {
    onChange?.(event.target.value);
  }

  function handleFocus(event) {
    event.target.select();
  }
</script>

<input
  type="text"
  value={value}
  placeholder={placeholder}
  oninput={handleInput}
  onfocus={handleFocus}
/>

<style>
  input {
    width: 100%;
    max-width: 400px;
    margin: 10px 0 16px 0;
    padding: 6px 8px;
    box-sizing: border-box;
  }
</style>