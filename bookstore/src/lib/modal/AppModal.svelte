<script>
  const {
    title,
    onSave,
    onCancel,
    onDelete,
    actionsAlign = 'right'
  } = $props();
</script>

<div class="overlay">
  <div class="modal">
    <h2>{title}</h2>

    <div class="content">
      <slot />
    </div>

    <div
      class="actions"
      class:align-right={actionsAlign === 'right'}
    >
      {#if onSave}
        <button type="button" onclick={onSave}>
          Guardar
        </button>
      {/if}

      {#if onDelete}
        <button
          type="button"
          class="danger"
          onclick={onDelete}
        >
          Eliminar
        </button>
      {/if}

      <button type="button" onclick={onCancel}>
        Cancelar
      </button>
    </div>
  </div>
</div>

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal {
    background: white;
    padding: 16px;
    border-radius: 4px;
    min-width: 320px;
    max-width: 600px;
  }

  .content {
    margin: 16px 0;
  }

  .actions {
    display: flex;
    gap: 8px;
  }

  .actions.align-right {
    justify-content: flex-end;
  }

  button {
    padding: 6px 10px;
  }

  .danger {
    background: #c0392b;
    color: white;
    border: none;
  }
</style>