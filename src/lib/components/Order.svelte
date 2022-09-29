<script lang="ts">
	import { scale } from 'svelte/transition';
	export let order: TOrder;
	import orderStore, { orders, type TOrder } from '$lib/db';

	const finishOrder = () => {
		orderStore.orders.finishOrder(order);
		$orders = $orders.filter((o) => o.nr !== order.nr);
	};
</script>

<div transition:scale class="card image-full mb-4 w-fit max-w-xs shadow-xl">
	<figure>
		<img src={`/images/${order.topping}_Crepes.jpg`} alt={order.topping} width="384" height="384" />
	</figure>
	<div class="card-body justify-between">
		<div class="rounded bg-base-content/60 p-2 text-base-200">
			<div class="card-title">{order.type}</div>
			<div>Nr: {order.nr}</div>
			<div>{order.topping}</div>
			{#if order.extraWish}
				<div>{order.extraWish}</div>
			{/if}
		</div>
		<div class="card-actions">
			<button class="btn btn-lg bg-base-content/80 text-base-200" on:click={finishOrder}
				>Crêpe fertiggestelt</button
			>
		</div>
	</div>
</div>
