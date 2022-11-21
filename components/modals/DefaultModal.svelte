<script>
    import { fly, fade } from "svelte/transition";
    import { createEventDispatcher } from "svelte";

    export let modalActive = false;

    var dispatch = createEventDispatcher();

    function close() {
        modalActive = false;
        dispatch("close", {
            modalActive: modalActive,
        });
    }
</script>

{#if modalActive}
    <div
        class="modal-background"
        in:fade={{ delay: 0, duration: 300 }}
        out:fade={{ delay: 300, duration: 300 }}
        on:click={close}
    >
        <div
            class="modal"
            role="dialog"
            aria-modal="true"
            transition:fly={{
                delay: 200,
                duration: 300,
                x: 0,
                y: -50,
                opacity: 0.5,
            }}
        >
            <div class="svg-holder">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="rgb(226, 41, 41)"
                    height="100"
                    width="100"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                </svg>
            </div>
            <slot name="header" />
            <slot name="content" />
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
        background-color: #23232370;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10;
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

    .svg-holder {
        width: 100%;
        height: fit-content;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    :global(.modal-header) {
        font-family: 'goth';
        font-size: 25px;
        color: rgb(226, 41, 41);
        padding-bottom: 5px;
        padding-top: 10px;
    }

    :global(.modal-content) {
        font-family: 'goth';
        font-size: 20px;
        color: rgb(226, 41, 41);
    }
</style>
