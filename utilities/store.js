import { writable } from 'svelte/store';


export let token = writable(null);

// wishList form
// wishList = {image: [], video: [], document:[]}
export let wishList = writable({0: [], 1: [], 2: []});