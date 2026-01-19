<script lang="ts">
	import '../../app.css';
	import { page } from '$app/state';
	import { Toaster } from 'svelte-sonner';
	import LeftMenu from '$components/LeftMenu.svelte';
	import NavigationMenu from '$components/NavigationMenu.svelte';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';

	let { children, data } = $props();
	let { supabase, session } = $derived(data);

	let isDrawerOpen = $state(false);
	let isMenuOpen = $state(false);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => data.subscription.unsubscribe();
	});
</script>

<svelte:head>
	<title>Ich Glaub's</title>
</svelte:head>

<Toaster richColors position="bottom-center" duration={5000} />
<div
	style="background-image: radial-gradient(hsla(var(--bc)/.2) .5px,hsla(var(--b2)/1) .5px); background-size: 5px 5px;"
	class="bg-base-200 p-4 min-h-full w-full bg-top"
	class:h-full={page.route.id === '/(app)/dashboard'}
>
	{#if data.session?.user?.id}
		<LeftMenu bind:isDrawerOpen />
		<NavigationMenu bind:isMenuOpen />
	{/if}
	<div
		class="h-full"
		class:blur-md={isDrawerOpen}
		class:overflow-hidden={isDrawerOpen}
		class:max-h-[calc(100vh-80px)]={isDrawerOpen}
	>
		{@render children?.()}
	</div>
</div>
