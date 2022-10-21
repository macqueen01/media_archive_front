const condition_set = {};



condition_set.default_conditions = [
    {
        condition: (val) => {
            if (val.length >= 1) {
                return true;
            }

            return false;
        },
        name: "longerThanOneLetter",
        not_satisfied_text: "최소 한자 이상 들어가야 합니다",
        satisfied_text: "좋습니다!"
    },
    {
        condition: (val) => {
            if (val.length <= 20) {
                return true;
            }

            return false;
        },
        name: "shorterThanGivenLength",
        not_satisfied_text: "더 짧게 입력해주세요"
    }
]

condition_set.attendee_conditions = [
    {
        condition: (val) => {
            let words = val.split(' ');
            if (words.length >= 1 && words[0] != '' && words[0] != '#') {
                return true;
            } 
            return false;
        },
        name: "longerThanOneWord",
        not_satisfied_text: "인물이 한명 이상 들어가야 합니다",
        satisfied_text: "좋습니다!"
    }
]

condition_set.select_conditions = [
    {
        condition: (val) => {
            if (val == -1) {
                return false;
            } else {
                return true;
            }
        },
        name: "pickOne",
        not_satisfied_text: "한개를 반드시 선택해야 합니다",
        satisfied_text: "좋습니다!"
    }
]

condition_set.unchangable_conditions = (type) => {
    return [{
        condition: (val) => {
            return true;
        },
        name: "unchangable",
        not_satisfied_text: "오류",
        satisfied_text: `${type} 임의로 바꿀 수 없습니다`
    }]
}

condition_set.registered_id_conditions = [
    {
        condition: (val) => {
            if (val.length < 6) {
                return false;
            }
            return true;
        },
        name: "longerThanSixLetters",
        not_satisfied_text: "아이디는 최소 6자 이상이어야 합니다",
        satisfied_text: '좋습니다!'
    }, {
        condition: (val) => {
            if (val.includes(' ')) {
                return false;
            }
            return true;
        },
        name: "noWhiteSpace",
        not_satisfied_text: "공백이 들어가서는 안됩니다",
        satisfied_text: '좋습니다!'
    }
]

export {condition_set};
