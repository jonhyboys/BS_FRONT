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
    max-width: 40em;
    margin: 1em;
    padding: 1em;
    box-sizing: border-box;
  }
</style>