import axios from 'axios';

axios.post(
    'http://localhost:8000/drf/user/create',
    {
        name: 'kim',
        username: 'jae',
        position: '상병',
        affiliation: '학정원',
        standing: '멀티병',
        password: 'aidan1004!'
    }
).then((result) => {
    console.log(result)
}).catch((e) => {
    console.error(error)
})