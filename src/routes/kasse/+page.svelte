<script lang="ts">
	import { orders, type TOrder } from "$lib/stores/orders.client";
	import { wsc } from '$lib/ws-client';

	let order: TOrder | undefined;

	const sendOrderToKitchen = () => {
		order = {
			nr: $orders.length,
      done: false,
			type: 'Crepes',
      topping: 'Apfelmus'
		};
		wsc?.send(JSON.stringify(order));
    $orders = [...$orders, order]
		order = undefined;
	};
</script>

<div style="background-image: radial-gradient(hsla(var(--bc)/.2) .5px,hsla(var(--b2)/1) .5px); background-size: 5px 5px;" class="bg-top bg-base-200 border-base-300 rounded-b-box">
	<div class="flex flex-col">
		{#each ["Schoko","Banana","Zimt+Zucker","Apfelmus"] as item}
    <div class="card w-96 bg-base-100 shadow-xl">
			<figure><img src={`/images/${item}_Crepes.png`} alt={item} /></figure>
			<div class="card-body">
				<h2 class="card-title">{item}</h2>
			</div>
		</div>
    {/each}
		<div>Schoko+Banane</div>
		<div>Zimt+Zucker</div>
		<div>Apfelmus</div>
		<input class="input input-bordered" type="text" placeholder="Sonderwünsche" />
		<button class="btn" on:click={sendOrderToKitchen}>An Küche senden</button>
	</div>
</div>
