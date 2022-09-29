<script lang="ts">
	import '../app.css';
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';

	import IoIosHome from 'svelte-icons/io/IoIosHome.svelte';
	import IoMdMoon from 'svelte-icons/io/IoMdMoon.svelte';
	import IoMdSunny from 'svelte-icons/io/IoMdSunny.svelte';
	import IoIosLogOut from 'svelte-icons/io/IoIosLogOut.svelte';
	import { startSupabaseSessionSync } from '@supabase/auth-helpers-sveltekit';

	import { page } from '$app/stores';
	import { invalidateAll } from '$app/navigation';
	import { applyAction, enhance, type SubmitFunction } from '$app/forms';

	import '$lib/db';
	import theme from '$lib/stores/theme';

	startSupabaseSessionSync({
		page,
		handleRefresh: () => invalidateAll()
	});

	const toggleTheme = () => {
		$theme = $theme === 'dracula' ? 'light' : 'dracula';
	};

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
<div
	class="absolute top-0 flex w-full justify-between bg-transparent px-2 pt-2"
	data-theme={$theme}
>
	{#if $page.data.session.user}
		<button on:click={() => goto('/')}>
			<div class="h-10 w-10 fill-current">
				<IoIosHome />
			</div>
		</button>
	{:else}
		<div />
	{/if}

	<div class="flex flex-row gap-2">
		{#if $page.data.session.user}
			<form action="/logout" method="post" use:enhance={logout}>
				<button class="btn btn-circle p-2" type="submit" alt="Logout">
					<IoIosLogOut />
				</button>
			</form>
		{/if}

		{#if $theme === 'dracula'}
			<button on:click={toggleTheme}>
				<div transition:fade class="h-10 w-10 fill-current">
					<IoMdMoon />
				</div>
			</button>
		{:else}
			<button on:click={toggleTheme}>
				<div transition:fade class="h-10 w-10 fill-current">
					<IoMdSunny />
				</div>
			</button>
		{/if}
	</div>
</div>

<div
	style="background-image: radial-gradient(hsla(var(--bc)/.2) .5px,hsla(var(--b2)/1) .5px); background-size: 5px 5px;"
	class="h-screen min-h-screen w-full bg-base-200 bg-top p-4"
>
	<slot />
</div>
