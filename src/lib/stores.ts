import type { CurrentOrderItem } from '$lib/dbAPI';
import { writable } from 'svelte/store';

export const currentOrder = writable<CurrentOrderItem[]>([]);