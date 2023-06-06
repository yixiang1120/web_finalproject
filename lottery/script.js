const logoutButton = document.getElementById("logout");
const loginButton = document.getElementById("login");
const coinValue = document.getElementById("coin");

let email = "";
let coin = 0;
let transactions = [];
var timeoutID ;
var runID;
var num ;
var prizes = [
  {id: 1, image: "images/nb992.png", name: "New Balance 992"},
  {id: 2, image: "images/coin.png", text: "Ｘ50", name: "Coin 50枚", dollar: 50},
  {id: 3, image: "images/s5.png", name: "Nike Dunk"},
  {id: 4, image: "images/s2.png", name: "Air Jordan 1 Low OG SP"},
  {id: 5, image: "images/coin.png", text: "Ｘ100", name: "Coin 100枚", dollar: 100},
  {id: 6, image: "images/coin.png", text: "Ｘ100", name: "Coin 100枚", dollar: 100},
  {id: 7, image: "images/coin.png", text: "Ｘ100", name: "Coin 100枚", dollar: 100},
  {id: 8, image: "images/coin.png", text: "Ｘ100", name: "Coin 100枚", dollar: 100},
  {id: 9, image: "images/coin.png", text: "Ｘ100", name: "Coin 100枚", dollar: 100},
  {id: 10, image: "images/coin.png", text: "Ｘ500", name: "Coin 500枚", dollar: 500},
  {id: 11, image: "images/s6.png", name: "New Balance"},
  {id: 12, image: "images/s1.png", name: "Adidas"},
  {id: 13, image: "images/s4.png", name: "Nike"},
  {id: 14, image: "images/s7.png", name: "Asics"},
  {id: 15, image: "images/s3.png", name: "New Balance"},
  {id: 16, image: "images/coin.png", text: "Ｘ200", name: "Coin X 200枚", dollar: 200},
  {id: 17, image: "images/coin.png", text: "Ｘ200", name: "Coin X 200枚", dollar: 200}
];

logoutButton.addEventListener("click", function() {
  // 清除使用者資訊
  localStorage.removeItem("currentUser");
  email = "";
  console.log("清除使用者資訊");
  console.log(localStorage.getItem("currentUser"));
  init();
  window.location.href = "login.html";
});

$(function() {
    getTransactions();
    coin += 1000;
    $("#btnstart").click(function(){
      if (coin < 100) {
        alert("你的coin不足，無法抽獎啦QQ！");
        return;  // 如果coin數量少於100，則返回並不執行抽獎
      }
      coin -= 100;
      coinValue.innerText = `${coin}`;
      init();  
    })
    $('#exampleModal').on('hidden.bs.', function (event) {
      $(".box").removeClass("active");
    })
    prizes = shuffle(prizes);
    //console.log(prizes);
    // 更新網頁上的獎品順序和內容
    for (var i = 0; i < prizes.length; i++) {
      var prize = prizes[i];
      var div = $("#item" + (i + 1));
      div.html(`<img src="${prize.image}" />${prize.text || ''}`);
    }
});

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function init(){   
  num = 1; //要從哪裡開始跑

  runID = Math.floor(Math.random()*20)+1;   //設一個1~20 隨機數字 是要停止的數字
  console.log(runID);
  $(".box").removeClass("active"); //先清空大家的亮色
  $('.modal-body').html(""); //先清空視窗modal內容
  
  timeoutID = setInterval(run, 100);  //每幾秒跑一次run function
  
  $("#btnstart").attr('disabled', true); //在按了"點我抽獎" 按鈕要禁用，以免重複run function
}



function run(){

  var ID = num % prizes.length + 1;
  console.log("餘數"+ ID);
  $('#item'+ID).addClass("active");
  $('.box').not('#item'+ID).removeClass("active");
  if(num == runID){
    clearInterval(timeoutID); // 如果
  
    var prize = prizes[ID-1];  // get the prize based on the current ID
    var content;
    console.log(prize);
    console.log(prize.image);
    console.log(prize.id);
    if(prize.image) {  // if the prize has an image
      content = 
      `<div class="sneaker"><div class="circle"></div><img src="${prize.image}" /></div><div class="info"><h1 class="title">${prize.name}</h1><h3>恭喜獲得 ${prize.name || ''}！</h3><div class="stars"><span class="star">&#9733;</span><span class="star">&#9733;</span><span class="star">&#9733;</span><span class="star">&#9733;</span><span class="star">&#9733;</span></div><div class="collect"><button id="collect">收藏</button></div>`;
    } else {
      content=`<div><img class="w-100" src="https://www.moedict.tw/%E6%87%B2%E7%BD%B0.png">罰你要按讚姐姐文章一次</div>`;
    }
    if(prize.id == 5 || prize.id == 6 || prize.id == 7 || prize.id == 8 || prize.id == 9 || prize.id == 17 || prize.id == 16 || prize.id == 2 || prize.id == 10){
      coin += prize.dollar;
      coinValue.innerText = `${coin}`;
    }
    else{//記錄球鞋資料
      var currentUser = localStorage.getItem("currentUser");
      var user = JSON.parse(currentUser);
      const updatedAccount = {
        email: email,
        shoes: prize.id,
      };
      if (currentUser) {
        console.log("有儲存的使用者資訊");
        console.log(user);
        if (email) {
          console.log("有儲存的使用者email");
          console.log(email);
          $.ajax({
            type: "PATCH",
            contentType: "application/json",
            url: `https://yixiangjsonserver.azurewebsites.net/accounts/${email}/shoes`,
            data: JSON.stringify({ updatedAccount }),
            success: function (response) {
              console.log(response);
            },
            error: function (response) {
              console.log(response);
            }
          });
        }
      }
    }
    updateCoin()
    $('.modal-body').html(content);//寫入視窗內容
    $('#exampleModal').modal('show');//視窗出現 bootstrap4原本方法
    collectButton = document.getElementById("collect");
    collectButton.addEventListener("click", function(){
      alert("收藏成功");
      $('#exampleModal').modal('hide');//視窗消失 bootstrap4原本方法
      
    })

    $("#btnstart").attr('disabled', false);//剛剛"點我抽獎" 按鈕要禁用，要恢復可以按
  
  } else {
    num ++ ;
  }
}



// AJAX 請求獲取交易資料
function getTransactions() {
  const currentUser = localStorage.getItem("currentUser");
  const user = JSON.parse(currentUser);

  if (currentUser) {
    console.log("有儲存的使用者資訊");
    console.log(user);
    email = user.email;
    logoutButton.style.display = "inline-block";
    loginButton.style.display = "none";

  } else {
    console.log("沒有儲存的使用者資訊");
    loginButton.style.display = "inline-block";
    logoutButton.style.display = "none";
  }
  $.ajax({
    url: `https://yixiangjsonserver.azurewebsites.net/accounts`,
    type: "GET",
    success: function (response) {
      const account = response.find((item) => item.email === email);
      if (account) {

        transactions = account.transactions || [];
        coin = account.coin || 0; // 取得 AJAX 回傳的 coin 值
        coinValue.innerText = `${coin}`;

        const userNameElement = document.getElementById("user-name");
        if (userNameElement) {
          userNameElement.textContent = account.name; // 假設使用者名稱存儲在 account.name 中
        }
      }
    },
    error: function (xhr, status, error) {
      alert("發生錯誤: " + xhr.status);
    }
  });
}

// AJAX 請求更新金錢資料
function updateCoin() {
  const updatedAccount = {
    email: email,
    coin: coin
  };
  console.log(JSON.stringify({ updatedAccount }));

  $.ajax({
    url: `https://yixiangjsonserver.azurewebsites.net/accounts/${email}/coin`,
    type: "PATCH",
    contentType: "application/json",
    data: JSON.stringify({ updatedAccount }),
    success: function (response) {
    console.log(response);
    },
    error: function (xhr, status, error) {
      alert("發生錯誤: " + xhr.status);
    }
  });
}
