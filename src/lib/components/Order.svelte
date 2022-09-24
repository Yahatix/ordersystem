<script lang="ts">
	import { fly } from 'svelte/transition';
	export let order: TOrder;
	import {orders, type TOrder} from '$lib/stores/orders.client';

	const finishOrder = () => {
		$orders = $orders.filter((o) => o.nr !== order.nr);
	};
</script>

<div transition:fly={{ x: -200 }} class="card mb-4 w-fit bg-primary-content shadow-xl">
	<div class="card-body">
		<div class="card-title">{order.type}</div>
		{order.nr} <br />
		{order.topping} <br />
		<button class="btn" on:click={finishOrder}>Crêpe fertiggestelt</button>
	</div>
</div>
