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
    display: flex;
    gap: 12px;
    padding: 10px;
    border: 1px solid #ccc;
    background: white;
    align-items: flex-start;
  }

  .image {
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .content {
    flex: 1;
  }

  .actions {
    display: flex;
    gap: 6px;
  }
</style>