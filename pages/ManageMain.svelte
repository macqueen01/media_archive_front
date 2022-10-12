<style>

    .main-view-home {
        background-image: url("main_page_bg.JPG");
        background-size: cover;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    

    .search-wrap {
        position: relative;
    }
    
    .info-wrap {
        position: relative;
        top: 150px;
        height: 215px;
        display: flex;
        align-items: center;
    }
    

    
    
</style>

<script>

    import { Route } from 'tinro';
    import Search from '../components/Search.svelte';
    import Info from './Info.svelte';
    
</script>



    <div class="main-view-home">
        <div class="search-wrap">
            <Search />
        </div>
        <div class="info-wrap">
            <Info />
        </div>
    </div>
