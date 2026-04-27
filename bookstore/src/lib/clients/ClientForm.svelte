<script>
  const { client } = $props();

  // Estado local editable
  let form = $state({});

  // Sincronizar cada vez que cambia el cliente
  $effect(() => {
    form = { ...client };
  });
</script>

<label>
  Id
  <input type="text" value={form.id} readonly />
</label>

<label>
  NIF
  <input type="text" bind:value={form.nif} />
</label>

<label>
  Nombre
  <input type="text" bind:value={form.name} />
</label>

<label>
  Teléfono
  <input type="number" bind:value={form.phone} />
</label>

<label>
  Dirección
  <input type="text" bind:value={form.address} />
</label>

<style>
  label {
    display: block;
    margin-bottom: 8px;
  }

  input {
    width: 100%;
    box-sizing: border-box;
  }
</style>