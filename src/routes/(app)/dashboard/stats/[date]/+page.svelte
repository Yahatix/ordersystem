<script lang="ts">
	import { run } from 'svelte/legacy';

	import { page } from '$app/stores';
	import db, { type Product } from '$lib/dbAPI';
	import { curr_formatter } from '$lib/utils';

	const getStats = async (day: string): Promise<[number, [Product, number]][]> => {
		const statsRes = await db.orders.getByDate(day);

		return [
			...statsRes
				.flatMap((a) => a.orderItem)
				.reduce((curr, orderItem) => {
					const toppingStats = curr.get(orderItem.product.id)?.[1] || 0;
					curr.set(orderItem.product.id, [orderItem.product, toppingStats + 1]);
					return curr;
				}, new Map<number, [Product, number]>())
		].sort((a, b) => b[1][1] - a[1][1]);
	};

	let stats: [number, [Product, number]][] = $state([]);
	run(() => {
		getStats($page.params.date).then((res) => (stats = res));
	});

	let totalMoney = $derived(
		curr_formatter.format(stats.reduce((curr, stat) => curr + stat[1][0].price * stat[1][1], 0))
	);
	let totalOrders = $derived(stats.reduce((curr, stat) => curr + stat[1][1], 0));
</script>

<div class="pt-16 w-full overflow-x-auto">
	<table class="table w-full">
		<!-- head -->
		<thead>
			<tr>
				<th>Name</th>
				<th>Anzahl</th>
				<th>Gewinn</th>
			</tr>
		</thead>
		<tbody>
			{#each stats as stat}
				<!-- row 1 -->
				{@const product = stat[1][0]}
				{@const count = stat[1][1]}
				<tr class="hover">
					<td>
						<div class="space-x-3 flex items-center">
							<div class="avatar">
								<div class="mask mask-squircle h-16 w-16">
									<img src={db.products.getImage(product)} alt={product.name} />
								</div>
							</div>
							<div>
								<div class="font-bold">{product.name}</div>
							</div>
						</div>
					</td>
					<td>
						{count}
					</td>
					<td>
						{curr_formatter.format(product.price * count)}
					</td>
				</tr>
			{/each}
		</tbody>
		<tfoot>
			<tr>
				<td>Gesamt</td>
				<td>{totalOrders}</td>
				<td>{totalMoney}</td>
			</tr>
		</tfoot>
	</table>
</div>
