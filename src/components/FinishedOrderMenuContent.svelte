<script lang="ts">
	import db, { finishedOrders, type Order } from '$lib/dbAPI';

	interface Props {
		isFinishedOrderMenuOpen?: boolean;
	}

	let { isFinishedOrderMenuOpen = $bindable(false) }: Props = $props();

	const sendOrderToKitchen = (order: Order) => {
		db.orders.deliverOrder(order);
		isFinishedOrderMenuOpen = false;
	};
</script>

<div class="gap-2 flex flex-col overflow-y-auto">
	<div class="border-slate-500 p-4 border-b-4">
		<p class="text-xl font-bold">Fertige Bestellungen:</p>
	</div>
	<div class="gap-2 px-4 flex flex-col">
		{#each $finishedOrders as order, index}
			<div class="gap-2 flex w-full items-center justify-between">
				<p class="font-bold text-xl w-full text-center">{order.id}</p>
				<button onclick={() => sendOrderToKitchen(order)} class="btn btn-success w-40"
					>Abgeholt</button
				>
			</div>
			{#if $finishedOrders.length !== index + 1}
				<hr class="border-slate-500 rounded-full border-t-2" />
			{:else}
				<div class="mb-2"></div>
			{/if}
		{/each}
	</div>
</div>
