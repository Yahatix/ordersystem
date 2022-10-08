<script lang="ts">
	import db, { type Product } from '$lib/dbAPI';
	import { curr_formatter } from '$lib/utils';
	import { currentOrder } from '$lib/stores';

	export let product: Product;
	let extraWish: string = '';

	const sendOrderToKitchen = () => {
		$currentOrder = [
			...$currentOrder,
			{
				product,
				extraWish
			}
		];
		extraWish = '';
	};
</script>

<div class="card w-96 bg-base-100 shadow-xl">
	<figure>
		<img src={db.products.getImage(product)} alt={product.name} width="384" height="384" />
	</figure>
	<div class="card-body">
		<h2 class="card-title">{product.name}</h2>
		<p>{curr_formatter.format(product.price)}</p>
		<input
			bind:value={extraWish}
			class="input input-bordered"
			type="text"
			placeholder="Sonderwünsche"
		/>
		<button class="btn" on:click={sendOrderToKitchen}>Bestellen</button>
	</div>
</div>
