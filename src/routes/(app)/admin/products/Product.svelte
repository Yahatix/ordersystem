<script lang="ts">
	import db, { type Product } from '$lib/dbAPI';
	import { curr_formatter } from '$lib/utils';

	export let product: Product;

	const public_image_path = db.products.getImage(product);

	const handleToggleActive = () => {
		product.active = !product.active;
		db.products.update(product);
	};
</script>

<div class="card w-96 bg-base-100 shadow-xl">
	<figure><img src={public_image_path} alt={product.name} width="384" height="384" /></figure>
	<div class="card-body">
		<h2 class="card-title">{product.name}</h2>
		<p>{curr_formatter.format(product.price)}</p>
		<button
			class="btn"
			class:btn-success={!product.active}
			class:btn-error={product.active}
			on:click={handleToggleActive}>{product.active ? 'Deaktivieren' : 'Aktivieren'}</button
		>
		<a class="btn" href={`/admin/products/edit/${product.id}`}>Bearbeiten</a>
	</div>
</div>
