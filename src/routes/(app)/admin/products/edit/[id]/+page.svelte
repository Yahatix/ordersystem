<script lang="ts">
	import { page } from '$app/state';
	import db, { products } from '$lib/dbAPI';
	import { fly } from 'svelte/transition';

	const productId = page.params.id;
	let product = productId ? $products.find((p) => p.id === +productId) : undefined;

	const updateProduct = async () => {
		if (!product) return;
		db.products.update(product).then(() => (document.location.pathname = '/admin/products'));
	};
</script>

{#if product}
	<div class="gap-4 flex h-full w-full flex-row items-center justify-center">
		<div class="card w-96 bg-base-100 shadow-xl">
			<figure>
				<img src={db.products.getImage(product)} alt={product.name} width="384" height="384" />
			</figure>
			<div class="card-body">
				<div class="form-control gap-2 flex flex-col">
					{#if product.name !== ''}
						<label class="label" for="name" transition:fly|global={{ y: 50 }}>
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
						<label class="label" for="price" transition:fly|global={{ y: 50 }}>
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
				<button class="btn btn-success" onclick={updateProduct}>Speichern</button>
			</div>
		</div>
	</div>
{/if}
