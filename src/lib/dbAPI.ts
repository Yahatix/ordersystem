import { PUBLIC_SUPABASE_ORDER_TABLE, PUBLIC_SUPABASE_PRODUCT_TABLE } from '$env/static/public';
import { writable, derived } from 'svelte/store';
import { currentOrder } from './stores';
import { curr_formatter } from './utils';
import { supabase } from '$lib/db';

export interface Order {
	delivered: boolean;
	done: boolean;
	id: number;
	created_at: string;
	orderItem: OrderItem[];
}

export type OrderRequest = Omit<Order, 'id' | 'created_at' | 'orderItem'>;

export interface CurrentOrderItem {
	extraWish: string | null;
	product: Product;
}

export interface OrderItemRequest {
	extraWish: string | null;
	product: number;
	orderId: number;
}
export interface OrderItem {
	extraWish: string | null;
	product: Product;
}

export interface Product {
	id: number;
	name: string;
	price: number;
	active: boolean;
	image_path: string;
	public_image_path?: string;
}
export type ProductRequest = Omit<Product, 'id' | 'public_image_path'>;

export const userStore = writable(await supabase.auth.getUser().then(({ data }) => data?.user));

supabase.auth.onAuthStateChange((event, session) => {
	if (event == 'SIGNED_IN' && session) {
		userStore.set(session.user);
	} else if (event == 'SIGNED_OUT') {
		userStore.set(null);
	}
});

const db = {
	products: {
		tableName: PUBLIC_SUPABASE_PRODUCT_TABLE,
		async new(product: ProductRequest) {
			return await supabase.from('products').insert(product);
		},
		async getAll() {
			const { data } = await supabase.from('products').select('*');
			return data || [];
		},
		async uploadImage(file: File) {
			return await supabase.storage.from('product-image').upload(file.name, file);
		},
		getImage(product: Product) {
			if (product.public_image_path) return product.public_image_path;

			const { data } = supabase.storage.from('product-image').getPublicUrl(product.image_path);

			products.update((prs) =>
				prs.map((p) => {
					if (p.id !== product.id) return p;
					p.public_image_path = data?.publicUrl;
					return p;
				})
			);

			return data.publicUrl;
		},
		async update(product: Product) {
			delete product.public_image_path;
			return await supabase.from('products').update(product).match({ id: product.id });
		}
	},
	orders: {
		tableName: PUBLIC_SUPABASE_ORDER_TABLE,
		async get(id: number) {
			const { data } = await supabase
				.from('orders')
				.select('*, orderItem(extraWish, product(*))')
				.eq('id', id)
				.single();
			return data;
		},
		async getAll() {
			const { data } = await supabase.from('orders').select('*, orderItem(extraWish, product(*))');
			return data || [];
		},
		async getByDate(day: string) {
			const { data } = await supabase
				.from('orders')
				.select('*, orderItem(product(*))')
				.eq('created_at', day);
			return data || [];
		},
		async getOrderDays() {
			const { data } = await supabase
				.from('orders')
				.select('created_at')
				.eq('delivered', true)
				.eq('done', true)
				.order('delivered');
			const daysWithStats = [...new Set(data?.map((d) => d.created_at))];
			return daysWithStats;
		},
		async create(items: CurrentOrderItem[]) {
			const { data } = await supabase.from('orders').insert({}).select().single();
			if (!data) return;
			await supabase
				.from('orderItem')
				.insert(items.map((i) => ({ ...i, orderId: data.id, product: i.product.id })));
			return data;
		},
		async finishOrder(order: Order) {
			await supabase.from('orders').update({ done: true }).match({ id: order.id });
		},
		async deliverOrder(order: Order) {
			await supabase.from('orders').update({ delivered: true }).match({ id: order.id });
		}
	}
};

export const orders = writable<Order[]>([]);
db.orders.getAll().then((res) => orders.set(res));

supabase.realtime
	.channel('orders')
	.on<Order>('postgres_changes', { event: 'INSERT', table: 'orders', schema: 'public' }, (payload) => {
		db.orders.get(payload.new.id).then((order) => {
			orders.update((val) => (order ? [...val, order] : val));
		});
	})
	.on<Order>('postgres_changes', { event: 'UPDATE', table: 'orders', schema: 'public' }, (payload) => {
		orders.update((val) => (val = val.map((p) => (p.id !== payload.new.id ? p : payload.new))));
	})
	.subscribe();

export const unfinishedOrders = derived(orders, ($orders) => $orders.filter((o) => !o.done));
export const finishedOrders = derived(orders, ($orders) =>
	$orders.filter((o) => o.done && !o.delivered)
);
export const deliveredOrders = derived(orders, ($orders) =>
	$orders.filter((o) => o.done && o.delivered)
);

export const total = derived(currentOrder, ($currentOrder) =>
	curr_formatter.format($currentOrder.reduce((curr, val) => (curr += val.product.price), 0))
);

export const orderStats = derived(deliveredOrders, ($orders) => {
	return [
		...$orders
			.flatMap((a) => a.orderItem)
			.reduce<Map<number, [Product, number]>>((curr, val) => {
				const p = val.product;
				const toppingStats = curr.get(p.id)?.[1] || 0;
				curr.set(p.id, [p, toppingStats + 1]);
				return curr;
			}, new Map())
	].sort((a, b) => b[1][1] - a[1][1]);
});

export const products = writable<Product[]>([]);
export const activeProducts = derived(products, ($products) => $products.filter((p) => p.active));
db.products.getAll().then((res) => products.set(res));

supabase.realtime
	.channel('products')
	.on<Product>('postgres_changes', { event: '*', table: 'products', schema: 'public' }, (payload) => {
		products.update((val) => {
			val = val.map((p) => (p.id !== (payload.new as Product).id ? p : payload.new as Product));
			return val;
		});
	})
	.subscribe();

export default db;
