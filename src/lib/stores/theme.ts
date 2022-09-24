import { writable } from 'svelte/store';

export default writable<'dracula' | 'light'>('dracula');
