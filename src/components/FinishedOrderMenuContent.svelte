<script lang="ts">
	import db, { finishedOrders, type Order } from '$lib/dbAPI';

	interface Props {
		isFinishedOrdersMenuOpen?: boolean;
	}

	let { isFinishedOrdersMenuOpen = $bindable(false) }: Props = $props();

	const sendOrderToKitchen = (order: Order) => {
		db.orders.deliverOrder(order);
		isFinishedOrdersMenuOpen = false;
	};
</script>

<div class="flex flex-col gap-2 overflow-y-auto">
	<div class="border-b-4 border-slate-500 p-4">
		<p class="text-xl font-bold">Fertige Bestellungen:</p>
	</div>
	<div class="flex flex-col gap-2 px-4">
		{#each $finishedOrders as order, index}
			<div class="flex w-full items-center justify-between gap-2">
				<p class="w-full text-center text-xl font-bold">{order.id}</p>
				<button onclick={() => sendOrderToKitchen(order)} class="btn w-40 btn-success"
					>Abgeholt</button
				>
			</div>
			{#if $finishedOrders.length !== index + 1}
				<hr class="rounded-full border-t-2 border-slate-500" />
			{:else}
				<div class="mb-2"></div>
			{/if}
		{/each}
	</div>
</div>
