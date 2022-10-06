<script lang="ts">
	import { goto } from '$app/navigation';
	import db, { type TProduct } from '$lib/db';
	import { getNotificationsContext } from 'svelte-notifications';
	import { fly } from 'svelte/transition';
	const { addNotification } = getNotificationsContext();

	let product: TProduct = {
		active: false,
		name: '',
		price: 0,
        image_path: ''
	};
	let fileEl: HTMLInputElement;

    $: validProduct = product.name !== '' && product.price !== null

	const createProduct = () => {
        if (!fileEl.files) return;
        product.image_path = fileEl.files[0].name
		db.products.new(product);
        uploadImage()
        goto("/admin/products")
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

<div class="flex h-full flex-col items-center justify-center">
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
		<input type="number" name="price" placeholder="Preis" class="input input-bordered" bind:value={product.price}/>

		<div>
			<label class="label" for="active">
				<span class="label-text">Aktiv?</span>
			</label>
			<input class="input" type="checkbox" name="" id="" bind:value={product.active}/>
		</div>
		<input bind:this={fileEl} type="file" name="" />
        <button class="btn" class:btn-disabled={!validProduct} on:click={createProduct}>Neues Produkt anlegen</button>
	</div>
</div>
