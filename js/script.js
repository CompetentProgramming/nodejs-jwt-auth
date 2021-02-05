const signUp = document.getElementById('sign-up-form');
const signIn = document.getElementById('sign-in-form');
const logged = document.querySelector('.logged');

axios
    .get('http://localhost:3000/auth/me', {headers: {'access-token': getUserToken()}})
    .then(res => {
        loginSuccessful();
    })
    .catch(err => {
        console.log(err);
    });


function signUpSubmit(ev) {
    ev.preventDefault();
    const myForm = signUp.elements;
    const userData = {
        firstName: myForm.firstName.value,
        lastName: myForm.lastName.value,
        email: myForm.email.value,
        password: myForm.password.value,
    };

    axios
        .post('http://localhost:3000/auth/register', userData)
        .then(res => {
            signUp.classList.add('d-none');
            signIn.classList.remove('d-none');
        })
        .catch(err => {
            console.log(err);
        });

}

function signInSubmit(ev) {
    ev.preventDefault();
    const myForm = signIn.elements;
    const userLoginData = {
        email: myForm.email.value,
        password: myForm.password.value,
    };

    axios
        .post('http://localhost:3000/auth/login', userLoginData)
        .then(res => {
            loginSuccessful();
            localStorage.setItem('userInfo', JSON.stringify(res.data));
        })
        .catch(err => {
            console.log(err);
        });

}

function getUserToken() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return userInfo && userInfo.token || null;
}

function loginSuccessful() {
    signUp.classList.add('d-none');
    signIn.classList.add('d-none');
    logged.classList.remove('d-none');
}

document.querySelector('.logout').addEventListener('click', (ev) => {
    ev.preventDefault();
    localStorage.removeItem('userInfo');
    signUp.classList.add('d-none');
    signIn.classList.remove('d-none');
    logged.classList.add('d-none');
});