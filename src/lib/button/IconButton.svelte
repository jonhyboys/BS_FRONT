
<script>
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  const {
    icon,
    label = '',
    size = '1x',
    onclick,
    disabled = false
  } = $props();
</script>


<button
  class="icon-button{disabled ? ' disabled' : ''}"
  aria-label={label}
  title={label}
  onclick={onclick}
>
  <FontAwesomeIcon {icon} size={size} />
</button>

<style>
.icon-button {
    background: transparent;
    border: none;
    color: #919191;
    cursor: pointer;
    padding: .5em;
}
.icon-button:hover {
   background: #D0D0D0;
   color: #333;
}
.icon-button.disabled { color: #DFDFDF; }
</style>