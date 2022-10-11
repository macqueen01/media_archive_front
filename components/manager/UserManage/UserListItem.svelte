<script>
    import { createEventDispatcher, onDestroy, onMount } from "svelte";

    export let item = item;

    var dispatch = createEventDispatcher();

    function clickCall() {
        dispatch("click", {
            item: item,
        });
    }
</script>

<div class="table-content" on:click={clickCall}>
    <div class="id-wrap wrap">
        <div class="id-container container">
            <h3>{item._id}</h3>
        </div>
    </div>
    <div class="authority-wrap">
        <div class="authority-container container">
            <h3>{item.authority}</h3>
        </div>
    </div>
    <div class="name-wrap">
        <div class="name-container container">
            <h3>{item.name}</h3>
        </div>
    </div>
    <div class="standing-wrap">
        <div class="standing-container container">
            <h3>{item.standing}</h3>
        </div>
    </div>
    <div class="date-wrap">
        <div class="date-container container">
            <h3>{item.created_at}</h3>
        </div>
    </div>
    <div class="affiliation-wrap">
        <div class="affiliation-container container">
            <h3>{item.affiliation}</h3>
        </div>
    </div>
    <div class="position-wrap">
        <div class="position-container container">
            <h3>{item.position}</h3>
        </div>
    </div>
</div>

<style>
    .table-content {
        width: 100%;
        height: 100px;
        background-color: white;
        display: grid;
        grid-template-columns: 1fr 3fr 3fr 3fr 5fr 5fr 3fr;
    }

    .id-wrap {
        height: 100px;
        grid-column: 1 / 2;
        justify-content: center;
        align-items: center;
        display: flex;
    }

    .authority-wrap {
        height: 100px;
        grid-column: 2 / 3;
        justify-content: center;
        align-items: center;
        display: flex;
    }

    .name-wrap {
        height: 100px;
        grid-column: 3 / 4;
        justify-content: center;
        align-items: center;
        display: flex;
    }

    .standing-wrap {
        height: 100px;
        grid-column: 4 / 5;
        justify-content: center;
        align-items: center;
        display: flex;
    }

    .date-wrap {
        height: 100px;
        grid-column: 5 / 6;
        justify-content: center;
        align-items: center;
        display: flex;
    }

    .affiliation-wrap {
        height: 100px;
        grid-column: 6 / 7;
        justify-content: center;
        align-items: center;
        display: flex;
    }

    .position-wrap {
        height: 100px;
        grid-column: 7 / 8;
        justify-content: center;
        align-items: center;
        display: flex;
    }

    .container {
        font-family: "goth";
        font-size: 13px;
        color: #1e1c3b;
        width: 100%;
        height: fit-content;
        text-align: center;
    }

    .container > h3 {
        font-family: "goth";
        font-size: 13px;
        color: #1e1c3b;
        width: 100%;
        height: fit-content;
    }
</style>
