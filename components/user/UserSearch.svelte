<style>
    .user-search-wrap {
        display:  flex;
        justify-content: center;
        align-content: center;
        position: relative;
        height: fit-content;
        margin-left: 30px;
        margin-right: 30px;
    }


    .user-search-container {
        width: 600px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: whitesmoke;
        border-radius: 30px;
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

    .search-input {
        width: 100%;
        height: 70%;
        font-size: 20px;
        background: transparent;
        border: none;
        outline: none;
        font-family: 'goth';
        font-size: 16px;
        margin-top: 10px;
        margin-left: 10px;
        z-index: 1;
    }

    button {
        margin-right: 9px;
        background: transparent;
        border: none;

    }

    .search-label {
        width: 230px;
        height: 95%;
        left: 10px;
        top: 16.5px;
        position: absolute;
        z-index: 0;
    }

    .search-label > h3 {
        font-family: 'goth';
        font-size: 14px;
        color: rgb(82, 82, 82);
    }

    .search-label-focused {
        width: 200px;
        height: fit-content;
        left: 10px;
        top: 7px;
        position: absolute;
        z-index: 0;
    }

    .search-label-focused > h3 {
        font-family: 'goth';
        font-size: 8px;
        color: rgb(20, 20, 20);
    }





</style>

<script>
    import { Route, router } from 'tinro';

    import { crossfade } from 'svelte/transition';
    import { flip } from 'svelte/animate';
    const [send, receive] = crossfade({});

    let focused = false;
    let search_value = null;
    let SEARCH_INPUT;

    

    function focusHandle() {
        focused = true;
        console.log("focused", focused);
    }

    function blurHandle() {
        focused = false;
        console.log("blurred", focused);
    }

    function labelHandle() {
        document.querySelector('.search-input').focus = true;
    }

    function navToBrowse() {
        router.goto("/user/browse")
    }



</script>

<div class="user-search-wrap">
    <div class="user-search-container">
    <form class="search-form">
        <input class="search-input" type="text" on:focus={focusHandle} on:blur={blurHandle} bind:value={search_value} >
            {#if focused || search_value}
                {#key 'focused'}
                    <label for="search-input" class="search-label-focused"
                           in:receive={{key: 'focused'}}
                           out:send={{key: 'unfocused'}}>
                           <h3>제목, 이름 또는 장소를 검색해보세요</h3>
                    </label>
                {/key}
            {:else}
                {#key 'unfocused'}
                    <label for="search-input" class="search-label"
                           in:receive={{key: 'unfocused'}}
                           out:send={{key: 'focused'}}
                           on:click={labelHandle}>
                           <h3>제목, 이름 또는 장소를 검색해보세요</h3>
                    </label>
                {/key}
            {/if}
            <button class="search-button" aria-hidden="true" aria-disabled="true" aria-label="제목, 이름 또는 장소를 검색해보세요" on:click|preventDefault={navToBrowse}>
                <span class="search-icon">
                    <svg viewBox="0 0 16 16" width="16px" height="16px" xmlns="http://www.w3.org/2000/svg" style="width: 20px; height: 20px;">
                        <path d="M10.5 0C11.0052 0 11.4922 0.0651042 11.9609 0.195312C12.4297 0.325521 12.8672 0.510417 13.2734 0.75C13.6797 0.989583 14.0495 1.27865 14.3828 1.61719C14.7214 1.95052 15.0104 2.32031 15.25 2.72656C15.4896 3.13281 15.6745 3.57031 15.8047 4.03906C15.9349 4.50781 16 4.99479 16 5.5C16 6.00521 15.9349 6.49219 15.8047 6.96094C15.6745 7.42969 15.4896 7.86719 15.25 8.27344C15.0104 8.67969 14.7214 9.05208 14.3828 9.39062C14.0495 9.72396 13.6797 10.0104 13.2734 10.25C12.8672 10.4896 12.4297 10.6745 11.9609 10.8047C11.4922 10.9349 11.0052 11 10.5 11C9.84896 11 9.22396 10.8906 8.625 10.6719C8.03125 10.4531 7.48438 10.138 6.98438 9.72656L0.851562 15.8516C0.752604 15.9505 0.635417 16 0.5 16C0.364583 16 0.247396 15.9505 0.148438 15.8516C0.0494792 15.7526 0 15.6354 0 15.5C0 15.3646 0.0494792 15.2474 0.148438 15.1484L6.27344 9.01562C5.86198 8.51562 5.54688 7.96875 5.32812 7.375C5.10938 6.77604 5 6.15104 5 5.5C5 4.99479 5.0651 4.50781 5.19531 4.03906C5.32552 3.57031 5.51042 3.13281 5.75 2.72656C5.98958 2.32031 6.27604 1.95052 6.60938 1.61719C6.94792 1.27865 7.32031 0.989583 7.72656 0.75C8.13281 0.510417 8.57031 0.325521 9.03906 0.195312C9.50781 0.0651042 9.99479 0 10.5 0ZM10.5 10C11.1198 10 11.7031 9.88281 12.25 9.64844C12.7969 9.40885 13.2734 9.08594 13.6797 8.67969C14.0859 8.27344 14.4062 7.79688 14.6406 7.25C14.8802 6.70312 15 6.11979 15 5.5C15 4.88021 14.8802 4.29688 14.6406 3.75C14.4062 3.20312 14.0859 2.72656 13.6797 2.32031C13.2734 1.91406 12.7969 1.59375 12.25 1.35938C11.7031 1.11979 11.1198 1 10.5 1C9.88021 1 9.29688 1.11979 8.75 1.35938C8.20312 1.59375 7.72656 1.91406 7.32031 2.32031C6.91406 2.72656 6.59115 3.20312 6.35156 3.75C6.11719 4.29688 6 4.88021 6 5.5C6 6.11979 6.11719 6.70312 6.35156 7.25C6.59115 7.79688 6.91406 8.27344 7.32031 8.67969C7.72656 9.08594 8.20312 9.40885 8.75 9.64844C9.29688 9.88281 9.88021 10 10.5 10Z">
                        </path>
                    </svg>
                </span>
            </button>
    </form>
    </div>
</div>