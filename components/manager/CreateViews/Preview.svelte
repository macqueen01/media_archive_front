<style>
    .focus {
        width: 100%;
        height: 100%;
        z-index: 2;
        position: relative;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .header {
        height: 55px;
        width: 100%;
        background: white;
        position: absolute;
        top: 0;
        box-shadow: -2px -3px 20px 0px rgb(197 197 197 / 50%);
        z-index: 4;
    }

    .header > h3 {
        font-family: 'goth';
        font-size: 17px;
        color:#1e1c3b;
        font-weight: 900;
        position: absolute;
        left: 90px;
        bottom: 18px;
    }

    .body {
        background-color: white;
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 3;
    }

    .back-btn-wrap {
        height: 40px;
        width: 40px;
        position: absolute;
        left: 8px;
        bottom: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .back-btn {
        outline: none;
        background: none;
        border: none;
        height: fit-content;
        width: fit-content;
    }

    .approved-mark-wrap {
        position: absolute;
        width: fit-content;
        height: fit-content;
        left: 235px;
        bottom: 16px;
    }

    .icons-wrap {
        display: flex;
        width: 145px;
        height: 100%;
        justify-content: space-between;
        align-items: center;
        position: absolute;
        bottom: 0;
        right: 25px;
    }

    .icon {
        height: fit-content;
        width: fit-content;
    }
    

    .info-wrap {
        position: absolute;
        width: 180px;
        height: 20px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        bottom: 12px;
        left: 330px;
    }

    .name-wrap {
        display: flex;
        flex-direction: row;
        width: fit-content;
        height: 100%;
        margin-left: 10px;
    }

    .date-wrap {
        display: flex;
        flex-direction: row;
        width: fit-content;
        height: 100%;
    }

    .name-wrap > h3, .date-wrap > h3 {
        font-family: 'goth';
        font-weight: 900;
        font-size: 11px;
    }

    .space {
        width: 7px;
        height: 100%;
    }

    .body-content-wrap {
        position: absolute;
        top: 55px;
        height: 495px;
        width: 100%;
        display: grid;
        grid-template-columns: 1.4fr 1fr;
    }

    .media-wrap {
        height: 100%;
        width: 560px;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow-x: hidden;
        overflow-y: hidden;
        flex-direction: column;
    }

    .details-wrap {
        height: 100%;
        width: 400px;
        overflow-y: auto;
        overflow-x: hidden;
    }
    
    .photo-container {
        height: fit-content;
        width: fit-content;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        position: relative;
    }

    .photo-container > h1, .photo-container > h2 {
        font-family: 'goth';
    }

    .photo-container > h1 {
        font-size: 35px;
    }

    .photo-container > h2 {
        font-size: 20px;
    }

    .caption {
        display: flex;
        justify-content: end;
        align-items: center;
        background-color: rgba(12, 12, 12, 0.856);
        height: 25px;
        width: 100%;
        position: relative;
    }

    .caption > h4 {
        color: white;
        font-family: 'goth';
        font-weight: 400;
        font-size: 12px;
        position: absolute;
        right: 13px;
    }

    .caption-placeholder {
        height: 25px;
        width: 100%;
    }

    .facad {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .left-arrow-wrap, .right-arrow-wrap {
        z-index: 10;
        border: none;
        outline: none;
        background: transparent;
    }

    .info-header, .content-header {
        padding-top: 25px;
    }

    .info-header > h5, .content-header > h5 {
        font-family: 'goth';
        font-size: 18px;
    }

    .info-item {
        display: flex;
        flex-direction: row;
        width:  100%;
        height: fit-content;
        padding: 2px;
        font-family: 'goth';
        font-size: 14.5px;
        position: relative;
    }

    .detail-wrap-info {
        padding-top: 10px;
        display:  flex;
        flex-direction: column;
    }

    .info-item-content {
        padding-left: 5px;
        display: flex;
        flex-direction: column;
        color: rgb(31, 31, 184);
    }

    h5 > svg {
        position: relative;
        top: 3px;
    }

    .detail-wrap-content {
        padding-top: 10px;
        font-family: 'goth';
        padding-right: 15px;
        padding-bottom: 20px;
    }

    :global(.detail-wrap-content > p) {
        min-height: 15px;
        font-family: 'goth';
        font-size: 14px;
    }

    :global(.detail-wrap-content > h1) {
        font-size: 17px;
    }

    :global(.detail-wrap-content > h2) {
        font-size: 16px;
    }

    :global(.detail-wrap-content > h3) {
        font-size: 15px;
    }





</style>

<script>
    import axios from 'axios';
    import { createEventDispatcher, onDestroy, onMount } from 'svelte';
    import { draw } from 'svelte/transition';
    import { address } from "../../../utilities/settings";

    export let item_objs;
    export let title;
    export let location;
    export let affiliation;
    export let associate;
    export let attendee;
    export let date;
    export let produced;
    export let type;
    export let content;

    let media_hover = false;
    let curr;
    let changed = true;
    let file_copy = [...item_objs];


    curr = getMediaFromFront();
    

    var dispatch = createEventDispatcher();
    


    function hoverHandle() {
        media_hover = true;
        console.log('hover');
        setTimeout(() => {
            if (media_hover) {
                media_hover = false;
            }
        }, 4000)
    }


    function getMediaFromFront() {
        console.log(file_copy.length)
        if (file_copy) {
            let result = file_copy.shift();
            file_copy = [... file_copy, result];
            return result;
        } else {
            console.log("No file object detected")
        }
    }

    function getMediaFromBack() {
        if (file_copy) {
            let result = file_copy.pop();
            file_copy = [result, ... file_copy];
            return result;
        } else {
            console.log("No file object detected")
        }
    }

    function NavigateBack() {
        curr = getMediaFromBack();
    }

    function NavigateForth() {
        curr = getMediaFromFront();
    }

    async function videoCodecCheck() {
        if (item_objs) {
            let result = null;
            let formData = new FormData();
            formData.append('file_index', item_objs.length - 1);
            let index = 0;

            //file should be sent seperately -> don't send in form of list !
            item_objs.forEach((item) => {
                formData.append(`${index}`, item.file);
                index += 1;
            })

            result = await axios({
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                url: `http://${address}/drf/cases/codec`,
                method: "POST",
                data: formData
            })

            

            return result
        } 
        return null
    }

    function codecCheck(lst) {
        let result = false;
        if (lst) {
            result = true;
            lst.forEach((codec) => {
                if (codec != 'h264') {
                    result = false;
                }
            })
        }

        return result;
    }

    /* Test variables to be fetched from server when online */
    
    /* USER object:
            @authority - Show the contents to authorized personal only. 
                         Set false at default.
            @name      - Name of the logged in user.  
    */
    let user = {
        authority: true,
        name: "Kim"
    }


    let image;
    let video;
    let preview_source;
    let name;

    $: {
        if (image) {
            
            name = curr.file.name;

            if (image.offsetHeight > image.offsetWidth) {
                image.height = 450;
            } else {
                image.width = 450;
            }
        }
    }

    
    $:{
        if (video) {

            name = curr.file.name;

            if (video.offsetHeight > video.offsetWidth) {
                vedio.height = 450;
            } else {
                video.width = 450;
            }
        }
    }


</script>


<div class="focus">
    <div class="header">

            <div class="approved-mark-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="rgb(99, 228, 99)" height="18" width="18">
                    <path in:draw={{duration:700, speed: 1}} stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>

            <h3>
                {title}
            </h3>

            <div class="info-wrap">
                <div class="name-wrap">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" height="11" width="11">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    <div class="space"></div>
                    <h3>{associate}</h3>
                </div>
                <div class="date-wrap">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" height="11" width="11">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                    <div class="space"></div>
                    <h3>{date}</h3>
                </div>
            </div>

            <div class="icons-wrap">
                <div class="fix-wrap icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" height="18" width="18">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </div>
                <div class="bell-wrap icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" height="18" width="18">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                    </svg>
                </div>
                <div class="download-wrap icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" height="18" width="18">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                </div>
            </div>

    </div>

    <div class="body">
            <div class="body-content-wrap">
                <div class="media-wrap">
                    <div class="photo-container">
                        {#if media_hover}
                        <div class="facad">
                            <button class="left-arrow-wrap" on:click={NavigateBack}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="white" height="60" width="60">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                            </button>
                            <button class="right-arrow-wrap" on:click={NavigateForth}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="white" height="60" width="60">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>
                        </div>
                        {/if}
                        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                        {#if type == 0}
                            {#if curr}
                                <img src={curr.src} alt="main_pg_bg" bind:this={image} on:mouseover={hoverHandle}>
                                {#if media_hover}
                                    <div class="caption">
                                        <h4>{name}</h4>
                                    </div>
                                {:else}
                                    <div class="caption-placeholder"></div>
                                {/if}
                            {:else}
                                <h1>???????????? ????????????</h1>
                            {/if}
                        {:else if type == 1}
                            {#await videoCodecCheck()}
                                <h1>?????? ?????????...</h1>
                            {:then result}
                                {#if result}
                                    {#if codecCheck(eval(result.data.data))}
                                        {#key curr.src}
                                            <video controls bind:this={video} on:mouseover={hoverHandle}>
                                                <source src={curr.src} type="video/mp4">
                                            </video>
                                        {/key}
                                        {#if media_hover}
                                            <div class="caption">
                                                <h4>{name}</h4>
                                            </div>
                                        {:else}
                                            <div class="caption-placeholder"></div>
                                        {/if}
                                    {:else}
                                        <h1>?????? ????????? ???????????????</h1>
                                        <h2>??????????????? ??????????????????</h2>
                                    {/if}
                                {:else}
                                    <h1>????????? ????????????</h1>
                                {/if}
                            {:catch e}
                                <h1>????????? ???????????????</h1>
                            {/await}
                        {/if}
                    </div>
                </div>
                <div class="details-wrap">
                    <div class="info-header">
                        <h5>????????????</h5>
                    </div>
                    <div class="detail-wrap-info">
                        <div class="location-wrap info-item">
                            <div class="label">
                                <h5>????????????:</h5>
                            </div>
                            <div class="location info-item-content">
                                <h5>@{location}
                                </h5>
                            </div>
                        </div>
                        <div class="assosiate-wrap info-item">
                            <div class="label">
                                <h5>?????????:</h5>
                            </div>
                            <div class="associate info-item-content">
                                <h5>#{associate}</h5>
                            </div>
                        </div>
                        <div class="attendee-wrap info-item">
                            <div class="label">
                                <h5>???????????????:</h5>
                            </div>
                            <div class="attendees info-item-content">
                                {#each attendee as person, index}
                                    <h5>#{person}</h5>
                                {:else}
                                    <h5>?????? ???????????? ????????????.</h5>
                                {/each}
                            </div>
                        </div>
                        <div class="collected-wrap info-item">
                            {#if produced}
                                <h5>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="black" width="14" height="14">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                    </svg>
                                    ??? ???????????? ?????????????????????.
                                </h5>
                            {:else}
                                <h5>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="black" width="14" height="14">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                    </svg>
                                    ??? ???????????? ?????????????????????.
                                </h5>
                            {/if}
                        </div>
                        <div class="private-wrap info-item">
                            <!--
                            {#if file.private}
                                <h5>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="black" width="14" height="14">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                    </svg>
                                    ??? ???????????? ?????? ????????? ??????????????????.
                                </h5>
                            {:else}
                            -->
                                <h5>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="black" width="14" height="14">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                    </svg>
                                    ??? ???????????? ?????? ?????? ??????????????????.
                                </h5>
                            <!--{/if}-->
                        </div>
                    </div>
                    <div class="content-header">
                        <h5>??????</h5>
                    </div>
                    <div class="detail-wrap-content" contenteditable="false" bind:innerHTML={content}>
                    </div>
                </div>
            </div>
    </div>
</div>