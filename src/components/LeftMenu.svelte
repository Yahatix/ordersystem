<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { page } from '$app/state';

	import { finishedOrders, total } from '$lib/dbAPI';

	import Drawer from '$components/Drawer.svelte';
	import FinishedOrderMenuContent from '$components/FinishedOrderMenuContent.svelte';
	import OrderMenuContent from '$components/OrderMenuContent.svelte';

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
	<div class:blur-md={isDrawerOpen} class="flex flex-wrap gap-2">
		<button class="btn" onclick={openOrderMenu}
			>Bestellung<span class="ml-1 badge badge-success">{$total}</span></button
		>
		<button class="btn mr-20" onclick={openFinishedOrderMenu}
			>Fertig:<span class="ml-1 badge badge-success">{$finishedOrders.length}</span></button
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
