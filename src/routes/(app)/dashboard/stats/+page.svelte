<script lang="ts">
	import db, { orderStats, finishedOrders } from '$lib/dbAPI';
	import { curr_formatter } from '$lib/utils';

	$: totalMoney = curr_formatter.format(
		$orderStats.reduce((curr, stat) => curr + stat[1][0].price * stat[1][1], 0)
	);
</script>

<div class="w-full overflow-x-auto pt-16">
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
			{#each $orderStats as stat}
				<!-- row 1 -->
				{@const product = stat[1][0]}
				{@const count = stat[1][1]}
				<tr class="hover">
					<td>
						<div class="flex items-center space-x-3">
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
				<td>{$finishedOrders.length}</td>
				<td>{totalMoney}</td>
			</tr>
		</tfoot>
	</table>
</div>
