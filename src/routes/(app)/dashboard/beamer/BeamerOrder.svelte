<script lang="ts">
	import { scale } from 'svelte/transition';
	import type { TOrder } from '$lib/db';

	export let order: TOrder;
</script>

<div
	transition:scale
	class="bordered mb-4 w-fit max-w-xs rounded-lg border-4 border-slate-400 bg-base-200 p-4 shadow-xl"
>
	<div class="text-xl font-bold">{order.product.name}</div>
	{#if order.extraWish}
		<div>{order.extraWish}</div>
	{/if}
	<div class="font-bold">Nr: {order.id}</div>
</div>
