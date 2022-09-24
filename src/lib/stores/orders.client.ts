import { writable } from 'svelte/store';
import { browser } from "$app/environment";

type Topping = 'Schoko' | 'Schoko+Banane' | 'Zimt-Zucker' | 'Apfelmus';
export type TOrder = {
  nr: number;
  type: `Crepes`;
  done: boolean;
  topping: Topping;
};

let storedOrders = '[]'
if (browser) {
  storedOrders = window.localStorage.getItem("orders") || '[]'
}

export const orders = writable<TOrder[]>(JSON.parse(storedOrders || '[]') as TOrder[]);

if (browser) {
  orders.subscribe(value => {
    localStorage.setItem("orders", JSON.stringify(value));
  });
}