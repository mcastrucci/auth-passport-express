document.addEventListener("DOMContentLoaded", () => { //we wait the page to finish loading
    console.log("charged");
    document.addEventListener("submit", event => {
        event.preventDefault(); // lets do some validations first

        event.target.submit(); // after validation
    });

    const signinButton = document.querySelector(".signup__login"); //login button

    signinButton.addEventListener("click", ()=> { //lets just change the page to the login page server will handle the redirect
        location.replace("http://localhost:3000/login")
    })
})