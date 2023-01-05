// Settings for front-back connections and more.

let defaultCategory = [
    {
        name: "빈 목록",
        sub_category: [
            {
                name: "빈 항목",
                path: "/"
            }
        ]
    }
];

let address = "192.168.0.11:8000";


function categoryFilter(view, authority) {
    // This function returns each different categories
    // inside Browse and User Manage view by user authority

    // view == 0 -> browse view
    // view == 1 -> user manage view

    // authority == 0 -> unauthorized user
    // authority == 1 -> authorized user
    // authority == 2 -> manager (admin, ergo is_staff == 1)

    switch (view) {
        case 0:
            return browseCategoryFilter(authority);
        case 1:
            return userManageCategoryFilter(authority);
        default:
            return defaultCategory;
    }
}

function browseCategoryFilter(authority) {
    // Helper function for categoryFilter

    switch (authority) {
        case 0:
            return [
                {
                    name: "기록물 관리",
                    img: "/icons/archive.svg",
                    sub_category: [
                        {
                            name: "기록물 조회",
                            path: "/manage/cases/browse",
                        },
                    ],
                },
                {
                    name: "홈페이지",
                    img: "/icons/home.svg",
                    sub_category: [
                        {
                            name: "메인 홈페이지",
                            path: "/user",
                        },
                    ],
                },
            ];

        case 1:
            return [
                {
                    name: "기록물 조회",
                    img: "/icons/archive.svg",
                    sub_category: [
                        {
                            name: "기록물 조회",
                            path: "/manage/cases/browse/",
                        }
                    ],
                },
                {
                    name: "홈페이지",
                    img: "/icons/home.svg",
                    sub_category: [
                        {
                            name: "메인 홈페이지",
                            path: "/user",
                        },
                    ],
                },
            ];

        case 2:
            return [
                {
                    name: "기록물 관리",
                    img: "/icons/archive.svg",
                    sub_category: [
                        {
                            name: "기록물 관리",
                            path: "/manage/cases/browse",
                        },
                        {
                            name: "기록물 생성",
                            path: "/manage/cases/create",
                        },
                    ],
                },
                {
                    name: "홈페이지",
                    img: "/icons/home.svg",
                    sub_category: [
                        {
                            name: "관리자 메인",
                            path: "/manage",
                        },
                        {
                            name: "유저 메인",
                            path: "/user",
                        },
                    ],
                },
                {
                    name: "통계",
                    img: "/icons/chart.svg",
                    sub_category: [
                        {
                            name: "나의 통계",
                            path: "/manage/cases/stats/user",
                        },
                        {
                            name: "기록물 생성",
                            path: "/manage/cases/stats/",
                        },
                    ],
                },
            ];
        default:
            return defaultCategory;
    }
}

function userManageCategoryFilter(authority) {
    // Helper function to categoryFilter

    switch (authority) {
        case 0:
            return [
                {
                    name: "회원관리",
                    img: "/icons/user.svg",
                    sub_category: [
                        {
                            name: "정보 수정",
                            path: "/manage/accounts/create",
                        },
                        {
                            name: "권한 요청",
                            path: "/manage/accounts/request"
                        }
                    ],
                }
            ];

        case 1:
            return [
                {
                    name: "회원관리",
                    img: "/icons/user.svg",
                    sub_category: [
                        {
                            name: "정보 수정",
                            path: "/manage/accounts/create",
                        },
                        {
                            name: "권한 요청",
                            path: "/manage/accounts/request"
                        }
                    ],
                }
            ];

        case 2:
            return [
                {
                    name: "회원관리",
                    img: "/icons/user.svg",
                    sub_category: [
                        {
                            name: "회원 조회",
                            path: "/manage/accounts/browse",
                        },
                        {
                            name: "회원 생성",
                            path: "/manage/accounts/create",
                        },
                        {
                            name: "기록물 접근 관리",
                            path: "/manage/accounts/access-control"
                        },
                        {
                            name: "권한 요청",
                            path: "/manage/accounts/request"
                        }
                    ],
                },
                {
                    name: "소속관리",
                    img: "/icons/at.svg",
                    sub_category: [
                        {
                            name: "소속 조회",
                            path: "/manage/accounts/affiliations",
                        },
                        {
                            name: "소속 생성",
                            path: "/user/accounts/affiliations/revise",
                        },
                    ],
                },
            ];

        default:
            return defaultCategory;
    }
}


module.exports = {
    address,
    categoryFilter
}

