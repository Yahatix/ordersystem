<script lang="ts">
	import { getNotificationsContext } from 'svelte-notifications';
	import userStore, { type TOrder, orders } from '$lib/db';

	const { addNotification } = getNotificationsContext();

	export let item: TOrder['topping'];
	let order: TOrder | undefined;
	let extraWish: string;

	const sendOrderToKitchen = (item: TOrder['topping']) => {
		order = {
			done: false,
			type: 'Crepes',
			topping: item,
			extraWish
		} as TOrder;

		userStore.orders
			.create(order)
			.then(() => {
				userStore.orders.get().then((o) => {
					$orders = o as TOrder[];
				});
			})
			.then(() => {
				addNotification({
					text: 'Erfolgreich an Küche gesendet',
					type: 'success',
					position: 'bottom-center',
					removeAfter: 3000
				});
			})
			.catch((error) => {
				console.error(error);
				addNotification({
					text: 'Da ist etwas schief gegangen!',
					type: 'error',
					position: 'bottom-center'
				});
			});
		order = undefined;
	};
</script>

<div class="card w-96 bg-base-100 shadow-xl">
	<figure><img src={`/images/${item}_Crepes.jpg`} alt={item} width="384" height="384" /></figure>
	<div class="card-body">
		<h2 class="card-title">{item}</h2>
		<input
			bind:value={extraWish}
			class="input input-bordered"
			type="text"
			placeholder="Sonderwünsche"
		/>
		<button class="btn" on:click={() => sendOrderToKitchen(item)}>Bestellen</button>
	</div>
</div>
