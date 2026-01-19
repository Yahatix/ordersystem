<script lang="ts">
	import { goto } from '$app/navigation';
	import db, { type ProductRequest } from '$lib/dbAPI';
	import { toast } from 'svelte-sonner';
	import { fly } from 'svelte/transition';

	let product: ProductRequest = $state({
		active: false,
		name: '',
		price: 0,
		image_path: ''
	});
	let fileEl: HTMLInputElement = $state();

	let validProduct = $derived(product.name !== '' && product.price !== null);

	const createProduct = () => {
		if (!fileEl.files) return;
		product.image_path = fileEl.files[0].name;
		db.products.new(product);
		uploadImage();
		goto('/admin/products');
	};

	const uploadImage = () => {
		if (!fileEl.files) return;
		db.products.uploadImage(fileEl.files[0]).then((res) => {
			if (res.error) {
				toast.error(res.error.message);
				return;
			}
			toast.success('Datei erfolgreich hochgeladen', {
				duration: 2000
			});
		});
	};
</script>

<div class="mt-14 flex h-full flex-col items-center justify-center">
	<div class="form-control gap-2 flex flex-col">
		{#if product.name !== ''}
			<label class="label" for="name" transition:fly|global={{ y: 50 }}>
				<span class="label-text">Produktname</span>
			</label>
		{/if}
		<input
			type="text"
			id="name"
			placeholder="Produktname"
			class="input input-bordered"
			bind:value={product.name}
		/>

		<div class="form-control">
			<label class="input-group">
				<span>Preis</span>
				<input
					type="number"
					placeholder="1"
					step="0.5"
					min="0"
					class="input input-bordered"
					bind:value={product.price}
				/>
				<span>EUR</span>
			</label>
		</div>

		<div>
			<label class="label" for="active">
				<span class="label-text">Aktiv?</span>
			</label>
			<input class="toggle" type="checkbox" id="active" bind:checked={product.active} />
		</div>
		<label class="btn" for="image">Bild auswählen</label>
		<input class="hidden" bind:this={fileEl} type="file" id="image" accept="image/*" />
		<button class="btn" class:btn-disabled={!validProduct} onclick={createProduct}
			>Neues Produkt anlegen</button
		>
	</div>
</div>
