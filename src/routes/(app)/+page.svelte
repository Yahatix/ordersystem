<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { ActionData, SubmitFunction } from './$types';

	interface Props {
		form: ActionData;
	}

	let { form }: Props = $props();
	let loading = $state(false);

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async ({ result }) => {
			loading = false;
			await applyAction(result);
			if (result.type === 'redirect') {
				await invalidateAll();
			}
		};
	};
</script>

<div class="flex h-full flex-col items-center justify-center">
	<div class="column is-half is-offset-one-quarter">
		{#if form?.error}
			<div class="notification is-danger block">{form.error}</div>
		{/if}
		<form method="post" use:enhance={handleSubmit} class="gap-4 flex flex-col">
			<h1 class="mb-4 text-2xl font-bold text-center">Anmelden</h1>
			<div class="form-control max-w-xs w-full">
				<label for="email" class="input-group">
					<span class="label-text">Email</span>
					<input
						id="email"
						name="email"
						autocomplete="username"
						value={form?.values?.email ?? ''}
						class="input input-bordered w-full"
						type="email"
						placeholder="info@example.com"
						required
					/>
				</label>
			</div>
			<div class="form-control max-w-xs w-full">
				<label for="email" class="input-group">
					<span class="label-text">Password</span>
					<input
						id="password"
						name="password"
						autocomplete="current-password"
						value={form?.values?.password ?? ''}
						class="input input-bordered w-full"
						type="password"
						placeholder="Password"
						required
					/>
				</label>
			</div>
			<button disabled={loading} class="btn w-full">Anmelden</button>
			<p class="text-center">
				Du hast keinen Account? <a href="/signup">Registrieren</a>
			</p>
		</form>
	</div>
</div>
