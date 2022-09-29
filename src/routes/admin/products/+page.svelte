<script lang="ts">
    import db from "$lib/db"
    let fileEl: HTMLInputElement
    const uploadFile = () => {
        if(!fileEl.files) return
        db.products.uploadImage(fileEl.files[0])
    }
</script>

<div class="h-full flex flex-col items-center justify-center">
<input bind:this={fileEl} type="file" name="">
<button on:click={uploadFile}>Upload</button>
</div>