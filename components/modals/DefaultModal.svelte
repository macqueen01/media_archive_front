<script>
    import {fly, fade} from 'svelte/transition';
    
    export let modalActive = false;

    function close() {
        modalActive = false;
    }
</script>


{#if modalActive}
    <div class="modal-background" 
        in:fade={{delay: 0, duration: 300}}
        out:fade={{delay: 300, duration: 300}}
        on:click={close}>
        <div class="modal" role="dialog" aria-modal="true"
            transition:fly={{delay: 200, duration: 300, x: 0, y: -50, opacity: 0.5}}>
            <slot name="header"></slot>
            <slot name="content"></slot>
        </div>
    </div>
{/if}



<style>
    .modal-background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rbgs(0, 0, 0, 0.3);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .modal {
        width: 330px;
        height: 250px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 20px;
        background: white;
        border-radius: 4px;
    }
</style>