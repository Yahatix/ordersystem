<script lang="ts">
	import db, { type TProduct } from '$lib/db';
	import {page} from "$app/stores"
	import { getNotificationsContext } from 'svelte-notifications';
	const { addNotification } = getNotificationsContext();

	let products: TProduct[] = [];
	const user = $page.data.session.user;

	const getProducts = async () => {
		products = (await db.products.getAll()) || [];
	};

	$: user && user.id && getProducts();

	let fileEl: HTMLInputElement;
	const uploadFile = () => {
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
	<input class="" bind:this={fileEl} type="file" name="" />
	<button class="btn" on:click={uploadFile}>Upload</button>
</div>

{#each products as product}
    <div>
        <div>{product.name}</div>
        <div>{product.price}</div>
        <img src={db.products.getImage(product.image_path)} alt="">
    </div>
{/each}