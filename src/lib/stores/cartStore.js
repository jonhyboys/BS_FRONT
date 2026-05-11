import { writable } from 'svelte/store';

function createCartStore() {
  const { subscribe, set, update } = writable([]);

  return {
    subscribe,
    addItem: (item, forceNewLine = false) =>
      update((items) => {
        // Si forceNewLine es true, siempre agregar una nueva línea
        if (forceNewLine) {
          return [
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
          ];
        }

        // Si no, verificar si el producto ya existe
        const existingItem = items.find(
          (i) => i.productId === item.productId && i.price === item.price && i.discount === item.discount
        );

        if (existingItem) {
          // Si existe, sumar cantidades
          return items.map((i) =>
            i.id === existingItem.id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
        }

        // Si no existe, agregar como nueva línea
        return [
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
        ];
      }),
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
