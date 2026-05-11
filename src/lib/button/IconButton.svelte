
<script>
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  const {
    icon,
    label = '',
    size = '1x',
    onclick
  } = $props();
</script>


<button
  class="icon-button"
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
    color: #AAA;
    cursor: pointer;
    padding: .5em;
}
.icon-button:hover {
   background: #D0D0D0;
   color: #333;
}
</style>