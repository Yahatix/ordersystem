<script lang="ts">
	import { products } from '$lib/dbAPI';
	import Product from './Product.svelte';
</script>

<div class="flex h-full w-full flex-row items-center justify-center gap-4 mt-14">
	{#each $products as product}
		<Product {product} />
	{/each}
</div>
