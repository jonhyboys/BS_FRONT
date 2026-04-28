<script>
  import SaleRow from '$lib/sales/SaleRow.svelte';

  let sales = [
    {
      id: 1,
      date: '2026-04-26T10:15:00',
      total: 150,
      baseTotalAmount: 130,
      baseTotalDiscount: 10,
      ivaAmount: 30,
      items: [
        { productName: 'Libro Svelte', quantity: 2, subTotal: 40 },
        { productName: 'Libro .NET', quantity: 1, subTotal: 60 }
      ]
    },
    {
      id: 2,
      date: '2026-04-26T12:40:00',
      total: 90,
      baseTotalAmount: 80,
      baseTotalDiscount: 0,
      ivaAmount: 10,
      items: [
        { productName: 'JavaScript Moderno', quantity: 1, subTotal: 30 },
        { productName: 'Aprendiendo React', quantity: 2, subTotal: 60 }
      ]
    },
    {
      id: 3,
      date: '2026-04-26T17:05:00',
      total: 45,
      baseTotalAmount: 40,
      baseTotalDiscount: 5,
      ivaAmount: 5,
      items: [
        { productName: 'Algoritmos y Estructuras', quantity: 1, subTotal: 45 }
      ]
    }
  ];
</script>

<h1>Ventas</h1>

{#each sales as sale}
  <SaleRow sale={sale} />
{/each}