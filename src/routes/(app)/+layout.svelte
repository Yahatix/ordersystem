<script lang="ts">
	import { page } from '$app/stores';
	import { invalidateAll, beforeNavigate } from '$app/navigation';
	import { applyAction, enhance, type SubmitFunction } from '$app/forms';

	import IoIosLogOut from 'svelte-icons/io/IoIosLogOut.svelte';
	import { startSupabaseSessionSync } from '@supabase/auth-helpers-sveltekit';
	import Notifications from 'svelte-notifications';

	import '../../app.css';
	import '$lib/db';

	startSupabaseSessionSync({
		page,
		handleRefresh: () => invalidateAll()
	});

	let isMenuOpen = false;

	beforeNavigate(() => {
		isMenuOpen = false;
	});

	const logout: SubmitFunction = () => {
		return async ({ result }) => {
			await invalidateAll();
			applyAction(result);
		};
	};
</script>

<svelte:head>
	<title>Ich Glaub's</title>
</svelte:head>

<Notifications>
	{#if $page.data.session.user}
		<div class="drawer drawer-end">
			<input type="checkbox" id="my-drawer" class="drawer-toggle" bind:checked={isMenuOpen} />
			<div class="drawer-content">
				<label for="my-drawer" class="btn drawer-button absolute top-4 right-4 px-12">Menü</label>
				<div
					style="background-image: radial-gradient(hsla(var(--bc)/.2) .5px,hsla(var(--b2)/1) .5px); background-size: 5px 5px;"
					class="h-screen min-h-screen w-full bg-base-200 bg-top p-4"
				>
					<slot />
				</div>
			</div>
			<div class="drawer-side">
				<label for="my-drawer" class="drawer-overlay" />
				<ul class="menu w-80 overflow-y-auto bg-base-100 p-4 text-base-content">
					<div class="flex h-full w-full flex-col justify-between">
						<div>
							<li>
								<a href="/">Home</a>
								<ul class="menu menu-compact">
									<li><a href="/dashboard/kasse" class="pl-8">Kasse</a></li>
									<li><a href="/dashboard/kitchen" class="pl-8">Küche</a></li>
									<li><a href="/dashboard/stats" class="pl-8">Stats</a></li>
									<li><a href="/dashboard/beamer" class="pl-8">Beamer</a></li>
								</ul>
							</li>
							<li>
								<a class="Products" href="/admin/products">Products</a>
								<ul class="menu menu-compact">
									<li><a href="/admin/products/new" class="pl-8">Neu</a></li>
								</ul>
							</li>
						</div>
						<li>
							<form action="/logout" method="post" use:enhance={logout}>
								<button class="flex flex-row items-center gap-3" type="submit" alt="Logout">
									<div class="h-10 w-10 fill-current"><IoIosLogOut /></div>
									<span>Abmelden</span>
								</button>
							</form>
						</li>
					</div>
				</ul>
			</div>
		</div>
	{:else}
		<div
			style="background-image: radial-gradient(hsla(var(--bc)/.2) .5px,hsla(var(--b2)/1) .5px); background-size: 5px 5px;"
			class="h-screen min-h-screen w-full bg-base-200 bg-top p-4"
		>
			<slot />
		</div>
	{/if}
</Notifications>
