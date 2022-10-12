<script lang="ts">
	import type { DefaultNotificationOptions } from 'svelte-notifications';

	export let notification: DefaultNotificationOptions;
	const bgColor = {
		success: 'bg-green-500',
		error: 'bg-red-500'
	}[notification.type || 'success'];
</script>

<div class={`rounded-2xl p-4 ${bgColor}`}>
	{@html notification.text}
</div>
