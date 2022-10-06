<script lang="ts">
	import { page } from '$app/stores';

	import { applyAction, enhance, type SubmitFunction } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	export let form: any;
	let loading = false;

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
	{#if $page.data.session.user}
		<div>{JSON.stringify($page.data.session.user)}</div>
		<a class="btn mb-4 h-1/3 w-1/2 text-4xl" href="kitchen">Küche</a>
		<a class="btn h-1/3 w-1/2 text-4xl" href="kasse">Kasse</a>
	{:else}
		<div class="column is-half is-offset-one-quarter">
			{#if form?.error}
				<div class="notification is-danger block">{form.error}</div>
			{/if}
			<form method="post" use:enhance={handleSubmit} class="flex flex-col gap-4">
				<h1 class="mb-4 text-center text-2xl font-bold">Anmelden</h1>
				<div class="form-control w-full max-w-xs">
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
				<div class="form-control w-full max-w-xs">
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
	{/if}
</div>
