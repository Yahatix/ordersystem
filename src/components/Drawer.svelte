<script lang="ts">
	import { fade } from 'svelte/transition';

	interface Props {
		open?: boolean;
		position?: 'left' | 'right';
		children?: import('svelte').Snippet;
		close?: () => void;
	}

	let { open = $bindable(false), position = 'left', children, close }: Props = $props();

	const closeDrawer = () => {
		open = false;
		close?.();
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
			<!-- svelte-ignore a11y_consider_explicit_label -->
			<button type="button" onclick={closeDrawer} class="cursor-pointer bg-gray-900/80"></button>
		{/if}
		<div class="h-screen w-full overflow-x-hidden overflow-y-auto bg-base-300">
			{@render children?.()}
		</div>
		{#if position === 'left'}
			<!-- svelte-ignore a11y_consider_explicit_label -->
			<button type="button" onclick={closeDrawer} class="cursor-pointer bg-gray-900/80"></button>
		{/if}
	</div>
{/if}
