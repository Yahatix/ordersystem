import { writable } from 'svelte/store';
import type { CurrentOrderItem } from "$lib/dbAPI";

export const currentOrder = writable<CurrentOrderItem[]>([]);