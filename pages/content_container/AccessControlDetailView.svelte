<script>
    import { Route, meta, router } from "tinro";
    import axios from "axios";
    import { draw, fade } from "svelte/transition";
    import { createEventDispatcher, onMount } from "svelte";

    import InputSingleValue from "../../components/manager/Input/InputSingleValue.svelte";
    import InputSelectValue from "../../components/manager/Input/InputSelectValue.svelte";
    import { condition_set } from "../../utilities/inputConditions";
    import { address } from "../../utilities/settings";
    import { token } from "../../utilities/store";
    import DefaultModal from "../../components/modals/DefaultModal.svelte";
    import ModalWithButton from "../../components/modals/ModalWithButton.svelte";

    /* 
        FILE inherits FOCUS obj from ContentContainer.
    */

    export let request;
    let acceptList = [];
    let declineList = [];
    let fetched;
    let item_objs = [];
    let status = {};
    let form;
    let id;
    let apply_fail = false;

    var dispatch = createEventDispatcher();

    function undoFocus() {
        dispatch("escape", {
            focus: null,
        });
    }

    async function withdrawCall() {
        let post_result;

        if (form == 0) {
            let data = {};
            data = static_access_request_parser(fetched.data, 2);
            data.request_form = form;
            data.request_id = id;

            post_result = axios({
                url: `http://${address}/drf/request/resolve`,
                method: "post",
                data: data,
                headers: {
                    Authorization: `Token ${$token}`,
                },
            });
        } else {
            post_result = axios({
                url: `http://${address}/drf/request/resolve`,
                method: "post",
                data: {
                    request_form: form,
                    request_id: id,
                    status: 2,
                },
                headers: {
                    Authorization: `Token ${$token}`,
                },
            });
        }

        post_result.then(response => {
            router.goto("/manage/accounts");
        }).catch(e => {
            apply_fail = true;
        })
    }

    async function acceptCall() {
        let post_result;

        if (form == 0) {
            let data = {};
            data = access_request_parser(fetched.data, status);
            data.request_form = form;
            data.request_id = id;

            post_result = axios({
                url: `http://${address}/drf/request/resolve`,
                method: "post",
                data: data,
                headers: {
                    Authorization: `Token ${$token}`,
                },
            });

        } else {
            post_result = axios({
                url: `http://${address}/drf/request/resolve`,
                method: "post",
                data: {
                    request_form: form,
                    request_id: id,
                    status: 1,
                },
                headers: {
                    Authorization: `Token ${$token}`,
                },
            });
        }

        post_result.then(response => {
            router.goto("/manage/accounts");
        }).catch(e => {
            apply_fail = true;
        })
    }

    async function rejectAllCall() {
        let post_result;

        if (form == 0) {
            let data = {};
            data = static_access_request_parser(fetched.data, 0);
            data.status = 0;
            data.request_form = form;
            data.request_id = id;

            post_result = axios({
                url: `http://${address}/drf/request/resolve`,
                method: "post",
                data: data,
                headers: {
                    Authorization: `Token ${$token}`,
                },
            });

        } else {
            post_result = axios({
                url: `http://${address}/drf/request/resolve`,
                method: "post",
                data: {
                    request_form: form,
                    request_id: id,
                    status: 0,
                },
                headers: {
                    Authorization: `Token ${$token}`,
                },
            });
        }

        post_result.then(response => {
            router.goto("/manage/accounts");
        }).catch(e => {
            apply_fail = true;
        })
    }



    async function getRequestFromId(request) {
        console.log(request.id, request.request_form)
        fetched = await axios({
            url: `http://${address}/drf/request/detail?form=${request.request_form}&id=${request.id}`,
            method: "get",
            headers: {
                Authorization: `Token ${$token}`,
            }
        });
        return fetched.data;
    }

    function clickCall(type, index) {
        if (type == 1 && !acceptClicked(index)) {
            if (declineClicked(index)) {
                let pop_index = declineList.indexOf(index);
                declineList.splice(pop_index, 1);
            }
            acceptList = [...acceptList, index];
            declineList = declineList;

            let component = fetched.data.request_components[index];

            if (component.requesting_case_form == 0) {
                status.image_case[component.image_case.id] = 1;
            } else if (component.requesting_case_form == 1) {
                status.video_case[component.video_case.id] = 1;
            } else {
                status.doc_case[component.doc_case.id] = 1;
            }
            return acceptList;
        } else if (type == 0 && !declineClicked(index)) {
            if (acceptClicked(index)) {
                let pop_index = acceptList.indexOf(index);
                acceptList.splice(pop_index, 1);
            }
            declineList = [...declineList, index];
            acceptList = acceptList;

            let component = fetched.data.request_components[index];

            if (component.requesting_case_form == 0) {
                status.image_case[component.image_case.id] = 1;
            } else if (component.requesting_case_form == 1) {
                status.video_case[component.video_case.id] = 1;
            } else {
                status.doc_case[component.doc_case.id] = 1;
            }
            return declineList;
        }
    }

    function acceptClicked(index) {
        return acceptList.includes(index);
    }

    function accepted(index) {
        if (acceptClicked(index)) {
            acceptList = acceptList;
            return "white";
        } else {
            acceptList = acceptList;
            return "currentColor";
        }
    }

    function declineClicked(index) {
        return declineList.includes(index);
    }

    function declined(index) {
        if (declineClicked(index)) {
            declineList = declineList;
            return "white";
        } else {
            declineList = declineList;
            return "currentColor";
        }
    }

    // Utility functions

    function getItemListLength() {
        return getItemList().length;
    }

    function getItemList() {
        return [...item_objs];
    }

    function static_access_request_parser(data, status) {
        if ((data.request_form == 1) || !(status in [0,1,2])) {
            return false;
        }
        let result = {};
        result.image_case = {};
        result.video_case = {};
        result.doc_case = {};
        data.request_components.forEach((comp) => {
            if (comp.requesting_case_form == 0) {
                result.image_case[comp.image_case.id] = status;
            } else if (comp.requesting_case_form == 1) {
                result.video_case[comp.video_case.id] = status;
            } else if (comp.requesting_case_form == 2) {
                result.doc_case[comp.doc_case.id] = status;
            } else {
                return false;
            }
        });

        return result;
    }

    function access_request_parser(data, status) {
        if (data.request_form == 1) {
            return false;
        }

        let result = {};
        result.image_case = {};
        result.video_case = {};
        result.doc_case = {};
        data.request_components.forEach((comp) => {
            if (comp.requesting_case_form == 0) {
                result.image_case[comp.image_case.id] = status.image_case[comp.image_case.id];
            } else if (comp.requesting_case_form == 1) {
                result.video_case[comp.video_case.id] = status.video_case[comp.video_case.id];
            } else if (comp.requesting_case_form == 2) {
                result.doc_case[comp.doc_case.id] = status.doc_case[comp.doc_case.id];
            } else {
                return false;
            }
        });

        return result;
    }

    $: {
        if (fetched && fetched.data && fetched.data.request_form == 0) {
            // initializes status with all component's status as undecided == 2
            status = static_access_request_parser(fetched.data, 2);
            form = 0;
            id = fetched.data.id;
        } else if (fetched && fetched.data && fetched.data.request_form == 1) {
            form = 1;
            id = fetched.data.id;
        }
    }

    /* Test variables to be fetched from server when online */

    /* USER object:
            @authority - Show the contents to authorized personal only. 
                         Set false at default.
            @name      - Name of the logged in user.  
    */
    let user = {
        _id: 2,
        registered_id: "sampleId",
        name: "김재우",
        authority: 1,
        standing: "상병",
        position: "전산병",
        affiliation: "학술정보원 멀티미디어교실",
        created_at: "22년 2월 3일",
        ip_address: "192.168.0.101",
        registered_by: "김재우",
        date: "2022년 12월 12일",
    };

    let name = user.name;
    let registered_by = user.registered_by;
    let registered_id = user.registered_id;
    let affiliation = user.affiliation;
    let ip_address = user.ip_address;
    let date = user.date;
    let authority = user.authority;
    let standing = user.standing;
    let position = user.position;
</script>

<div class="focus">
    <div class="header">
        <div class="back-btn-wrap">
            <button class="back-btn" on:click={undoFocus}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    class="w-6 h-6"
                    height="18"
                    width="18"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                    />
                </svg>
            </button>
        </div>
        {#await getRequestFromId(request)}
            <div class="title-wrap">
                <h3>파일을 받아오는 중입니다</h3>
            </div>
        {:then result}
            <div class="title-wrap">
                <h3>
                    {result.title}
                </h3>
                <div class="approved-mark-wrap">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="rgb(99, 228, 99)"
                        height="18"
                        width="18"
                    >
                        <path
                            in:draw={{ duration: 700, speed: 1 }}
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
            </div>

            <div class="info-wrap">
                <div class="name-wrap">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        height="11"
                        width="11"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        />
                    </svg>
                    <div class="space" />
                    {#if request.request_form == 1}
                        <h3>{result.request_form1_requested_by.name}</h3>
                    {:else}
                        <h3>{result.request_form0_requested_by.name}</h3>
                    {/if}
                </div>
                <div class="date-wrap">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        height="11"
                        width="11"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                        />
                    </svg>
                    <div class="space" />
                    <h3>{result.created_at.split("T")[0]}</h3>
                </div>
            </div>
        {:catch error}
            <div class="title-wrap">
                {#if error.response.status == 404}
                    <h3>해당 요청이 없습니다</h3>
                {:else}
                    <h3>다시 시도 바랍니다</h3>
                {/if}
                <div class="approved-mark-wrap">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="rgb(226, 41, 41)"
                        height="18"
                        width="18"
                    >
                        <path
                            in:draw={{ duration: 700, speed: 1 }}
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                        />
                    </svg>
                </div>
            </div>
        {/await}
    </div>

    <div class="body">
        <div class="body-content-wrap">
            {#if fetched && fetched.data}
                <div class="single-input-wrap">
                    <div class="input-category-title">
                        <h3>회원 정보</h3>
                    </div>
                    <InputSingleValue
                        placeholder="이름"
                        init={name}
                        conditions={condition_set.unchangable_conditions(
                            "여기서는"
                        )}
                        immutable={true}
                    />
                    <InputSingleValue
                        placeholder="아이디"
                        init={registered_id}
                        conditions={condition_set.unchangable_conditions(
                            "여기서는"
                        )}
                    />
                </div>
                <div class="single-input-wrap">
                    <div class="padding" />
                    <InputSingleValue
                        placeholder="계급"
                        init={standing}
                        conditions={condition_set.unchangable_conditions(
                            "여기서는"
                        )}
                        immutable={true}
                    />
                    <InputSingleValue
                        placeholder="직별 혹은 직책"
                        init={position}
                        conditions={condition_set.unchangable_conditions(
                            "여기서는"
                        )}
                        immutable={true}
                    />
                </div>
                <div class="single-input-wrap">
                    <div class="padding" />
                    <InputSingleValue
                        placeholder="소속"
                        init={affiliation}
                        conditions={condition_set.unchangable_conditions(
                            "여기서는"
                        )}
                        immutable={true}
                    />
                    <InputSingleValue
                        placeholder="등록 번호"
                        init={id}
                        conditions={condition_set.unchangable_conditions(
                            "여기서는"
                        )}
                        immutable={true}
                    />
                </div>
                <div class="single-input-wrap">
                    <div class="padding" />
                    <InputSingleValue
                        placeholder="등록 일자"
                        init={date}
                        conditions={condition_set.unchangable_conditions(
                            "여기서는"
                        )}
                        immutable={true}
                    />
                    <InputSingleValue
                        placeholder="등록 IP"
                        init={ip_address}
                        conditions={condition_set.unchangable_conditions(
                            "여기서는"
                        )}
                        immutable={true}
                    />
                </div>
                <div class="single-input-wrap">
                    <div class="padding" />
                    <InputSelectValue
                        placeholder="권한 종류"
                        init={authority}
                        conditions={condition_set.default_conditions}
                        option_list={["비인가", "일반 유저", "관리자"]}
                        immutable={true}
                    />
                    <InputSingleValue
                        placeholder="권한 부여자"
                        init={registered_by}
                        conditions={condition_set.unchangable_conditions(
                            "권한 부여자"
                        )}
                        immutable={true}
                    />
                </div>

                <div class="buffer" />

                <div class="single-input-wrap">
                    <div class="input-category-title">
                        <h3>요청 사항</h3>
                    </div>
                    {#if request.request_form == 0}
                        <div class="browsing-request-wrap ">
                            {#each fetched.data.request_components as request_comp, index}
                                <div class="browsing-request-container">
                                    <div class="request-content-container">
                                        {#if request_comp.requesting_case_form == 0}
                                            <h3>등록 번호</h3>
                                            <div class="whitespace" />
                                            <h4>
                                                {request_comp.image_case.id}
                                            </h4>
                                            <div class="whitespace" />
                                            <h3>의 기록물</h3>
                                            <div class="whitespace" />
                                            <h4
                                                on:click={() =>
                                                    router.goto(
                                                        `/manage/cases/browse/0/${request_comp.image_case.id}`
                                                    )}
                                            >
                                                #{request_comp.image_case.title}
                                            </h4>
                                            <h5
                                                on:click={() =>
                                                    router.goto(
                                                        `/manage/cases/browse/0/${request_comp.image_case.id}`
                                                    )}
                                            >
                                                (눌러서 이동)
                                            </h5>
                                            <div class="whitespace" />
                                            <h3>에 대한 열람 권한</h3>
                                        {:else if request_comp.requesting_case_form == 1}
                                            <h3>등록 번호</h3>
                                            <div class="whitespace" />
                                            <h4>
                                                {request_comp.video_case.id}
                                            </h4>
                                            <div class="whitespace" />
                                            <h3>의 기록물</h3>
                                            <div class="whitespace" />
                                            <h4
                                                on:click={() =>
                                                    router.goto(
                                                        `/manage/cases/browse/1/${request_comp.video_case.id}`
                                                    )}
                                            >
                                                #{request_comp.video_case.title}
                                            </h4>
                                            <h5
                                                on:click={() =>
                                                    router.goto(
                                                        `/manage/cases/browse/1/${request_comp.video_case.id}`
                                                    )}
                                            >
                                                (눌러서 이동)
                                            </h5>
                                            <div class="whitespace" />
                                            <h3>에 대한 열람 권한</h3>
                                        {:else}
                                            <h3>등록 번호</h3>
                                            <div class="whitespace" />
                                            <h4>{request_comp.doc_case.id}</h4>
                                            <div class="whitespace" />
                                            <h3>의 기록물</h3>
                                            <div class="whitespace" />
                                            <h4
                                                on:click={() =>
                                                    router.goto(
                                                        `/manage/cases/browse/2/${request_comp.doc_case.id}`
                                                    )}
                                            >
                                                #{request_comp.doc_case.title}
                                            </h4>
                                            <h5
                                                on:click={() =>
                                                    router.goto(
                                                        `/manage/cases/browse/2/${request_comp.doc_case.id}`
                                                    )}
                                            >
                                                (눌러서 이동)
                                            </h5>
                                            <div class="whitespace" />
                                            <h3>에 대한 열람 권한</h3>
                                        {/if}
                                    </div>
                                    <div class="select-wrap">
                                        <div
                                            class={acceptList.includes(index)
                                                ? "accept-container-clicked container"
                                                : "accept-container container"}
                                            on:click={() => clickCall(1, index)}
                                        >
                                            <div class="accept-svg">
                                                {#if !acceptList.includes(index)}
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
                                                            d="M4.5 12.75l6 6 9-13.5"
                                                        />
                                                    </svg>
                                                {:else}
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke-width="2"
                                                        stroke="white"
                                                        height="18"
                                                        width="18"
                                                    >
                                                        <path
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            d="M4.5 12.75l6 6 9-13.5"
                                                        />
                                                    </svg>
                                                {/if}
                                            </div>
                                            <h3
                                                class={acceptList.includes(
                                                    index
                                                )
                                                    ? "clicked"
                                                    : "unclicked"}
                                            >
                                                수락
                                            </h3>
                                        </div>
                                        <div
                                            class={declineList.includes(index)
                                                ? "decline-container-clicked container"
                                                : "decline-container container"}
                                            on:click={() => clickCall(0, index)}
                                        >
                                            <div class="decline-svg">
                                                {#if !declineList.includes(index)}
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke-width="1.5"
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
                                                {:else}
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke-width="1.5"
                                                        stroke="white"
                                                        height="18"
                                                        width="18"
                                                    >
                                                        <path
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            d="M6 18L18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                {/if}
                                            </div>
                                            <h3
                                                class={declineList.includes(
                                                    index
                                                )
                                                    ? "clicked"
                                                    : "unclicked"}
                                            >
                                                거절
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            {:else}
                                <div class="no-case-id">
                                    <h3>요청이 비어있습니다</h3>
                                </div>
                            {/each}
                        </div>
                    {:else if request.reqeust_form == 1}
                        <div class="authority-request-wrap">
                            <div class="authority-wrap">
                                <h5 class="label">권한 종류</h5>
                                <h3>
                                    {["비인가", "일반 유저", "관리자"][
                                        user.authority
                                    ]}
                                </h3>
                            </div>
                            <div class="svg-wrap">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="rgb(26, 26, 128)"
                                    height="40"
                                    width="40"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                                    />
                                </svg>
                            </div>
                            <div class="authority-wrap">
                                <h5 class="label">권한 종류</h5>
                                <h3>
                                    {["비인가", "일반 유저", "관리자"][
                                        request.auth_to
                                    ]}
                                </h3>
                            </div>
                            <div class="rest-text">
                                <h3>로 수정</h3>
                            </div>
                        </div>
                    {/if}
                </div>

                <div class="buffer" />

                <div class="single-input-wrap">
                    <div class="input-category-title">
                        <h3>사유</h3>
                    </div>
                    <div class="text-wrap">
                        <h5>
                            안녕하십니까, 상병 김재우입니다. 다름이 아니라 이번
                            순항훈련전단에서 지금까지 있었던 순항훈련 기록물을
                            참고하여 기항지 탐색/조사를 시행하려 합니다. 협조
                            부탁드립니다
                        </h5>
                    </div>
                </div>
                <div class="btn-control-wrap">
                    <div class="btn-container">
                        <button class="withdraw-btn btn" on:click={withdrawCall}>
                            <h3>보류하기</h3>
                        </button>
                        <button class="accept-btn btn" on:click={acceptCall}>
                            <h3>적용하기</h3>
                        </button>
                        <button class="decline-btn btn" on:click={rejectAllCall}>
                            <h3>거부하기</h3>
                        </button>
                    </div>
                </div>
            {:else}
                Error!
            {/if}
        </div>
    </div>
</div>


{#if apply_fail}
<ModalWithButton>
    <h3 class="modal-header" slot="header">Header</h3>
    <h3 class="modal-content" slot="content">Content</h3>
    <button class="modal-btn-1" slot="btn-1">BUTTON1</button>
    <button class="modal-btn-2" slot="btn-2">BUTTON2</button>
</ModalWithButton>
{/if}

<style>
    .focus {
        width: 100%;
        height: 100%;
        z-index: 3;
        position: relative;
        overflow-y: auto;
        overflow-x: hidden;
        position: absolute;
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
        font-family: "goth";
        font-size: 17px;
        color: #1e1c3b;
        font-weight: 900;
        position: absolute;
        left: 90px;
        bottom: 18px;
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
        position: relative;
        width: fit-content;
        height: fit-content;
        left: 6px;
        bottom: -2px;
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

    .name-wrap > h3,
    .date-wrap > h3 {
        font-family: "goth";
        font-weight: 900;
        font-size: 11px;
    }

    .space {
        width: 7px;
        height: 100%;
    }

    .body-content-wrap {
        position: relative;
        top: 95px;
        height: fit-content;
        width: 100%;
        background: white;
    }

    .single-input-wrap {
        margin-top: 8px;
        width: 100%;
        height: fit-content;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        position: relative;
    }

    .padding {
        width: 140px;
        height: 40px;
    }

    .input-category-title {
        width: 140px;
        min-height: 92px;
        display: flex;
        justify-content: center;
        align-items: flex-start;
    }

    .input-category-title > h3 {
        position: absolute;
        font-size: 17px;
        font-family: "goth";
        color: rgb(30, 42, 95);
        width: 200px;
        height: 20px;
        padding-left: 12px;
        padding-top: 5px;
        left: 40px;
        top: -37px;
    }

    .buffer {
        width: 100%;
        height: 50px;
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

    .title-wrap {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: fit-content;
        height: fit-content;
        position: absolute;
        left: 90px;
        bottom: 18px;
    }

    .title-wrap > h3 {
        font-family: "goth";
        font-size: 17px;
        color: #1e1c3b;
        font-weight: 900;
    }

    .body {
        width: 100%;
        height: 100%;
        position: relative;
        overflow-y: auto;
        z-index: 3;
        background-color: white;
    }

    .browsing-request-wrap {
        width: 720px;
        height: fit-content;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }

    .browsing-request-container {
        width: 90%;
        height: 45px;
        padding-right: 10px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        background: whitesmoke;
        padding-left: 15px;
        margin-bottom: 14px;
        border-radius: 5px;
        position: relative;
    }

    .request-content-container {
        height: fit-content;
        width: 100%;
        justify-content: flex-start;
        align-items: baseline;
        display: flex;
        flex-direction: row;
    }

    .request-content-container > h3 {
        font-family: "goth";
        font-size: 15px;
        color: rgb(15, 21, 46);
    }

    .request-content-container > h4 {
        font-family: "goth";
        font-size: 16px;
        color: rgb(31, 31, 184);
    }

    .request-content-container > h5 {
        font-family: "goth";
        font-size: 8px;
        color: rgb(26, 26, 128);
    }

    .decline-container-clicked {
        background-color: rgb(226, 41, 41);
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
    }

    .accept-container-clicked {
        background-color: rgb(99, 228, 99);
    }

    .clicked {
        color: white;
    }

    .unclicked {
        color: currentColor;
    }

    .container {
        width: 50px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .container > h3 {
        font-size: 11px;
        font-family: "goth";
    }

    .select-wrap {
        width: 100px;
        height: 100%;
        position: absolute;
        right: 0;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        display: flex;
        flex-direction: row;
    }

    .whitespace {
        width: 10px;
    }

    .authority-request-wrap {
        width: 720px;
        height: 100%;
        padding-right: 10px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        padding-bottom: 10px;
    }

    .label {
        font-size: 10px;
        font-family: "goth";
        color: rgb(26, 26, 128);
    }

    .authority-wrap > h3 {
        font-size: 16px;
        font-family: "goth";
    }

    .rest-text > h3 {
        font-size: 15px;
        font-family: "goth";
    }

    .text-wrap {
        width: 720px;
        min-height: 93px;
    }

    .text-wrap > h5 {
        font-size: 14.5px;
        font-family: "goth";
        width: 95%;
    }

    .btn-control-wrap {
        width: 100%;
        height: 80px;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        bottom: 0;
        right: 0;
    }

    .btn-container {
        width: 350px;
        display: flex;
        height: 100%;
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
        margin-right: 15px;
    }

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
</style>
