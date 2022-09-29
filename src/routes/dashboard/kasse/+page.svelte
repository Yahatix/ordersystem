<script lang="ts">
	import Item from '$lib/components/Item.svelte';
	import type { TOrder } from '$lib/db';

	const toppings: TOrder['topping'][] = ['Schoko', 'Schoko+Banane', 'Apfelmus', 'Zimt+Zucker'];
</script>

<svelte:head>
	<title>Kasse</title>
</svelte:head>

<div
	style="background-image: radial-gradient(hsla(var(--bc)/.2) .5px,hsla(var(--b2)/1) .5px); background-size: 5px 5px;"
	class="pt-14 rounded-b-box border-base-300 bg-base-200 bg-top"
>
	<div class="flex flex-row flex-wrap gap-4 justify-center">
		{#each toppings as item}
			<Item {item} />
		{/each}
	</div>
</div>
