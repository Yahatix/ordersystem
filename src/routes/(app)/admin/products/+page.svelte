<script lang="ts">
	import { products } from '$lib/dbAPI';
	import Product from './Product.svelte';
</script>

<div class="mt-14 flex h-full w-full flex-row flex-wrap items-center justify-center gap-4">
	{#each $products as product}
		<Product {product} />
	{/each}
</div>
