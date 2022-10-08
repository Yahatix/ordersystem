<script lang="ts">
	import { page } from '$app/stores';
	import db, { products, type Product } from '$lib/dbAPI';
	import { fly } from 'svelte/transition';

	const productId = $page.params.id;
	$: product = $products.find((p) => p.id === +productId) as Product;

	let public_image_path: string;
	$: {
		if (product) {
			public_image_path = db.products.getImage(product) || '';
		}
	}

	const updateProduct = async () => {
		db.products.update(product).then(() => (document.location.pathname = '/admin/products'));
	};
</script>

{#if product}
	<div class="flex h-full w-full flex-row items-center justify-center gap-4">
		<div class="card w-96 bg-base-100 shadow-xl">
			<figure><img src={public_image_path} alt={product.name} width="384" height="384" /></figure>
			<div class="card-body">
				<div class="form-control flex flex-col gap-2">
					{#if product.name !== ''}
						<label class="label" for="name" transition:fly={{ y: 50 }}>
							<span class="label-text">Produktname</span>
						</label>
					{/if}
					<input
						type="text"
						name="name"
						placeholder="Produktname"
						class="input input-bordered"
						bind:value={product.name}
					/>

					{#if product.price !== null}
						<label class="label" for="price" transition:fly={{ y: 50 }}>
							<span class="label-text">Preis</span>
						</label>
					{/if}
					<input
						type="number"
						name="price"
						placeholder="Preis"
						class="input input-bordered"
						bind:value={product.price}
					/>
					<div>
						<label class="label" for="active">
							<span class="label-text">Aktiv?</span>
						</label>
						<input
							class="toggle"
							type="checkbox"
							name="active"
							id="active"
							bind:checked={product.active}
						/>
					</div>
				</div>
				<button class="btn btn-success" on:click={updateProduct}>Speichern</button>
			</div>
		</div>
	</div>
{/if}
