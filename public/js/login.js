document.getElementById("loginForm").addEventListener("submit",
    function(e){
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        fetch("/login", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({email, password})
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                window.location.href = "home.html";
            }else{
                document.getElementById("mensaje").textContent =
                "credenciales incorrectas";
            }
        })
    }
)