<div class="item">
  <div class="image">
    <slot name="image" />
  </div>
  <div class="content">
    <slot name="content" />
  </div>
  <div class="actions">
    <slot name="actions" />
  </div>  
</div>

<style>
  .item {
    align-items: flex-start;
    background: #FFF;
    border: 1px solid #DADADA;
    display: flex;
    gap: 12px;
    padding: .5em;
  }

  .image {
    width: 80px;
    height: 80px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .content { flex: 1;}
</style>