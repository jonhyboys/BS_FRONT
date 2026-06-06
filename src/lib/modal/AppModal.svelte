<script>
  import IconButton from "$lib/button/IconButton.svelte";
  import { faRectangleXmark, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';

  const {
    title,
    onSave,
    onCancel,
    isOpen = $bindable(false),
    children
  } = $props();
</script>

{#if isOpen}
  <div class="modal-overlay">
    <div class="modal">
      <h2>{title}</h2>
      {@render children()}
      <div class="actions">
        <IconButton size="2x" icon={faRectangleXmark} label="Cancelar" onclick={onCancel} />
        <IconButton size="2x" icon={faFloppyDisk} label="Guardar" onclick={onSave} />
      </div>
    </div>
  </div>
{/if}

<style>
   .modal-overlay {
    align-items: center;
    background: #0003;
    display: flex;
    inset: 0;
    justify-content: center;
    position: fixed;
    z-index: 10;
  }

  .modal {
    background: #FFF;
    box-shadow: 0 4px 16px #000;
    display: flex;
    flex-direction: column;
    max-width: 50%;
    padding: 1em;
  }

  .actions {
    display: flex;
    gap: 1em;
    justify-content: space-between;
    margin-top: 1em;
  }
</style>