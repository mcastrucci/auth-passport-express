document.addEventListener("DOMContentLoaded", ()=> { //as always, just after page charge
    const logoutButton = document.querySelector(".index__header__logout"); //lets add an API call with this

    window.history.pushState("", "", '/');
    logoutButton.addEventListener("click", async event => {
        console.log("executing logout");
        const response = await fetch('/logout', {
            method: 'GET'
        });
    
        location.replace("http://localhost:3000/login")//when we have response we reload
    })
}) 