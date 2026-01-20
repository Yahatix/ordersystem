<script lang="ts">
	import { crossfade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { flip } from 'svelte/animate';
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import Autoplay from 'embla-carousel-autoplay';

	import { finishedOrders, unfinishedOrders } from '$lib/dbAPI';

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

	const options = {
		options: { loop: true },
		plugins: [Autoplay({ playOnInit: true })]
	};

	const images = [
		'https://placehold.co/400x800/orange/white?text=Werbung+1',
		'https://placehold.co/600x400?text=Werbung+2',
		'https://placehold.co/600x400?text=Werbung+3',
		'https://placehold.co/600x400?text=Werbung+4'
	];
</script>

<div class="grid h-full w-full grid-cols-2 gap-2">
	<div class="flex h-full w-full items-center justify-center">
		<!-- Werbeblock -->
		<div class="embla overflow-hidden" use:emblaCarouselSvelte={options}>
			<div class="embla__container flex items-center">
				{#each images as image}
					<div class="embla__slide flex min-w-0 flex-[0_0_100%] justify-center">
						<img class="max-h-[calc(100vh-32px)]" src={image} alt="" />
					</div>
				{/each}
			</div>
		</div>
	</div>
	<div class="grid grid-cols-2 justify-center gap-2">
		<div class="flex flex-col items-center gap-2">
			<h2 class="mb-2 text-center text-3xl font-bold underline">In bearbeitung</h2>
			{#each $unfinishedOrders as order (order.id)}
				<div
					in:receive|global={{ key: order.id }}
					out:send|global={{ key: order.id }}
					animate:flip
					class="w-fit max-w-xs min-w-40 rounded-lg bg-amber-500 p-2 text-center text-3xl font-bold"
				>
					{order.id}
				</div>
			{/each}
		</div>
		<div class="flex flex-col items-center gap-2">
			<h2 class="mb-2 text-center text-3xl font-bold underline">Abholbereit</h2>
			{#each $finishedOrders as order (order.id)}
				<div
					in:receive|global={{ key: order.id }}
					out:send|global={{ key: order.id }}
					animate:flip
					class="w-fit max-w-xs min-w-40 rounded-lg bg-green-500 p-2 text-center text-3xl font-bold"
				>
					{order.id}
				</div>
			{/each}
		</div>
	</div>
</div>
