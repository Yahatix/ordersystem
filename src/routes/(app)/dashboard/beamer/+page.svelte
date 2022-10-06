<script lang="ts">
	import { unfinishedOrders } from '$lib/db';
	import BeamerOrder from './BeamerOrder.svelte';
</script>

<div class="flex h-full w-full flex-row">
	<div class="w-1/2 flex items-center flex-col">Werbeblock</div>
	<div class="w-1/2 flex items-center flex-col">
		{#each $unfinishedOrders as order}
			<BeamerOrder {order} />
		{/each}
	</div>
</div>
