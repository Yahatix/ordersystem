<script lang="ts">
	import { scale } from 'svelte/transition';
	import orderStore, { type TOrder } from '$lib/db';
	import db from '$lib/db';

	export let order: TOrder;
	
	const finishOrder = () => orderStore.orders.finishOrder(order);
</script>

	<div transition:scale class="card image-full mb-4 w-fit max-w-xs shadow-xl">
		<figure>
			<img
				src={db.products.getImage(order.product.image_path)}
				alt={order.product.name}
				width="384"
				height="384"
			/>
		</figure>
		<div class="card-body justify-between">
			<div class="rounded bg-base-content/60 p-2 text-base-200">
				<div class="card-title">{order.product.name}</div>
				<div>Nr: {order.id}</div>
				{#if order.extraWish}
					<div>{order.extraWish}</div>
				{/if}
			</div>
			<div class="card-actions">
				<button class="btn btn-lg glass" on:click={finishOrder}
					>Crêpe fertiggestelt</button
				>
			</div>
		</div>
	</div>
