<style>
    .browse-content-title {
        width: 100%;
        padding-top: 15px;
        padding-bottom: 15px;
        height: 45px;
        background-color: rgb(31, 32, 88);
        position: relative;
    }

    .browse-content-title > h3 {
        color: rgb(247, 247, 247);
        font-family: 'goth';
        font-size: 14px;
        padding-left: 24px;
    }

    .keyword-holder-wrap {
        position: absolute;
        top: 37px;
        left: 23px;
        width: 64%;
        height: 25px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        overflow-x: auto;
    }

    .keyword-holder-label {
        width: fit-content;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .keyword-holder-label > h3 {
        width: 45px;
        height: fit-content;
        padding-top: 2px;
        color: rgb(247, 247, 247);
        font-family: 'goth';
        font-size: 11px;
    }

    .keyword-holder {
        display: flex;
        flex-direction: row;
        width: fit-content;
        height: fit-content;
    }

    .keyword {
        margin-right: 3px;
        width: fit-content;
        height: fit-content;
        background: linear-gradient(-65deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 0%, rgb(8 65 144) 0%, rgba(4,145,173,1) 100%);
        border-radius: 10px;
    }

    .keyword > h3 {
        padding-top: 3px;
        padding-bottom: 2px;
        padding-right: 7px;
        padding-left: 7px;
        width: fit-content;
        height: fit-content;
        color: rgb(245 245 245);
        font-family: 'goth';
        font-size: 10px;
    }

    .search-field {
        width: fit-content;
        height: fit-content;
        position: absolute;
        top: 10px;
        right: 10px;
    }

    .keyword-holder > h5 {
        width: 45px;
        height: fit-content;
        padding-top: 2px;
        color: rgb(247, 247, 247);
        font-family: 'goth';
        font-size: 11px;
    }

</style>

<script>
    import { Route } from 'tinro';
    import { createEventDispatcher } from 'svelte';

    import UserSearchSmall from './UserSearchSmall.svelte';

    export let keywords = [];

    var dispatch = createEventDispatcher();


    function valueChangeHandle(e) {
        let search_keywords = e.detail.value;
        keywords = search_keywords.split(' ');
    }

    function keywordChange(keywords) {
        dispatch('keyword', {
            keywords: keywords
        })
    }

    $: {
        keywordChange(keywords);
    }
</script>


    <div class="browse-content-title">
        <h3>회원 조회</h3>
        <div class="keyword-holder-wrap">
            <div class="keyword-holder-label">
                <h3>키워드:</h3>
            </div>
            <div class="keyword-holder">
                {#each keywords as keyword, index}
                    {#if keyword != ''}
                        <div class="keyword"><h3>{keyword}</h3></div>
                    {/if}
                {:else}
                    <h5>키워드를 입력해주세요.</h5>
                {/each}
            </div>
        </div>
        <div class="search-field">
            <UserSearchSmall placeholder={"키워드 검색"} on:change={valueChangeHandle}/>
        </div>
    </div>
