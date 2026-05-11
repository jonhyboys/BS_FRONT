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
    align-items: center;
    display: flex;
    flex-shrink: 0;
    font-size: 3em;
    height: 80px;
    justify-content: center;
    width: 80px;
  }

  .content { flex: 1;}
</style>