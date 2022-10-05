<script lang="ts">
	import { products } from '$lib/db';
	import Product from './Product.svelte';
</script>

<div class="flex h-full w-full flex-row gap-4 items-center justify-center">
	{#each $products as product}
		<Product {product} />
	{/each}
</div>
