document.addEventListener("DOMContentLoaded", () => { //we wait the page to finish loading
    
    document.addEventListener("submit", event => {
        event.preventDefault(); // lets do some validations first

        event.target.submit(); // after validation
    });

    const signUpButton = document.querySelector(".signin__signup");
    signUpButton.addEventListener("click", ()=> {
        location.replace("http://localhost:3000/signup")
    })
})