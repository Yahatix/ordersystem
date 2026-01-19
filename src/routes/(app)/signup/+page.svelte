<script lang="ts">
	import { applyAction, enhance, type SubmitFunction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	interface Props {
		errors?: Record<string, string>;
		values?: Record<string, string>;
		message?: string;
	}

	let { errors = {}, values = {}, message = '' }: Props = $props();
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
	{#if Object.keys(errors).length > 0}
		<div class="notification is-danger block">{errors.form}</div>
	{/if}
	{#if message}
		<div class="notification is-primary block">{message}</div>
	{/if}

	<form method="post" use:enhance={handleSubmit} class="gap-4 flex flex-col items-center">
		<h1 class="mb-4 text-2xl font-bold">Registrieren</h1>
		<div class="form-control max-w-xs w-full">
			<label for="email" class="input-group">
				<span class="label-text">Email</span>
				<input
					id="email"
					name="email"
					value={values?.email ?? ''}
					class="input input-bordered w-full"
					type="email"
					placeholder="info@example.com"
					required
				/>
			</label>
		</div>
		<div class="form-control max-w-xs w-full">
			<label for="email" class="input-group w-full">
				<span class="label-text">Password</span>
				<input
					id="password"
					name="password"
					value={values?.password ?? ''}
					class="input input-bordered w-full"
					type="password"
					placeholder="Password"
					required
				/>
			</label>
		</div>
		<button disabled={loading} class="btn max-w-xs w-full">Registrieren</button>
		<p class="has-text-centered">
			Du hast schon einen Account? <a href="/">Anmelden</a>
		</p>
	</form>
</div>
