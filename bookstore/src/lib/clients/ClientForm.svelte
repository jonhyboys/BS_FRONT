<script>
  const { client, onChange, errors = {} } = $props();

  let form = $state({
    name: '',
    nif: '',
    phone: '',
    address: ''
  });

  $effect(() => {
    if (!client) return;

    form.name = client.name ?? '';
    form.nif = client.nif ?? '';
    form.phone = client.phone ?? '';
    form.address = client.address ?? '';
  });

  function emitirCambios() {
    onChange({
      ...client,
      name: form.name,
      nif: form.nif,
      phone: form.phone,
      address: form.address
    });
  }
</script>

<div class="form">
  <label>
    Nombre
    <input bind:value={form.name} oninput={emitirCambios} />
    {#if errors.name}<span class="error">{errors.name}</span>{/if}
  </label>

  <label>
    NIF
    <input bind:value={form.nif} oninput={emitirCambios} />
    {#if errors.nif}<span class="error">{errors.nif}</span>{/if}
  </label>

  <label>
    Teléfono
    <input bind:value={form.phone} oninput={emitirCambios} />
  </label>

  <label>
    Dirección
    <input bind:value={form.address} oninput={emitirCambios} />
  </label>
</div>

<style>
  .form {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .error {
    color: red;
    font-size: 0.8em;
  }
</style>