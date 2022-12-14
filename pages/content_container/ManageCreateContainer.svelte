<script>
    import axios from "axios";
    import { router } from "tinro";

    import { createEventDispatcher } from "svelte";
    import { draw } from "svelte/transition";

    import Preview from "../../components/manager/CreateViews/Preview.svelte";
    import InputMultiValue from "../../components/manager/Input/InputMultiValue.svelte";
    import InputSelectValue from "../../components/manager/Input/InputSelectValue.svelte";
    import InputSingleValue from "../../components/manager/Input/InputSingleValue.svelte";
    import ManageCreateItem from "../../components/manager/ManageCreateItem.svelte";
    import Tiptap from "../../components/manager/Tiptap/Tiptap.svelte";
    import DefaultModal from "../../components/modals/DefaultModal.svelte";
    import { condition_set } from "../../utilities/inputConditions";
    import { address } from "../../utilities/settings";
    import { token } from "../../utilities/store";

    export let stage = 1;

    let saved_data = {};
    let title;
    let location;
    let affiliation;
    let associate;
    let attendee;
    let attendee_list = [];
    let date;
    let produced = -1;
    let created_at;
    let type = -1;
    let source;
    let pass_list = {
        length: () => {
            let length = 0;
            for (var item in this) {
                length += 1;
            }
            return length;
        },
        title: false,
        location: false,
        affiliation: false,
        associate: false,
        attendee: false,
        date: false,
        produced: false,
        type: false,
    };

    // FILE_UPLOADING is a flag for which to track if file is being
    // transfered in that moment of time
    let file_uploading = false;
    let all_checked = false;
    let received_file = false;
    let content = "";
    let item_objs = [];
    let accept_list = "";

    // Modals
    // Upload Fail Modal Controller
    let upload_fail = false;

    var dispatch = createEventDispatcher();

    function downloader(item) {
        if (!item) {
            console.log("cannot find item");
        }

        console.log("downloading from...", item.src);
    }

    function changeHandle(e, variable_name) {
        if (variable_name == "title") {
            title = e.detail.value;
            pass_list.title = e.detail.pass;
            pass_list = pass_list;
        } else if (variable_name == "attendee") {
            attendee = e.detail.value;
            pass_list.attendee = e.detail.pass;
            pass_list = pass_list;
        } else if (variable_name == "location") {
            location = e.detail.value;
            pass_list.location = e.detail.pass;
            pass_list = pass_list;
        } else if (variable_name == "associate") {
            associate = e.detail.value;
            pass_list.associate = e.detail.pass;
            pass_list = pass_list;
        } else if (variable_name == "date") {
            date = e.detail.value;
            pass_list.date = e.detail.pass;
            pass_list = pass_list;
        } else if (variable_name == "affiliation") {
            affiliation = e.detail.value;
            pass_list.affiliation = e.detail.pass;
            pass_list = pass_list;
        } else if (variable_name == "produced") {
            // Option input doesn't save renewed value without console.log call
            // to KEY. The reason is left unanswered.
            // DON'T REMOVE THE CONSOLE LOG BELOW!
            console.log(e.detail.key);

            produced = e.detail.key;
            pass_list.produced = e.detail.pass;
            pass_list = pass_list;
        } else if (variable_name == "type") {
            // DON'T REMOVE THE CONSOLE LOG BELOW!
            console.log(e.detail.key);

            type = e.detail.key;
            pass_list.type = e.detail.pass;
            pass_list = pass_list;
        } else {
            console.log("Change Error Occurred");
        }
    }

    // Handler is received from components

    function allCheckHandle(e) {
        if (all_checked) {
            all_checked = false;
            item_objs.forEach((item) => {
                item.checked = false;
            });
        } else {
            all_checked = true;
            item_objs.forEach((item) => {
                item.checked = true;
            });
        }

        item_objs = item_objs;
    }

    function downloadHandle(e) {
        let index = e.detail.index;
        downloader(item_objs[index]);
    }

    function deleteHandle(e) {
        let index = e.detail.index;
        if (item_objs[index]) {
            let pop_obj = item_objs.splice(index, 1);
            if (pop_obj[0].src) {
                console.log("revoking Url");
                URL.revokeObjectURL(pop_obj[0].src);
            } else {
                console.log("Url revoking error");
            }
            item_objs = item_objs;
        } else {
            console.log(`item_objs[${index}] doesn't exist`);
        }
    }

    function checkHandle(e) {
        let index = e.detail.index;
        let checked = e.detail.checked;
        if (item_objs[index]) {
            item_objs[index].checked = checked;
        } else {
            console.log(`item_objs[${index}] doesn't exist`);
        }

        item_objs = item_objs;
    }

    function contentHandle(e) {
        content = e.detail.html;
    }

    // Call is received directly from buttons

    function downloadCall() {
        item_objs.forEach((item) => {
            if (item.checked) {
                downloader(item);
                item.checked = false;
            }
        });

        item_objs = item_objs;
    }

    function deleteCall() {
        let result = getItemList();
        console.log(result.length);
        for (let i = 0; i < result.length; i++) {
            console.log(i);
            if (result[i].checked) {
                let pop_obj = result.splice(i, 1);
                if (pop_obj[0].src) {
                    console.log("revoking Url");
                    URL.revokeObjectURL(pop_obj[0].src);
                } else {
                    console.log("Url revoking error");
                }
                i = i - 1;
            }
        }

        item_objs = result;
    }

    function uploadCall() {
        console.log("uploading call received");
        let index = getItemListLength();
        waitFile(index);
    }

    function waitFile(index) {
        if (!received_file) {
            setTimeout(() => waitFile(index), 1000);
        } else {
            console.log("waitfile fired");
            let src = URL.createObjectURL(received_file[0]);
            let file = received_file[0];
            console.log("received the file:", received_file, src);

            let new_item = {
                checked: false,
                src: src,
                file: file,
            };

            item_objs = [...item_objs, new_item];
            received_file = false;
        }
    }

    // Utility functions

    function getItemListLength() {
        return getItemList().length;
    }

    function getItemList() {
        // returns copied list of ITEM_OBJS
        return [...item_objs];
    }

    async function fileUpload() {
        if (item_objs && !file_uploading) {
            let result = null;
            let formData = new FormData();
            file_uploading = true;

            try {
                let index = 0;
                formData.append("title", title);
                formData.append("file_index", item_objs.length - 1);
                formData.append("content", content);
                formData.append("attendee", attendee_list);
                formData.append("location", location);
                formData.append("affiliation", affiliation);
                formData.append("associate", associate);
                formData.append("produced", produced);
                formData.append("private", 1);
                formData.append("type", type);

                //file should be sent seperately -> don't send in form of list !
                item_objs.forEach((item) => {
                    formData.append(`${index}`, item.file);
                    index += 1;
                });

                result = await axios({
                    headers: {
                        'Authorization': `Token ${$token}`,
                        "Content-Type": "multipart/form-data",
                    },
                    url: `http://${address}/drf/cases/create/${type}`,
                    method: "POST",
                    data: formData,
                });
                
            } catch (error) {
                result = error;
                console.log(error);
                upload_fail = true;
            }

            file_uploading = false;
            console.log("file_uploading procedure ended");
            router.goto("/manage/cases");
        }
    }



    function parseToList(str) {
        // str = "#a #b #c ..."
        let str_lst = str.split(" ");
        let result = [];

        str_lst.forEach((item) => {
            result.push(item.replace(/['#']*/, ""));
        });

        return result;
    }

    function parseToString(lst) {
        let result_list = [];
        lst.forEach((item) => {
            result_list.push("'" + item + "'");
        });
        return `${result_list}`;
    }

    function passCheck(lst) {
        if (lst.length() == 1) {
            return false;
        }

        for (var item in lst) {
            if (!lst[item]) {
                return false;
            }
        }

        return true;
    }

    function modalCloseHandle(e, type) {
        if (type == 0) {
            upload_fail = e.detail.modalActive;
            router.goto("/manage/cases/browse");
        }
    }

    // stage manager
    // stage manager manages the logic behind navigation within create-container

    $: {
        if (stage == 1) {
            if (item_objs) {
                item_objs.forEach((item) => {
                    URL.revokeObjectURL(item.src);
                });
                item_objs = [];
            }
        } else if (stage == 2) {
            // parse ATTENDEE in form of list (ATTENDEE -> ATTENDEE_LIST)
            if (attendee) {
                passCheck(pass_list);
                attendee_list = parseToList(attendee);
            }
        } else if (stage == 3) {
            //let result = fileUpload();
            //console.log(result)
        } else if (stage == 4) {
            dispatch("data", {
                uncleared: [],
            });
        } else if (stage == 5) {
            dispatch("data", {
                uncleared: [1, 2, 3, 4],
            });
            fileUpload();
        }
    }

    $: {
        if (passCheck(pass_list)) {
            dispatch("data", {
                uncleared: [5],
            });
        } else {
            dispatch("data", {
                uncleared: [2, 3, 4, 5],
            });
        }
    }

    $: {
        if (type == 0) {
            accept_list = ".png, .jpg, .jpeg, .svg, .JPEG, .JPG";
        } else if (type == 1) {
            accept_list = ".wmv, .mp4, .mpg, .mpeg4, .mp3, .mov";
        } else if (type == 2) {
            accept_list = ".hwp, .pdf, .doc, .txt, .ai";
        }
    }
</script>

<div class="browse-content-container">
    {#if stage == 1}
        <div class="single-input-wrap">
            <div class="input-category-title">
                <h3>?????? ?????? ??????</h3>
            </div>
            <InputSingleValue
                placeholder="????????? ??????????????????"
                init={title}
                on:change={(e) => changeHandle(e, "title")}
                conditions={condition_set.default_conditions}
            />
            <InputMultiValue
                placeholder="?????? ??????????????? ??????????????????"
                init={attendee}
                on:change={(e) => changeHandle(e, "attendee")}
                conditions={condition_set.attendee_conditions}
            />
        </div>
        <div class="single-input-wrap">
            <div class="padding" />
            <InputSingleValue
                placeholder="?????? ????????? ??????????????????"
                init={location}
                on:change={(e) => changeHandle(e, "location")}
                conditions={condition_set.default_conditions}
            />
            <InputSelectValue
                placeholder="?????? ????????? ??????????????????"
                init={type}
                on:change={(e) => changeHandle(e, "type")}
                conditions={condition_set.select_conditions}
                option_list={["??????", "??????", "??????"]}
            />
        </div>
        <div class="single-input-wrap">
            <div class="padding" />
            <InputSelectValue
                placeholder="????????? ????????? ??????????????????"
                init={produced}
                on:change={(e) => changeHandle(e, "produced")}
                conditions={condition_set.select_conditions}
                option_list={["??????", "??????"]}
            />
            <InputSingleValue
                placeholder="?????? ????????? ??????????????????"
                init={affiliation}
                on:change={(e) => changeHandle(e, "affiliation")}
                conditions={condition_set.default_conditions}
            />
        </div>

        <div class="buffer" />

        <div class="single-input-wrap">
            <div class="input-category-title">
                <h3>?????? ??????</h3>
            </div>
            <InputSingleValue
                placeholder="???????????? ??????????????????"
                init={associate}
                on:change={(e) => changeHandle(e, "associate")}
                conditions={condition_set.default_conditions}
            />
            <InputSingleValue
                placeholder="??????????????? ??????????????????"
                init={date}
                on:change={(e) => changeHandle(e, "date")}
                conditions={condition_set.default_conditions}
            />
        </div>
    {:else if stage == 2}
        <div class="upload-view">
            <div class="header">
                {#if type == 0}
                    <h3>?????? ?????????</h3>
                {:else if type == 1}
                    <h3>?????? ?????????</h3>
                {:else if type == 2}
                    <h3>?????? ?????????</h3>
                {:else}
                    <h3>?????? ????????? ?????????</h3>
                {/if}
                <div class="control-panel">
                    <label
                        for="file-input"
                        class="file-input-label"
                        on:click={uploadCall}><h3>?????????</h3></label
                    >
                    <input
                        id="file-input"
                        name="file-input"
                        class="file-input"
                        type="file"
                        bind:files={received_file}
                        accept={accept_list}
                    />
                    <button on:click={downloadCall}><h3>??????</h3></button>
                    <button on:click={deleteCall}><h3>??????</h3></button>
                </div>
            </div>
            <div class="table-header">
                <div class="header-checkbox-container">
                    <button
                        class={all_checked ? "check-btn-clicked" : "check-btn"}
                        on:click={allCheckHandle}
                    >
                        {#if all_checked}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="white"
                                height="17"
                                width="17"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M4.5 12.75l6 6 9-13.5"
                                />
                            </svg>
                        {/if}
                    </button>
                </div>
                <div class="header-snapshot-container">
                    <div class="header-container">
                        <h3>?????????</h3>
                    </div>
                </div>
                <div class="header-title-container">
                    <div class="header-container">
                        <h3>?????????</h3>
                    </div>
                </div>
                <div class="header-download-container">
                    <div class="header-container">
                        <div class="svg-wrap">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="2"
                                stroke="currentColor"
                                height="18"
                                width="18"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="header-delete-container">
                    <div class="header-container">
                        <div class="svg-wrap">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="2"
                                stroke="currentColor"
                                height="18"
                                width="18"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            <div class="body">
                <div class="table">
                    {#each item_objs as item, index}
                        <ManageCreateItem
                            checked={item.checked}
                            src={item.src}
                            file={item.file}
                            {index}
                            {type}
                            on:delete={deleteHandle}
                            on:download={downloadHandle}
                            on:check={checkHandle}
                        />
                    {/each}
                </div>
            </div>
        </div>
    {:else if stage == 3}
        <Tiptap {content} on:change={contentHandle} />
    {:else if stage == 4}
        <Preview
            {item_objs}
            {title}
            {location}
            {affiliation}
            {associate}
            attendee={attendee_list}
            {date}
            {produced}
            {type}
            {content}
        />
    {:else if stage == 5}
        <div class="user-fetch-spinner-page">
            <div class="svg-wrap">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="0.8"
                    stroke="rgb(31, 32, 88)"
                    height="100"
                    width="100"
                >
                    <path
                        in:draw={{ duration: 700, speed: 1 }}
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 013.15 0V15M6.9 7.575a1.575 1.575 0 10-3.15 0v8.175a6.75 6.75 0 006.75 6.75h2.018a5.25 5.25 0 003.712-1.538l1.732-1.732a5.25 5.25 0 001.538-3.712l.003-2.024a.668.668 0 01.198-.471 1.575 1.575 0 10-2.228-2.228 3.818 3.818 0 00-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0116.35 15m.002 0h-.002"
                    />
                </svg>
            </div>
            {#if type == 1}
                <h4>????????? ????????? ????????????</h4>
                <h5>???????????? ????????? ?????? ???????????? ?????????</h5>
            {:else}
                <h4>???????????? ??????????????? ???????????????!</h4>
            {/if}
        </div>
    {/if}
</div>

<DefaultModal
    modalActive={upload_fail}
    on:close={(e) => modalCloseHandle(e, 0)}
>
    <h3 class="modal-header" slot="header">????????? ????????????</h3>
    <h3 class="modal-content" slot="content">????????? ????????? ???????????????</h3>
</DefaultModal>

<style>
    .browse-content-container {
        width: 960px;
        height: 550px;
        background-color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;
        box-shadow: -4px 5px 14px 0 rgb(197 197 197 / 50%);
    }

    .single-input-wrap {
        margin-top: 8px;
        width: 100%;
        height: fit-content;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
    }

    .padding {
        width: 140px;
        height: 40px;
    }

    .input-category-title {
        position: relative;
        width: 140px;
        height: 92px;
        display: flex;
        justify-content: center;
        align-items: flex-start;
    }

    .input-category-title > h3 {
        position: absolute;
        font-size: 17px;
        font-family: "goth";
        color: rgb(30, 42, 95);
        width: 100%;
        height: 20px;
        padding-left: 12px;
        padding-top: 5px;
        left: 15px;
        top: -37px;
    }

    .buffer {
        width: 100%;
        height: 50px;
    }

    .upload-view {
        width: 100%;
        height: 100%;
        z-index: 2;
        position: relative;
    }

    .header {
        height: 55px;
        width: 100%;
        background: white;
        position: absolute;
        top: 0;
        z-index: 5;
    }

    .header > h3 {
        font-family: "goth";
        font-size: 17px;
        color: #1e1c3b;
        font-weight: 900;
        position: absolute;
        left: 90px;
        bottom: 18px;
    }

    .control-panel {
        position: absolute;
        right: 18px;
        bottom: 10px;
        display: flex;
        width: 200px;
        height: fit-content;
        justify-content: space-around;
        flex-direction: row;
        align-items: center;
    }

    .control-panel > button,
    .file-input-label {
        background: rgb(31, 32, 88);
        border: none;
        border-radius: 0;
        height: 26px;
        width: 55px;
        box-shadow: -2px -3px 20px 0px rgb(197 197 197 / 50%);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .control-panel > button > h3,
    .file-input-label > h3 {
        font-family: "goth";
        font-size: 11px;
        color: whitesmoke;
    }

    .file-input {
        display: none;
    }

    .body {
        width: 100%;
        height: 100%;
        position: relative;
        overflow-y: auto;
        z-index: 3;
    }

    .table {
        width: 100%;
        height: fit-content;
        position: absolute;
        top: 100px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
    }

    .table-header {
        position: absolute;
        top: 55px;
        width: 100%;
        height: 45px;
        background-color: white;
        box-shadow: -2px -3px 20px 0px rgb(197 197 197 / 50%);
        display: grid;
        grid-template-columns: 1fr 5fr 10fr 3fr 1fr;
        z-index: 4;
    }

    .header-container {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .header-snapshot-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 45px;
        grid-column: 2 / 3;
        overflow-x: hidden;
        overflow-y: hidden;
    }

    .header-checkbox-container {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 45px;
        padding-left: 13px;
        padding-right: 8px;
        grid-column: 1 / 2;
    }

    .check-btn {
        border: thin solid rgb(31, 32, 88);
        border-radius: 0;
        height: 18px;
        width: 18px;
        box-shadow: -2px -3px 20px 0px rgb(197 197 197 / 50%);
    }

    .check-btn-clicked {
        background: rgb(31, 32, 88);
        border: none;
        border-radius: 0;
        height: 18px;
        width: 18px;
        box-shadow: -2px -3px 20px 0px rgb(197 197 197 / 50%);
    }

    .header-title-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 45px;
        grid-column: 3 / 4;
    }

    .header-download-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 45px;
        grid-column: 4 / 5;
    }

    .header-delete-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 45px;
        grid-column: 5 / 6;
    }

    .header-container > h3 {
        font-family: "goth";
        font-size: 14px;
        color: #1e1c3b;
    }

    .user-fetch-spinner-page {
        height: 100%;
        width: 100%;
        justify-content: center;
        align-items: center;
        display: flex;
        flex-direction: column;
    }

    .user-fetch-spinner-page > h4 {
        font-family: "goth";
        font-size: 30px;
        width: 400px;
        color: rgb(31, 32, 88);
        text-align: center;
    }

    .user-fetch-spinner-page > h5 {
        font-family: "goth";
        font-size: 20px;
        width: 400px;
        color: rgb(31, 32, 88);
        text-align: center;
    }
</style>
