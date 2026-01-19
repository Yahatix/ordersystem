<script lang="ts">
	import { toast } from 'svelte-sonner';

	import { currentOrder } from '$lib/stores';
	import db, { total } from '$lib/dbAPI';
	import OrderSuccessToast from './OrderSuccessToast.svelte';

	const { close } = $props();

	let sortedOrder = $derived(
		$currentOrder.sort((a, b) => {
			if (a.product.name === b.product.name) return 0;
			return a.product.name < b.product.name ? -1 : 1;
		})
	);

	const sendOrderToKitchen = () => {
		db.orders
			.create($currentOrder)
			.then((res) => {
				if (!res) throw new Error('No response from server');
				toast.success(OrderSuccessToast, { componentProps: { id: res.id } });
			})
			.catch((error) => {
				console.error(error);
				toast.error('Da ist etwas schief gegangen!' + error);
			})
			.then(() => {
				$currentOrder = [];
				close();
			});
	};
</script>

<div class="flex h-full flex-col justify-between">
	<div class="gap-2 flex flex-col overflow-y-auto">
		<div class="border-slate-500 p-4 flex items-center justify-between border-b-4">
			<p class="text-xl font-bold">Bestellung:</p>
			<button class="btn" onclick={() => close()}>X</button>
		</div>
		<div class="gap-2 px-4 flex flex-col">
			{#each sortedOrder as order, index}
				<div>
					<p>{order.product.name}</p>
					{#if order.extraWish}
						<p>Extra: {order.extraWish}</p>
					{/if}
				</div>
				{#if $currentOrder.length !== index + 1}
					<hr class="border-slate-500 rounded-full border-t-2" />
				{:else}
					<div class="mb-2"></div>
				{/if}
			{/each}
		</div>
	</div>
	<div class="mb-4 border-slate-500 px-4 border-t-2">
		<p class="my-2 text-xl font-bold">Total: {$total}</p>
		<button onclick={sendOrderToKitchen} class="btn btn-success w-full">Jetzt Bestellen</button>
	</div>
</div>
