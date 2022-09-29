<script lang="ts">
	import { onMount } from 'svelte';
	import Order from '$lib/components/Order.svelte';
	import db, { orders } from '$lib/db';

	onMount(async () => {
		$orders = await db.orders.get();
	});
</script>

<svelte:head>
	<title>Küche</title>
</svelte:head>

<div class="flex flex-wrap gap-3" class:h-full={$orders.length < 1}>
	{#each $orders as order (order.nr)}
		<Order {order} />
	{:else}
		<p class="w-full self-center justify-self-center text-center text-6xl">
			Aktuell keine Bestellung
		</p>
	{/each}
</div>
