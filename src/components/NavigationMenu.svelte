<script lang="ts">
	import { applyAction, enhance, type SubmitFunction } from '$app/forms';
	import { beforeNavigate, invalidateAll } from '$app/navigation';
	import IoIosLogOut from 'svelte-icons/io/IoIosLogOut.svelte';
	import Drawer from './Drawer.svelte';

	export let isMenuOpen = false;

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

<button class="btn absolute top-4 right-4" on:click={() => (isMenuOpen = true)}>Menu</button>
<Drawer bind:open={isMenuOpen} position="right">
	<ul class="menu w-80 h-full overflow-y-auto p-4 text-base-content">
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
</Drawer>
