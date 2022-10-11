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

    import { createEventDispatcher } from 'svelte';
    import { crossfade } from 'svelte/transition';
    import { flip } from 'svelte/animate';
    const [send, receive] = crossfade({});
    var dispatch = createEventDispatcher();

    export let placeholder = null;
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
    let result = '';
    let str_list = [];


    

    function focusHandle() {
        focused = true;    
    }

    function blurHandle() {
        focused = false;
    }

    $: {
        if (value) {
            dispatch('change', {
                value: value
            })
        }
    }
    

    function tagSplice(string) {
        let str = [...string]
        for (let i = 0; i <= str.length; i++) {
             if (str[i] == ',') {
                if (i+1 == str.length) {
                    str[i] = ' ';
                    str = [...str, '#'];
                } else {
                    str[i] = ' ';
                    str.splice(i+1, 0, '#');
                }
            }
        }
        return str
    }

    function conditionResult(value) {
        let result = true;
        conditions.forEach((con) => {
            if (!con.condition(value)) {
                result = false
            }
        })
        return result
    }

    $: {

        result = '';
        str_list = value.split('');
        str_list = tagSplice(str_list);

        if (str_list) {
            str_list.forEach((char) => {result = result + char});
            value = result;
        }

        value = value.replace(/\s+[^#]/, '_');
        value = value.replace();

        condition_result = conditionResult(value);
        console.log(condition_result)

    }


</script>



<div class="input-wrap">
    <div class={(condition_result) ? 'input-container': 'input-container-not-satisfied'}>
        <input class='input' type="text" on:focus={focusHandle} on:blur={blurHandle} bind:value={value}>
            {#if focused || value}
                {#key 'focused'}
                    <label for="input" class="label-focused"
                           in:receive={{key: 'focused'}}
                           out:send={{key: 'unfocused'}}>
                           <h3>{placeholder}</h3>
                    </label>
                {/key}
            {:else}
                {#key 'unfocused'}
                    <label for="input" class="label"
                           in:receive={{key: 'unfocused'}}
                           out:send={{key: 'focused'}}>
                           <h3>{placeholder}</h3>
                    </label>
                {/key}
            {/if}
    </div>

    <div class="warning-wrap">
        <div class="warning-container">
            {#each conditions as con, con_id}
                {#if !con.condition(value)}
                    <h3 class="not-satisfied">{con.not_satisfied_text}</h3>
                {/if}
            {/each}
            {#if condition_result}
                <h3 class="satisfied">좋습니다!</h3>
            {/if}
        </div>
    </div>
</div>