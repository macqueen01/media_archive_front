
<style>
    .user-search-wrap {
        display:  flex;
        justify-content: center;
        align-content: center;
        position: relative;
        height: fit-content;
    }


    .user-search-container {
        width: 300px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: whitesmoke;
        border-radius: 3px;
        box-shadow: inset 3px 3px 6px 0 rgb(197 197 197 / 50%);
        position:  relative;
    }

    .search-form {
        width: 95%;
        height: 100%;
        display:  flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }

    .search-input-small {
        width: 100%;
        height: 45%;
        font-size: 15px;
        background: transparent;
        border: none;
        outline: none;
        font-family: 'goth';
        font-size: 14px;
        margin-top: 14px;
        margin-left: 2px;
        z-index: 1;
    }

    button {
        margin-right: 2px;
        background: transparent;
        border: none;

    }

    .search-label {
        width: 240px;
        height: 70%;
        left: 2px;
        top: 8px;
        position: absolute;
        z-index: 0;
    }

    .search-label > h3 {
        font-family: 'goth';
        font-size: 12.5px;
        color: rgb(82, 82, 82);
    }

    .search-label-focused {
        width: 200px;
        height: fit-content;
        left: 2px;
        top: 3px;
        position: absolute;
        z-index: 0;
    }

    .search-label-focused > h3 {
        font-family: 'goth';
        font-size: 6px;
        color: rgb(20, 20, 20);
    }





</style>

<script>
    import { Route, router } from 'tinro';

    import { createEventDispatcher } from 'svelte';
    import { crossfade, fade } from 'svelte/transition';
    import { flip } from 'svelte/animate';
    const [send, receive] = crossfade({});
    const dispatch = createEventDispatcher();

    let focused = false;
    let search_value = '';
    export let placeholder = "검색해주세요";

    

    function focusHandle() {
        focused = true;
        console.log("focused", focused);
    }

    function blurHandle() {
        focused = false;
        console.log("blurred", focused);
    }

    function labelHandle() {
        document.querySelector('.search-input-small').focus = true;
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

    function changeCall(value) {
        dispatch('change', {
            value: value
        });
    }

    $: {
        if (focused) {
            if (!search_value) {
                search_value = '#';
            };
        } else if (search_value.length == 1) {
            search_value = '';
        }
    }

    $: {
        dispatch('change', {
            value: search_value
        })
        console.log('hi')
    }

    $: {
        let result = '';
        let str_list = search_value.split('');
        str_list = tagSplice(str_list);

        if (str_list) {
            str_list.forEach((char) => {result = result + char});
            search_value = result;
        }

        search_value = search_value.replace(/\s+[^#]/, '_');
    }

    




</script>

<div class="user-search-wrap">
    <div class="user-search-container">
    <form class="search-form">
        <input class="search-input-small" type="text" on:focus={focusHandle} on:blur={blurHandle} bind:value={search_value}>
            {#if focused || search_value}
                {#key 'focused'}
                    <label for="search-input" class="search-label-focused"
                           in:receive={{key: 'focused'}}
                           out:send={{key: 'unfocused'}}
                           >
                           <h3>{placeholder}</h3>
                    </label>
                {/key}
            {:else}
                {#key 'unfocused'}
                    <label for="search-input" class="search-label"
                           in:receive={{key: 'unfocused'}}
                           out:send={{key: 'focused'}}
                           on:click={labelHandle}>
                           <h3>{placeholder}</h3>
                    </label>
                {/key}
            {/if}
    </form>
    </div>
</div>