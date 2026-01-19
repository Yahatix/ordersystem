<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { page } from '$app/state';

	import { finishedOrders, total } from '$lib/dbAPI';

	import Drawer from './Drawer.svelte';
	import FinishedOrderMenuContent from './FinishedOrderMenuContent.svelte';
	import OrderMenuContent from './OrderMenuContent.svelte';

	let isOrderMenuOpen = $state(false);
	let isFinishedOrdersMenuOpen = $state(false);
	interface Props {
		isDrawerOpen?: boolean;
	}

	let { isDrawerOpen = $bindable(false) }: Props = $props();

	beforeNavigate(() => {
		isOrderMenuOpen = false;
		isOrderMenuOpen = false;
		isFinishedOrdersMenuOpen = false;
	});

	const openOrderMenu = () => {
		isDrawerOpen = true;
		isOrderMenuOpen = true;
	};

	const openFinishedOrderMenu = () => {
		isDrawerOpen = true;
		isFinishedOrdersMenuOpen = true;
	};

	const handleDrawerClose = () => {
		isOrderMenuOpen = false;
		isFinishedOrdersMenuOpen = false;
		isDrawerOpen = false;
	};
</script>

{#if page.route.id === '/(app)/dashboard/kasse'}
	<div class:blur-md={isDrawerOpen} class="gap-2 flex flex-wrap">
		<button class="btn" onclick={openOrderMenu}
			>Bestellung<span class="badge badge-success ml-1">{$total}</span></button
		>
		<button class="btn mr-20" onclick={openFinishedOrderMenu}
			>Fertig:<span class="badge badge-success ml-1">{$finishedOrders.length}</span></button
		>
	</div>
	<Drawer bind:open={isDrawerOpen} close={handleDrawerClose}>
		{#if isOrderMenuOpen}
			<OrderMenuContent close={handleDrawerClose} />
		{/if}
		{#if isFinishedOrdersMenuOpen}
			<FinishedOrderMenuContent />
		{/if}
	</Drawer>
{/if}
