<style>

    @font-face {
        font-family: 'goth';
        font-style: normal;
        font-weight: 500;
        src: url('/fonts/GothicA1-Regular.ttf');
    }
    
    @font-face {
	    font-family: "gothThin";
	    font-style: normal;
	    font-weight: 100;
    	src: url("/fonts/GothicA1-Thin.ttf");
    }

    @font-face {
	    font-family: "gothSemiBold";
	    font-style: normal;
	    font-weight: 600;
    	src: url("/fonts/GothicA1-SemiBold.ttf");
    }

    @font-face {
	    font-family: "gothBold";
	    font-style: normal;
	    font-weight: 700;
    	src: url("/fonts/GothicA1-Bold.ttf");
    }
    


    :global(*) {
        margin: 0;
        padding: 0;
    }
    
    :global(html) {
        width: 100%;
        height: 100%;
        background-color: whitesmoke;
        font-family: gothRegular;
        overflow-x: hidden;
    }
    
    :global(body) {
        width: 100%;
        height: 100%;
        overflow-x: hidden;
    }
    
    :global(a) {
        text-decoration: none;
    }
    
    main {
        position: relative;
        height: 100%;
        width: 100%;
        overflow-y: hidden;
        overflow-x: hidden;
    }
</style>


<script>

    /* Main entrance to Naval Academy Media Archive */

    import { Route } from "tinro";
    import { token } from './utilities/store';
    
    /* Imports control panel */
    import UserNavbar from "./components/user/UserNavbar.svelte";
    import ManageNavbar from './components/manager/ManageNavbar.svelte';
    import Footer from "./components/Footer.svelte";
    
    /* Imports pages */
    import UserMain from "./pages/UserMain.svelte";
    import Login from "./pages/Auth/Login.svelte";
    import Signin from "./pages/Auth/Signin.svelte";
    import Browse from "./pages/Browse.svelte";
    import ManageMain from "./pages/ManageMain.svelte";
    import ManageBrowse from './pages/ManageBrowse/ManageBrowse.svelte';
    import ManageUserMain from './components/manager/UserManage/ManageUserMain.svelte';
    import Help from "./pages/Help.svelte";
    import Stats from "./pages/Stats.svelte";

    // These are axios test for backends

    import axios from 'axios';


    let localToken = localStorage.getItem('token');

    if ($token != localToken) {
        token.set(localToken);
    }



    
  

</script>

<main>
    <Route path="/" redirect="/user">

        <UserMain />
        
    </Route>

    <Route path="/auth/*">
        
        <Route path="/login">
            <Login />
        </Route>

        <Route path="/signin">
            <Signin />
        </Route>
    </Route>

    <Route path="/user/*">

        <Route path="/">
            <UserMain />
        </Route>

        <Route path="/browse/*">
            <UserNavbar />
            <Browse />
        </Route>

    </Route>

    <Route path="/manage/*">

        <ManageNavbar />

        <Route path="/">
            <ManageMain />
        </Route>

        <Route path="/cases/*">
            <ManageBrowse />
        </Route>

        <Route path="/accounts/*">
            <ManageUserMain />
        </Route>

    </Route>
    
    <Footer /> 
</main>