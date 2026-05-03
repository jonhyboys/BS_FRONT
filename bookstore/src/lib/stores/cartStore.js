import { writable } from 'svelte/store';

function createCartStore() {
  const { subscribe, set, update } = writable([]);

  return {
    subscribe,
    addItem: (item) =>
      update((items) => [
        ...items,
        {
          id: Date.now(),
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount,
          iva: item.iva
        }
      ]),
    updateItem: (itemId, updates) =>
      update((items) =>
        items.map((item) => (item.id === itemId ? { ...item, ...updates } : item))
      ),
    removeItem: (itemId) =>
      update((items) => items.filter((item) => item.id !== itemId)),
    clear: () => set([]),
    getCartData: () => {
      let data;
      subscribe((items) => {
        data = items;
      })();
      return data;
    }
  };
}

export const cart = createCartStore();
