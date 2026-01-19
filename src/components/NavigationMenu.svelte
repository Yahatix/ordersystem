<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { beforeNavigate, invalidateAll } from '$app/navigation';
	import IoIosLogOut from 'svelte-icons/io/IoIosLogOut.svelte';
	import Drawer from './Drawer.svelte';
	import db from '$lib/dbAPI';
	import type { SubmitFunction } from '../routes/(app)/logout/$types';

	interface Props {
		isMenuOpen?: boolean;
	}

	let { isMenuOpen = $bindable(false) }: Props = $props();

	let statDays = db.orders.getOrderDays();

	beforeNavigate(() => {
		isMenuOpen = false;
	});

	const logout: SubmitFunction = () => {
		return async ({ result }) => {
			await invalidateAll();
			applyAction(result);
		};
	};

	const toLocalDateString = (dateStr: string): string => {
		const d = new Date(dateStr);
		const dateFormatter = Intl.DateTimeFormat('de', { weekday: 'long' });
		return dateFormatter.format(d);
	};
</script>

<button class="btn top-4 right-4 absolute" onclick={() => (isMenuOpen = true)}>Menu</button>
<Drawer bind:open={isMenuOpen} position="right">
	<ul class="menu w-80 p-4 text-base-content h-full overflow-y-auto">
		<div class="flex h-full w-full flex-col justify-between">
			<div>
				<li>
					<a href="/">Home</a>
					<ul class="menu menu-compact">
						<li><a href="/dashboard/kasse" class="pl-8">Kasse</a></li>
						<li><a href="/dashboard/kitchen" class="pl-8">Küche</a></li>
						<li><a href="/dashboard/beamer" class="pl-8">Beamer</a></li>
					</ul>
				</li>
				<li>
					<a class="Products" href="/admin/products">Products</a>
					<ul class="menu menu-compact">
						<li><a href="/admin/products/new" class="pl-8">Neu</a></li>
					</ul>
				</li>
				<li>
					<a href="/dashboard/stats">Stats</a>
					<ul class="menu menu-compact block">
						{#await statDays then days}
							{#each days as day}
								<li>
									<a href={`/dashboard/stats/${day}`} class="pl-8">{toLocalDateString(day)}</a>
								</li>
							{/each}
						{/await}
					</ul>
				</li>
			</div>
			<li>
				<form action="/logout" method="post" use:enhance={logout}>
					<button class="gap-3 flex flex-row items-center" type="submit">
						<div class="h-10 w-10 fill-current"><IoIosLogOut /></div>
						<span>Abmelden</span>
					</button>
				</form>
			</li>
		</div>
	</ul>
</Drawer>
