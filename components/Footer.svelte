<style>

    
    .footer-wrap {
        position: absolute;
        width: 100%;
        height: 60px;
        bottom: 0;
        right: 0;
        left: 0;
        background-color: white;
        border-top: thin solid #d9d9db;
        z-index: 5;
    }
    
    .footer {
        display: flex;
        width: 100%;
        height: 100%;
        justify-content: start;
        align-content: center;
        margin-left: 15px;
    }

    .logo-holder {
        display: flex;
        width: 480px;
        justify-content: center;
        align-items: center;

    }
    
    .copyright, .contact {
        align-self: center;
        width: 530px;
        font-family: 'goth';
        font-size: 10px;
        color: #bbbbbd;
    }

    .contact {
        width: 160px;
    }

    .other-infos {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: end;
    }
    
    

</style>
<script></script>

<div class="footer-wrap">
    <div class="footer">
        <div class="logo-holder">
            <img src="/public/footer_logo.png" alt="navy" height="40">
        </div>
        <h3 class="copyright">
            Copyright by © 2022 해군사관학교 학술정보원. All Rights Reserved
        </h3>
        <div class="other-infos">
            <h3 class="contact">
                체계 담당자: 969-5357
            </h3>
        </div>
    </div>
</div>