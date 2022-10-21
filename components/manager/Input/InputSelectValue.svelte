<style>
    .input-wrap {
        display:  flex;
        flex-direction: column;
        justify-content: center;
        align-content: center;
        position: relative;
        width: 300px;
        height: fit-content;
        margin-left: 30px;
        margin-right: 30px;
    }


    .input-container {
        width: 300px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: whitesmoke;
        border-radius: 5px;
        box-shadow: 4px 3px 10px 0 rgb(197 197 197 / 50%);
        border: thin solid rgb(99, 228, 99);
        position:  relative;
    }


    .input {
        width: 95%;
        height: 70%;
        font-size: 20px;
        background: transparent;
        border: none;
        outline: none;
        font-family: 'goth';
        font-size: 16px;
        margin-top: 10px;
        margin-left: 7px;
        z-index: 1;
    }

    .input-container-not-satisfied {
        width: 300px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: whitesmoke;
        border-radius: 5px;
        box-shadow: 4px 3px 10px 0 rgb(197 197 197 / 50%);
        position:  relative;
        border: thin solid rgb(226, 41, 41);
    }

    .label {
        width: 230px;
        height: 95%;
        left: 10px;
        top: 16.5px;
        position: absolute;
        z-index: 0;
    }

    .label > h3 {
        font-family: 'goth';
        font-size: 14px;
        color: rgb(82, 82, 82);
    }

    .label-focused {
        width: 200px;
        height: fit-content;
        left: 10px;
        top: 7px;
        position: absolute;
        z-index: 0;
    }

    .label-focused > h3 {
        font-family: 'goth';
        font-size: 8px;
        color: rgb(20, 20, 20);
    }

    .warning-wrap {
        width: 100%;
        height: fit-content;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .warning-container {
        width: 80%;
        padding-top: 15px;
        align-content: space-around;
        flex-direction: column;
        justify-content: start;
        display: flex;
    }

    .warning-container > h3 {
        font-size: 11px;
        font-family: 'goth';
        width: 200px;
        height: 25px;
        padding-left: 12px;
    }

    .satisfied {
        color: rgb(99, 228, 99);
    }

    .not-satisfied {
        color: rgb(226, 41, 41);
    }

    
</style>


<script>
    import { Route, router } from 'tinro';

    import { createEventDispatcher, onMount } from 'svelte';
    import { crossfade } from 'svelte/transition';
    import { flip } from 'svelte/animate';
    const [send, receive] = crossfade({});
    var dispatch = createEventDispatcher();


    export let init;
    export let placeholder = null;
    export let option_list = [];
    export let conditions = [
        {
            condition: () => {},
            name: "",
            not_satisfied_text: "",
            satisfied_text: ""
        },
        {
            condition: () => {},
            name: "",
            not_satisfied_text: "",
            satisfied_text: ""
        },
        {
            condition: () => {},
            name: "",
            not_satisfied_text: "",
            satisfied_text: ""
        }
    ]

    let focused = false;
    let condition_result = false;
    let value = '';
    let key;

    onMount(() => {
        if (init == 0 || init) {
            key = init;
            value = option_list[key];
            console.log(key)
        }
    })



    

    function focusHandle() {
        focused = true;
    }

    function blurHandle() {
        focused = false;
    }

    $: {
        dispatch('change', {
            key: option_list.indexOf(value),
            pass: conditionResult(value)
    })
        console.log(option_list.indexOf(value))

    }



    function conditionResult(value) {
        let result = true;
        conditions.forEach((con) => {
            if (!con.condition(option_list.indexOf(value))) {
                result = false;
            }
        })
        return result
    }

    $: {
        condition_result = conditionResult(value);
        console.log(value)
    }


</script>



<div class="input-wrap">
    <div class={(condition_result) ? 'input-container': 'input-container-not-satisfied'}>
        {#if value}
            {#key 'focused'}
                <div class="label-focused"
                    in:receive={{key: 'focused'}}
                    out:send={{key: 'unfocused'}}>
                    <h3>{placeholder}</h3>
                </div>
            {/key}
        {:else}
            {#key 'unfocused'}
                <div class="label"
                    in:receive={{key: 'unfocused'}}
                    out:send={{key: 'focused'}}>
                    <h3>{placeholder}</h3>
            </div>
            {/key}
        {/if}
        <select class='input' on:focus={focusHandle} on:blur={blurHandle} bind:value={value}>
            {#each option_list as option, index}
                <option value={option}><h3>{option}</h3></option> 
            {/each}
        </select>
    </div>

    <div class="warning-wrap">
        <div class="warning-container">
            {#each conditions as con, con_id}
                {#if !con.condition(option_list.indexOf(value))}
                    <h3 class="not-satisfied">{con.not_satisfied_text}</h3>
                {/if}
            {/each}
            {#if condition_result}
                <h3 class="satisfied">좋습니다!</h3>
            {/if}
        </div>
    </div>
</div>