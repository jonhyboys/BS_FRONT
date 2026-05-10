
<script>
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  const {
    icon,
    label = '',
    variant = 'default',
    disabled = false,
    onclick
  } = $props();
</script>


<button
  class="icon-button {variant}"
  disabled={disabled}
  aria-label={label}
  title={label}
  onclick={onclick}
>
  <FontAwesomeIcon {icon} />
</button>

<style>
.icon-button {
    background: transparent;
    border: none;
    color: #FFF;
    cursor: pointer;
    padding: .5em;
}

.icon-button:hover { background: #f0f0f0; }

.icon-button:disabled {
  opacity: .5;
  cursor: not-allowed;
}

.primary { color: #0f3496; }

.primary:hover {
    background: #0f3496;
    color: #F1F1F1;
}

.danger { color: #c0392b; }

.danger:hover { 
    background: #c0392b;
    color: #F1F1F1;
}
</style>