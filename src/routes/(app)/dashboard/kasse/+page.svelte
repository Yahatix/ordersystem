<script lang="ts">
	import Item from './Item.svelte';
	import { products } from '$lib/db';
</script>

<svelte:head>
	<title>Kasse</title>
</svelte:head>

<div
	style="background-image: radial-gradient(hsla(var(--bc)/.2) .5px,hsla(var(--b2)/1) .5px); background-size: 5px 5px;"
	class="rounded-b-box border-base-300 bg-base-200 bg-top pt-14"
>
	<div class="flex flex-row flex-wrap justify-center gap-4">
		{#each $products as product}
			<Item {product} />
		{/each}
	</div>
</div>
