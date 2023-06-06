const signUpBtn = document.getElementById("signUp");
const signUp = document.getElementById("sign_up");

const signInBtn = document.getElementById("signIn");
const signIn = document.getElementById("sign_in");
const container = document.getElementById("container");

//註冊的滑動的效果
signUpBtn.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

//登入的滑動的效果
signInBtn.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

//檢查信箱格式
function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

function signIncheck() {
  const emailStr = $(".sign-in-container input[type='email']").val();
  const passwordStr = $(".sign-in-container input[type='password']").val();
  if (!isValidEmail(emailStr)) {
    alert("請輸入有效的信箱格式");
    return;
  }
  const account = {
    email: emailStr,
    password: passwordStr
  };
  console.log(account);

  $.ajax({
    url: "https://yixiangjsonserver.azurewebsites.net/accounts",
    type: "GET",
    success: function (response) {
      const accounts = response;
      const foundAccount = accounts.find(account => account.email === emailStr && account.password === passwordStr);
      
      if (foundAccount) {
        localStorage.setItem("currentUser", JSON.stringify(foundAccount));
        console.log("local:" + localStorage.getItem("currentUser"));
        alert("登錄成功");
        window.location.href = "index.html";
        
      } else {
        alert("帳號或密碼不正確");
      }
    },

    error: function (xhr, status, error) {
      alert("Error: " + xhr.status);
    }
  });
}
//註冊
function signUpcheck() {
  const nameStr = $(".sign-up-container input[type='text']").val();
  const emailStr = $(".sign-up-container input[type='email']").val();
  const passwordStr = $(".sign-up-container input[type='password']").val();
  if (!isValidEmail(emailStr)) {
    alert("請輸入有效的信箱格式");
    return;
  }
  const account = {
    id: 0,
    name: nameStr,
    email: emailStr,
    password: passwordStr,
    transactions: [],
    shoes:[]
  };
  console.log(account);

  $.ajax({
    url: "https://yixiangjsonserver.azurewebsites.net/accounts",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(account),
    success: function (response) {
      console.log(response);
      const str = response.message;
      if (str === "帳號註冊成功") {
        alert("帳號註冊成功");
      } 
      if (str === "此信箱已註冊過，請重新再試") {
        alert("此信箱已註冊過，請重新再試");
      }
    },

    error: function (xhr, status, error) {
      alert("Error: " + xhr.status);
    }
  });
}

signUp.addEventListener("click", signUpcheck);
signIn.addEventListener("click", signIncheck);