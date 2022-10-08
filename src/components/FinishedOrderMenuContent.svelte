<script lang="ts">
	import db, { finishedOrders, type Order } from '$lib/dbAPI';

	export let isFinishedOrderMenuOpen = false;

	const sendOrderToKitchen = (order: Order) => {
		db.orders.deliverOrder(order);
		isFinishedOrderMenuOpen = false;
	};
</script>

<div class="flex flex-col gap-2 overflow-y-auto">
	<div class="border-b-4 border-slate-500 p-4">
		<p class="text-xl font-bold">Fertige Bestellungen:</p>
	</div>
	<div class="flex flex-col gap-2 px-4">
		{#each $finishedOrders as order, index}
			<div class="flex justify-between w-full items-center gap-2">
				<p class="w-full text-center font-bold text-xl">{order.id}</p>
				<button on:click={() => sendOrderToKitchen(order)} class="btn btn-success w-40">Abgeholt</button>
			</div>
			{#if $finishedOrders.length !== index + 1}
				<hr class="rounded-full border-t-2 border-slate-500" />
			{:else}
				<div class="mb-2" />
			{/if}
		{/each}
	</div>
</div>
