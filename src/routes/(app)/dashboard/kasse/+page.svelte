<script lang="ts">
	import Item from './Item.svelte';
	import { activeProducts } from '$lib/dbAPI';
</script>

<svelte:head>
	<title>Kasse</title>
</svelte:head>

<div class="flex flex-row flex-wrap justify-center gap-4 pt-8">
	{#each $activeProducts as product (product.id)}
		<Item {product} />
	{/each}
</div>
