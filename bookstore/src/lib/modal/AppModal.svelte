<script>
  const {
    title,
    children,
    onSave,
    onDelete,
    onCancel
  } = $props();
</script>

<div class="modal-backdrop">
  <div class="modal">
    <h2>{title}</h2>

    <div class="content">
      {@render children()}
    </div>

    <div class="buttons">
      <button type="button" onclick={onSave}>
        Guardar
      </button>

      <button
        type="button"
        class="danger"
        onclick={() => {
          if (confirm('¿Está seguro de que desea eliminar este registro?')) {
            onDelete();
          }
        }}
      >
        Eliminar
      </button>

      <button type="button" onclick={onCancel}>
        Cancelar
      </button>
    </div>
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal {
    background: white;
    padding: 20px;
    width: 360px;
    border-radius: 4px;
  }

  .content {
    margin-top: 12px;
  }

  .buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 16px;
  }

  button {
    padding: 6px 12px;
  }

  .danger {
    background: #c0392b;
    color: white;
  }
</style>