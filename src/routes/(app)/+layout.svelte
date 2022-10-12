<script lang="ts">
	import { page } from '$app/stores';
	import { invalidateAll } from '$app/navigation';

	import { startSupabaseSessionSync } from '@supabase/auth-helpers-sveltekit';
	import Notifications from 'svelte-notifications';

	import '../../app.css';
	import '$lib/db';
	import LeftMenu from '$components/LeftMenu.svelte';
	import NavigationMenu from '$components/NavigationMenu.svelte';
	import Noti from '$components/Noti.svelte';

	startSupabaseSessionSync({
		page,
		handleRefresh: () => invalidateAll()
	});

	let isDrawerOpen = false;
	let isMenuOpen = false;
</script>

<svelte:head>
	<title>Ich Glaub's</title>
</svelte:head>

<Notifications item={Noti}>
	<div
		style="background-image: radial-gradient(hsla(var(--bc)/.2) .5px,hsla(var(--b2)/1) .5px); background-size: 5px 5px;"
		class="min-h-full w-full bg-base-200 bg-top p-4"
		class:h-full={$page.routeId === '(app)/dashboard'}
	>
		{#if $page.data.session.user?.id}
			<LeftMenu bind:isDrawerOpen />
			<NavigationMenu bind:isMenuOpen />
		{/if}
		<div class="h-full" class:blur-md={isDrawerOpen} class:overflow-hidden={isDrawerOpen} class:max-h-[calc(100vh-80px)]={isDrawerOpen}>
			<slot />
		</div>
	</div>
</Notifications>
