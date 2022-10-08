<script lang="ts">
	import { finishedOrders, unfinishedOrders } from '$lib/dbAPI';
	import { crossfade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { flip } from 'svelte/animate';

	const [send, receive] = crossfade({
		fallback(node) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 600,
				easing: quintOut,
				css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		}
	});
</script>

<div class="flex h-full w-full flex-row">
	<div class="flex w-1/2 flex-col items-center">Werbeblock</div>
	<div class="flex w-1/2 flex-row justify-center gap-2">
		<div class="flex w-1/2 flex-col items-center gap-2">
			<h2 class="text-center text-xl font-bold underline">In bearbeitung</h2>
			{#each $unfinishedOrders as order (order.id)}
				<div
					in:receive={{ key: order.id }}
					out:send={{ key: order.id }}
					animate:flip
					class="w-fit min-w-[10rem] max-w-xs rounded-lg bg-amber-500 p-2 text-center text-3xl font-bold"
				>
					{order.id}
				</div>
			{/each}
		</div>
		<div class="flex w-1/2 flex-col  items-center gap-2">
			<h2 class="text-center text-xl font-bold underline">Abholbereit</h2>
			{#each $finishedOrders as order (order.id)}
				<div
					in:receive={{ key: order.id }}
					out:send={{ key: order.id }}
					animate:flip
					class="w-fit min-w-[10rem] max-w-xs rounded-lg bg-green-500 p-2 text-center text-3xl font-bold"
				>
					{order.id}
				</div>
			{/each}
		</div>
	</div>
</div>
