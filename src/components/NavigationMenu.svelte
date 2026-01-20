<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { beforeNavigate, invalidateAll } from '$app/navigation';
	import Drawer from '$components/Drawer.svelte';
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

<button class="btn absolute top-4 right-4" onclick={() => (isMenuOpen = true)}>Menu</button>
<Drawer bind:open={isMenuOpen} position="right">
	<ul class="menu h-full w-80 overflow-y-auto p-4 text-base-content">
		<div class="flex h-full w-full flex-col justify-between">
			<div>
				<li>
					<a href="/">Home</a>
					<ul class="menu-compact menu">
						<li><a href="/dashboard/kasse" class="pl-8">Kasse</a></li>
						<li><a href="/dashboard/kitchen" class="pl-8">Küche</a></li>
						<li><a href="/dashboard/beamer" class="pl-8">Beamer</a></li>
					</ul>
				</li>
				<li>
					<a class="Products" href="/admin/products">Products</a>
					<ul class="menu-compact menu">
						<li><a href="/admin/products/new" class="pl-8">Neu</a></li>
					</ul>
				</li>
				<li>
					<a href="/dashboard/stats">Stats</a>
					<ul class="menu-compact menu block">
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
					<button class="flex flex-row items-center gap-3" type="submit">
						<div class="flex h-10 w-10 items-center fill-current">
							<span class="material-symbols--logout"></span>
						</div>
						<span class="flex h-10 items-center">Abmelden</span>
					</button>
				</form>
			</li>
		</div>
	</ul>
</Drawer>

<style>
	.material-symbols--logout {
		display: inline-block;
		width: 24px;
		height: 24px;
		--svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h7v2H5v14h7v2zm11-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5z'/%3E%3C/svg%3E");
		background-color: currentColor;
		-webkit-mask-image: var(--svg);
		mask-image: var(--svg);
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		-webkit-mask-size: 100% 100%;
		mask-size: 100% 100%;
	}
</style>
