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

<div class="body">
  <div class="form-group large">
    <label for="name">Nombre</label>
    <input name="name" type="text" bind:value={form.name} oninput={emitirCambios} />
    {#if errors.name}<span class="error">{errors.name}</span>{/if}
  </div>
  <div class="form-group">
    <label for="nif">NIF</label>
    <input name="nif" type="text" bind:value={form.nif} oninput={emitirCambios} />
    {#if errors.nif}<span class="error">{errors.nif}</span>{/if}
  </div>
  <div class="form-group">
      <label for="phone">Teléfono</label>
      <input name="phone" type="text" bind:value={form.phone} oninput={emitirCambios} />
      {#if errors.phone}<span class="error">{errors.phone}</span>{/if}
    </div>
    <div class="form-group large">
      <label for="address">Dirección</label>
      <input name="address" type="text" bind:value={form.address} oninput={emitirCambios} />
      {#if errors.address}<span class="error">{errors.address}</span>{/if}
    </div>
</div>

<style>
 .body { margin: 1em 0; }

  .form-group {
    display: flex;
    flex-direction: column;
    padding: 0.5em 0;
    width: 20em;
  }

  .form-group.large { width: 40em; }

  .form-group label { font-weight: 600; }

  .form-group input { padding: 0.5em; }
</style>