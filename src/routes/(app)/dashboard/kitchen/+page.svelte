<script lang="ts">
	import Order from './Order.svelte';
	import { unfinishedOrders } from '$lib/dbAPI';
	import { flip } from 'svelte/animate';
</script>

<svelte:head>
	<title>Küche</title>
</svelte:head>

<div
	class="flex flex-wrap gap-3 pt-14"
	class:h-full={$unfinishedOrders.length < 1}
	class:justify-center={$unfinishedOrders.length < 1}
>
	{#each $unfinishedOrders as order (order.id)}
		<div animate:flip={{ duration: (d) => Math.sqrt(d) * 30 }}>
			<Order {order} />
		</div>
	{:else}
		<p class="w-full h-full self-center justify-self-center text-center text-6xl">
			Aktuell keine Bestellung
		</p>
	{/each}
</div>
