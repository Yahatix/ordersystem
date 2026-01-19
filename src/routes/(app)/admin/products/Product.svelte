<script lang="ts">
	import db, { type Product } from '$lib/dbAPI';
	import { curr_formatter } from '$lib/utils';

	interface Props {
		product: Product;
	}

	let { product = $bindable() }: Props = $props();
	const imageSrc = db.products.getImage(product);

	const handleToggleActive = () => {
		product.active = !product.active;
		db.products.update(product);
	};
</script>

<div class="card w-96 bg-base-100 shadow-xl">
	<figure><img src={imageSrc} alt={product.name} width="384" height="384" /></figure>
	<div class="card-body">
		<h2 class="card-title">{product.name}</h2>
		<p>{curr_formatter.format(product.price)}</p>
		<button
			class="btn"
			class:btn-success={!product.active}
			class:btn-error={product.active}
			onclick={handleToggleActive}>{product.active ? 'Deaktivieren' : 'Aktivieren'}</button
		>
		<a class="btn" href={`/admin/products/edit/${product.id}`}>Bearbeiten</a>
	</div>
</div>
