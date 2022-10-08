<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import { getNotificationsContext } from 'svelte-notifications';
	const { addNotification } = getNotificationsContext();

	import { currentOrder } from '$lib/stores';
	import db, { total } from '$lib/dbAPI';

	const dispatch = createEventDispatcher();

	$: sortedOrder = $currentOrder.sort((a, b) => {
		if (a.product.name === b.product.name) return 0;
		return a.product.name < b.product.name ? -1 : 1;
	});

	const sendOrderToKitchen = () => {
		db.orders
			.create($currentOrder)
			.then((res) => {
				addNotification({
					text: `Bestellung: ${res?.id} Erfolgreich an Küche gesendet`,
					type: 'success',
					position: 'bottom-center',
					removeAfter: 5000
				});
			})
			.catch((error) => {
				console.error(error);
				addNotification({
					text: 'Da ist etwas schief gegangen!' + error,
					type: 'error',
					position: 'bottom-center'
				});
			})
			.then(() => {
				$currentOrder = [];
				dispatch('close');
			});
	};
</script>

<div class="flex h-full flex-col justify-between">
	<div class="flex flex-col gap-2 overflow-y-auto">
		<div class="border-b-4 border-slate-500 p-4">
			<p class="text-xl font-bold">Bestellung:</p>
		</div>
		<div class="flex flex-col gap-2 px-4">
			{#each sortedOrder as order, index}
				<div>
					<p>{order.product.name}</p>
					{#if order.extraWish}
						<p>Extra: {order.extraWish}</p>
					{/if}
				</div>
				{#if $currentOrder.length !== index + 1}
					<hr class="rounded-full border-t-2 border-slate-500" />
				{:else}
					<div class="mb-2" />
				{/if}
			{/each}
		</div>
	</div>
	<div class="mb-4 border-t-2 border-slate-500 px-4">
		<p class="my-2 text-xl font-bold">Total: {$total}</p>
		<button on:click={sendOrderToKitchen} class="btn btn-success w-full">Jetzt Bestellen</button>
	</div>
</div>
