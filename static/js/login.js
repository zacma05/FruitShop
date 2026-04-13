$("#loginForm").on("submit", function (e) {
    e.preventDefault();

    const username = $("#username").val();
    const password = $("#password").val();

    $.ajax({
        url: "http://127.0.0.1:5000/login",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            username: username,
            password: password
        }),
        success: function (res) {
            if (res.token) {
                localStorage.setItem("token", res.token);
                localStorage.setItem("accountID", res.accountID);
                localStorage.setItem("userName", res.user);

                alert("Chào mừng " + res.user + " đã quay trở lại!");
                // Chuyển hướng về trang chủ ở cổng 5500
                window.location.href = "http://127.0.0.1:5500/templates/index.html";
            }
        },
        error: function (xhr) {
            const errorMsg = xhr.responseJSON ? xhr.responseJSON.error : "Sai tài khoản hoặc mật khẩu!";
            alert(errorMsg);
        }
    });
});