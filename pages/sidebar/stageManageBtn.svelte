<style>
    .browse-navbar-wrap {
        width: 100%;
        height: 40px;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        position: relative;
    }

    .stage-btn-wrap {
        height: 40px;
        width: fit-content;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-right: 25px;
    }

    .stage-btn, .unclear-stage-btn, .curr-stage-btn, .curr-save-btn, .save-btn, .unclear-save-btn {
        background: rgb(241, 28, 0);
        background: linear-gradient(-65deg, rgb(5 123 165) 0%, rgb(5 116 162) 0%, rgb(6 114 162) 0%, rgb(9 29 131) 100%);
        height: 40px;
        width: 40px;
        color: white;
        border: none;
        outline: none;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .unclear-stage-btn, .unclear-save-btn {
        background: rgb(241, 28, 0);
        background: linear-gradient(-65deg, rgb(5 123 165) 0%, rgb(5 116 162) 0%, rgb(6 114 162) 0%, rgb(9 29 131) 100%);
        filter: grayscale(0.75);
        height: 40px;
        width: 40px;
        color: white;
    }

    .curr-stage-btn, .curr-save-btn {
        background: linear-gradient(-65deg, rgba(241,28,0,1) 0%, rgb(9 9 121 / 0%) 0%, rgb(189 64 64 / 88%) 0%, rgb(5 121 164) 100%);
    }


    .stage-btn > h2, .curr-stage-btn > h2, .unclear-stage-btn > h2, .save-btn > h2, .unclear-save-btn > h2, .curr-save-btn > h2 {
        position: relative;
        left: 0.8px;
        font-size: 16px;
        font-family: 'goth';
        width: fit-content;
        height: fit-content;
    }

    .unclear-save-btn, .curr-save-btn, .save-btn {
        width: 80px;
        height: 40px;
        border-radius: 5px;
    }

    .unclear-save-btn > h2, .curr-save-btn > h2, .save-btn > h2 {
        font-size: 14px;
        font-family: 'goth';
    }



</style>

<script>

    import { createEventDispatcher } from 'svelte';
    import UserSearch from '../../components/user/UserSearch.svelte';

    var dispatch = createEventDispatcher()

    export let stage = 1;
    export let data;
    export let focus = false;

    function stageControl(stage) {
        if (data.unclear_list.includes(stage)) {
            console.log("pass modal... not available")
            return 
        } 
        dispatch('stageChange', {
            stage: stage
        })
    }

    // Dummy data


</script>

<div class="browse-navbar-wrap">

    {#if !focus}
        {#each data.stages as stage_item, index}
            <div class="stage-btn-wrap">
                {#if (stage == stage_item.stage) && (index == (data.stages.length - 1))}
                    <button class="curr-save-btn" on:click={() => stageControl(stage_item.stage)}>
                        <h2>저장하기</h2>
                    </button>
                {:else if stage == stage_item.stage}
                    <button class="curr-stage-btn" on:click={() => stageControl(stage_item.stage)}>
                        <h2>{stage_item.stage}</h2>
                    </button>
                {:else if (index == (data.stages.length - 1))}
                    <button class="{(data.unclear_list.includes(stage_item.stage)) ? "unclear-save-btn" : "save-btn"}" on:click={() => stageControl(stage_item.stage)}>
                        <h2>저장하기</h2>
                    </button>
                {:else}
                    <button class="{(data.unclear_list.includes(stage_item.stage)) ? "unclear-stage-btn" : "stage-btn"}" on:click={() => stageControl(stage_item.stage)}>
                        <h2>{stage_item.stage}</h2>
                    </button>
                {/if}
            </div>
        {/each}
    {/if}
</div>