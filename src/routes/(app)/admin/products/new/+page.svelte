<script lang="ts">
	import { goto } from '$app/navigation';
	import db, { type ProductRequest } from '$lib/dbAPI';
	import { getNotificationsContext } from 'svelte-notifications';
	import { fly } from 'svelte/transition';
	const { addNotification } = getNotificationsContext();

	let product: ProductRequest = {
		active: false,
		name: '',
		price: 0,
		image_path: ''
	};
	let fileEl: HTMLInputElement;

	$: validProduct = product.name !== '' && product.price !== null;

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
				addNotification({
					text: res.error.message,
					type: 'error',
					position: 'bottom-center'
				});
				return;
			}
			addNotification({
				text: 'Datei erfolgreich hochgeladen',
				type: 'success',
				position: 'bottom-center',
				removeAfter: 2000
			});
		});
	};
</script>

<div class="mt-14 flex h-full flex-col items-center justify-center">
	<div class="form-control flex flex-col gap-2">
		{#if product.name !== ''}
			<label class="label" for="name" transition:fly={{ y: 50 }}>
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
			<input class="toggle" type="checkbox" id="active" bind:value={product.active} />
		</div>
		<label class="btn" for="image">Bild auswählen</label>
		<input class="hidden" bind:this={fileEl} type="file" id="image" accept="image/*" />
		<button class="btn" class:btn-disabled={!validProduct} on:click={createProduct}
			>Neues Produkt anlegen</button
		>
	</div>
</div>
