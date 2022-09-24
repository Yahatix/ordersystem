<script lang="ts">
	import { onMount } from 'svelte';
	import Order from '$lib/components/Order.svelte';
	import { orders } from '$lib/stores/orders.client';

	onMount(() => {
		// wsc?.addEventListener('message', (event) => {
		// 	const order: Order = JSON.parse(event.data);
		// 	if (order) $orders = [...$orders, JSON.parse(event.data)];
		// });
	});
</script>

{#each $orders as order}
	<Order {order} />
{/each}
