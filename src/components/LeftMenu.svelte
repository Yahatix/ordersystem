<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { page } from '$app/stores';

	import { finishedOrders, total } from '$lib/dbAPI';

	import Drawer from './Drawer.svelte';
	import FinishedOrderMenuContent from './FinishedOrderMenuContent.svelte';
	import OrderMenuContent from './OrderMenuContent.svelte';

	let isOrderMenuOpen = false;
	let isFinishedOrdersMenuOpen = false;
	export let isDrawerOpen = false;

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

{#if $page.routeId === '(app)/dashboard/kasse'}
	<div class:blur-md={isDrawerOpen}>
		<button class="btn" on:click={openOrderMenu}
			>Bestellung<span class="badge badge-success ml-1">{$total}</span></button
		>
		<button class="btn" on:click={openFinishedOrderMenu}
			>Fertig:<span class="badge badge-success ml-1">{$finishedOrders.length}</span></button
		>
	</div>
	<Drawer bind:open={isDrawerOpen} on:closed={handleDrawerClose}>
		{#if isOrderMenuOpen}
			<OrderMenuContent on:close={handleDrawerClose} />
		{/if}
		{#if isFinishedOrdersMenuOpen}
			<FinishedOrderMenuContent />
		{/if}
	</Drawer>
{/if}
