<script lang="ts">
	import { products } from '$lib/dbAPI';
	import Product from './Product.svelte';
</script>

<div class="mt-14 gap-4 flex h-full w-full flex-row flex-wrap items-center justify-center">
	{#each $products as product}
		<Product {product} />
	{/each}
</div>
