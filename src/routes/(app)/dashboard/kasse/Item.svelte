<script lang="ts">
	import db, { type Product } from '$lib/dbAPI';
	import { curr_formatter } from '$lib/utils';
	import { currentOrder } from '$lib/stores';

	interface Props {
		product: Product;
	}

	let { product }: Props = $props();
	let extraWish = $state('');

	const addProductToCurrentOrder = () => {
		$currentOrder = [
			...$currentOrder,
			{
				product,
				extraWish
			}
		];
		
		extraWish = '';
	};
	// svelte-ignore state_referenced_locally
		const imageSrc = $state(db.products.getImage(product));
</script>

<div class="card w-96 bg-base-100 shadow-xl">
	<figure>
		<img src={imageSrc} alt={product.name} width="384" height="384" />
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
		<button class="btn" onclick={addProductToCurrentOrder}>Hinzufügen</button>
	</div>
</div>
