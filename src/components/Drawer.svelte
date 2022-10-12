<script lang="ts">
	import { fade } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	export let open = false;
	export let position: 'left' | 'right' = 'left';

	const closeDrawer = () => {
		open = false;
		dispatch('closed');
	};
</script>

{#if open}
	<div
		class="absolute top-0 left-0 z-20 grid h-screen w-screen"
		class:grid-cols-[minmax(160px,320px)_minmax(100px,1fr)]={position === 'left'}
		class:grid-cols-[minmax(100px,1fr)_minmax(160px,320px)]={position === 'right'}
		transition:fade={{ duration: 300 }}
	>
		{#if position === 'right'}
			<div on:click={closeDrawer} class="cursor-pointer bg-gray-900/80" />
		{/if}
		<div class="h-screen w-full overflow-y-auto overflow-x-hidden bg-base-300">
			<slot />
		</div>
		{#if position === 'left'}
			<div on:click={closeDrawer} class="cursor-pointer bg-gray-900/80" />
		{/if}
	</div>
{/if}
