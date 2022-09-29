<script lang="ts">
	import orderStore, { orders } from '$lib/db';

	orderStore.orders.getAll().then((res) => ($orders = res));

	$: stats = [
		...$orders.reduce<Map<string, number>>((curr, val) => {
			const toppingStats = curr.get(val.topping) || 0;
			curr.set(val.topping, toppingStats + 1);
			return curr;
		}, new Map())
	].sort((a, b) => {
		if (a[1] > b[1]) return -1;
		if (a[1] < b[1]) return 1;
		return 0;
	});
</script>

<div class="flex h-full items-center justify-center">
	<div class="flex flex-col text-2xl">
		{#each stats as stat}
			<p>{stat[0]}: {stat[1]}</p>
		{/each}
	</div>
</div>
