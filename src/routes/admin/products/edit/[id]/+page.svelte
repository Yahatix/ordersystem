<script lang="ts">
	import { page } from '$app/stores';
	import { products } from '$lib/db';
	import Product from '../../Product.svelte';
	const productId = $page.params.id;
	const product = $products.find((p) => p.id === +productId);
</script>

<div class="flex h-full w-full flex-row items-center justify-center gap-4">
	{#if product}
		<Product {product} />
	{/if}
</div>
