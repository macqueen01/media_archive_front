<script>
    import { createEventDispatcher } from "svelte";

    export let placeholder = "";
    export let inactive = false;

    const dispatch = createEventDispatcher();

    function actionCall() {
        dispatch("click", {
            click: true
        })
    }
</script>

{#if inactive}
    <a class="btn" class:inactive>
        <h3>{placeholder}</h3>
    </a>
{:else}
    <a class="btn" class:inactive on:click={actionCall}>
        <h3>{placeholder}</h3>
    </a>
{/if}

<style>
    .btn {
        width: 85px;
        height: 37px;
        border: none;
        outline: none;
        display: flex;
        background: #1f2058;
        align-items: center;
        justify-content: center;
        background: linear-gradient(
            -65deg,
            rgb(5 123 165) 0%,
            rgb(5 116 162) 0%,
            rgb(6 114 162) 0%,
            rgb(9 29 131) 100%
        );
        border-radius: 2px;
    }

    .btn > h3 {
        color: white;
        font-size: 13px;
        width: fit-content;
        font-family: "goth";
        padding-top: 3px;
    }

    .inactive {
        filter: grayscale(0.75);
    }
</style>
