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
	{#if !$page.data.session.user}
		<div class="column is-half is-offset-one-quarter">
			{#if form?.error}
			<div class="notification is-danger block">{form.error}</div>
			{/if}
			<form method="post" use:enhance={handleSubmit} class="flex flex-col gap-2">
				<h1 class="text-2xl text-center font-bold">Sign in</h1>
				<div class="form-control w-full max-w-xs">
					<label for="email" class="label">
						<span class="label-text">Email</span>
					</label>
					<input
						id="email"
						name="email"
						value={form?.values?.email ?? ''}
						class="input input-bordered w-full max-w-xs"
						type="email"
						placeholder="Email"
						required
					/>
				</div>
				<div class="form-control w-full max-w-xs">
					<label for="email" class="label">
						<span class="label-text">Password</span>
					</label>
					<input
						id="password"
						name="password"
						value={form?.values?.password ?? ''}
						class="input input-bordered w-full max-w-xs"
						type="password"
						placeholder="Password"
						required
					/>
				</div>
				<button disabled={loading} class="btn mt-2 w-full">Sign in</button>
				<p class="text-center mt-2">
					Don't have an account? <a href="/signup">Sign up</a>
				</p>
			</form>
		</div>
	{:else}
		<a class="btn mb-4 h-1/3 w-1/2 text-4xl" href="kitchen">Küche</a>
		<a class="btn h-1/3 w-1/2 text-4xl" href="kasse">Kasse</a>
	{/if}
</div>
