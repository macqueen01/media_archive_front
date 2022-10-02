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
        font-size: 12px;
        font-family: 'goth';
    }




    

</style>

<script>
    import { Route, meta, router } from 'tinro';
    import axios from 'axios';
    import { draw, fade } from 'svelte/transition';
    import { createEventDispatcher, onMount } from 'svelte';




    /* 
        FILE inherits FOCUS obj from ContentContainer.
    */

    export let file;

    const route = meta();

    let file_id = route.params._id;
    let img_hover = false;
    let curr;
    let status = 0;


    curr = getPhotoFromFront();
    console.log(curr);
    



    var dispatch = createEventDispatcher();
    


    function hoverHandle() {
        img_hover = true;
        setTimeout(() => {
            if (img_hover) {
                img_hover = false;
            }
        }, 4000)
    }


    function undoFocus() {
        dispatch('escape', {
            focus: null
        });
        router.goto('/manage/cases');
    }

    /* copies file.src into fileLst */

    function getPhotoFromFront() {
        if (file) {
            let result = file.src.shift();
            file.src = [... file.src, result];
            return result;
        } else {
            console.log("No file object detected")
        }
    }

    function getPhotoFromBack() {
        if (file) {
            let result = file.src.pop();
            file.src = [result, ... file.src];
            return result;
        } else {
            console.log("No file object detected")
        }  
    }

    function imageNavigateBack() {
        curr = getPhotoFromBack();
    }

    function imageNavigateForth() {
        curr = getPhotoFromFront();
    }


    async function getDataFromId(id) {
        file = await axios.get(`http://localhost:4000/browse/${id}`);
        return file
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
    let source;
    let name;

    $: {
        if (image) {
            
            source = curr.split('/');
            name = source.pop();

            if (image.offsetHeight > image.offsetWidth) {
                image.height = 450;
            } else {
                image.width = 450;
            }
        }
    }

    file = {
            type: 'photos',
            _id: 1,
            uploader_id: 2,
            associate: "김재우",
            location: "학술정보원",
            collected: true,
            private: false,
            attendee: ["교장", "부교장", "대통령", "국방부장관", "생도"],
            created_at: "22년 2월 3일",
            title: "이인호 동상 앞에서",
            src: [
                "/public/main_page_bg.JPG",
                "/public/nama_logo.png",
                "/public/navy-logo.JPG"
            ],
            content: "<h4>This is sample content of the post.<h4>"
        }

    
</script>            
           

<div class="focus">
    <div class="header">
        <div class="back-btn-wrap">
            <button class="back-btn" on:click={undoFocus}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6" height="18" width="18">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"/>
                </svg>
            </button>
        </div>
        {#await getDataFromId(file_id)}
            <div class="approved-mark-wrap">
            </div>
            <h3>
                파일을 받아오는 중입니다
            </h3>
        {:then result}
            <div class="approved-mark-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="rgb(99, 228, 99)" height="18" width="18">
                    <path in:draw={{duration:700, speed: 1}} stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h3>
                {result.title}
            </h3>
        {:catch error}
            <div class="approved-mark-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="rgb(226, 41, 41)" height="18" width="18">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
            </div>
            <h3>
                다시 시도 바랍니다
            </h3>
        {/await}


        {#if status == 1}
            <div class="info-wrap">
                <div class="name-wrap">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" height="11" width="11">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    <div class="space"></div>
                    <h3>{file.associate}</h3>
                </div>
                <div class="date-wrap">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" height="11" width="11">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                    <div class="space"></div>
                    <h3>{file.created_at}</h3>
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
        {/if}
    </div>

    <div class="body">
        {#if user.authority}
            <div class="body-content-wrap">
                <!-- awaits until file is fetched from the server -->
                {#if status == 0}
                <div class="media-wrap">
                    <div class="photo-container">
                        {#if img_hover}
                        <div class="facad">
                            <div class="left-arrow-wrap" on:click={imageNavigateBack}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="white" height="60" width="60">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                            </div>
                            <div class="right-arrow-wrap" on:click={imageNavigateForth}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="white" height="60" width="60">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                            </div>
                        </div>
                        {/if}
                        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                        <img src={curr} alt="main_pg_bg" bind:this={image} on:mouseover={hoverHandle}>
                        {#if img_hover}
                            <div class="caption">
                                <h4>{name}</h4>
                            </div>
                        {:else}
                            <div class="caption-placeholder"></div>
                        {/if}
                    </div>
                </div>

                <div class="details-wrap">
                    <div class="info-header">
                        <h5>세부사항</h5>
                    </div>
                    <div class="detail-wrap-info">
                        <div class="location-wrap info-item">
                            <div class="label">
                                <h5>대표장소:</h5>
                            </div>
                            <div class="location info-item-content">
                                <h5>@{file.location}
                                </h5>
                            </div>
                        </div>
                        <div class="assosiate-wrap info-item">
                            <div class="label">
                                <h5>촬영자:</h5>
                            </div>
                            <div class="associate info-item-content">
                                <h5>#{file.associate}</h5>
                            </div>
                        </div>
                        <div class="attendee-wrap info-item">
                            <div class="label">
                                <h5>주요참석자:</h5>
                            </div>
                            <div class="attendees info-item-content">
                                {#each file.attendee as attendee, index}
                                    <h5>#{attendee}</h5>
                                {:else}
                                    <h4>주요 참석자가 없습니다.</h4>
                                {/each}
                            </div>
                        </div>
                        <div class="collected-wrap info-item">
                            {#if file.collected}
                                <h5>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="black" width="14" height="14">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                    </svg>
                                    본 기록물은 수집되었습니다.
                                </h5>
                            {:else}
                                <h5>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="black" width="14" height="14">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                    </svg>
                                    본 기록물은 생산되었습니다.
                                </h5>
                            {/if}
                        </div>
                        <div class="private-wrap info-item">
                            {#if file.private}
                                <h5>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="black" width="14" height="14">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                    </svg>
                                    본 기록물은 또한 비공개 기록물입니다.
                                </h5>
                            {:else}
                                <h5>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="black" width="14" height="14">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                    </svg>
                                    본 기록물은 또한 공개 기록물입니다.
                                </h5>
                            {/if}
                        </div>
                    </div>
                    <div class="content-header">
                        <h5>설명</h5>
                    </div>
                    <div class="detail-wrap-content" contenteditable="true" bind:innerHTML={file.content}>
                    </div>
                </div>
                {:else if status == 2}
                    Error!
                {/if}
            </div>
        {:else}
            <div class="body-content-wrap-unauthorized"></div>
        {/if}
    </div>


</div>