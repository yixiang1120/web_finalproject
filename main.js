const balance = document.getElementById("balance");
const moneyPlus = document.getElementById("money-plus");
const moneyMinus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const notification = document.getElementById("notification");
const date = document.getElementById("date");
const locationSelect = document.getElementById('location-select');
const currentUser = localStorage.getItem("currentUser");
const navLinks = document.querySelector(".nav-links");
const logoutButton = document.getElementById("logout");
const loginButton = document.getElementById("login");
const coinValue = document.getElementById("coin");

let coin = 0;
let ctx;
let email = "";
let transactions = [];
let groupedIncomeData = [];
let groupedExpenseData = [];

logoutButton.addEventListener("click", function() {
  // 清除使用者資訊
  localStorage.removeItem("currentUser");
  email = "";
  console.log("清除使用者資訊");
  console.log(localStorage.getItem("currentUser"));
  init();
  window.location.href = "login.html";
});

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
    //window.location.href = "login.html";
  }
  $.ajax({
    url: `https://yixiangjsonserver.azurewebsites.net/accounts`,
    type: "GET",
    success: function (response) {
      const account = response.find((item) => item.email === email);
      if (account) {

        transactions = account.transactions || [];
        coin = account.coin || 0; // 取得 AJAX 回傳的 coin 值
        const userNameElement = document.getElementById("user-name");
        if (userNameElement) {
          userNameElement.textContent = account.name; // 假設使用者名稱存儲在 account.name 中
        }
        init();
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

// AJAX 請求更新交易資料
function updateTransactions() {
  //const email = "a.cojftyh26@gmail.com";
  const updatedAccount = {
    email: email,
    transactions: transactions,
    coin: coin 
  };
  console.log(JSON.stringify({ updatedAccount }));

  $.ajax({
    url: `https://yixiangjsonserver.azurewebsites.net/accounts/${email}/transactions`,
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

// AJAX 請求刪除交易資料
function deleteTransactions(id) {
  $.ajax({
    url: `https://yixiangjsonserver.azurewebsites.net/accounts/${email}/transactions/${id}`,
    type: "DELETE",
    success: function (response) {
      console.log(response);
    },
    error: function (xhr, status, error) {
      alert("發生錯誤: " + xhr.status);
    }
  });
}

function groupDataByDate(data) {
  const groupedData = [];
  data.forEach(item => {
    const existingItem = groupedData.find(i => i.date === item.date);
    if (existingItem) {
      existingItem.amount += Math.abs(item.amount); // 將負數轉換為正數
    } else {
      groupedData.push({ date: item.date, amount: Math.abs(item.amount) }); // 將負數轉換為正數
    }
  });
  return groupedData;
}

function drawLineChart(incomeData, expenseData) {
  
  console.log(incomeData);

  $("canvas#myChart").remove();
  $("div.chart").append('<canvas id="myChart" width="450" height="300"></canvas>');
  console.log($("canvas#myChart"))
  var ctx = document.getElementById("myChart").getContext("2d");
  const combinedData = [];
  const expenseMap = new Map(expenseData.map(x => [x.date, x.amount]));
  const incomeMap = new Map(incomeData.map(x => [x.date, x.amount]));

  expenseData.forEach(({ date }) => {
    combinedData.push({
      date,
      expense: expenseMap.get(date),
      income: incomeMap.get(date),
    });
  });

  incomeData.forEach(({ date }) => {
    if (!combinedData.some(data => data.date === date)) {
      combinedData.push({
        date,
        expense: expenseMap.get(date),
        income: incomeMap.get(date),
      });
    }
  });
  const sortedData = combinedData.sort((a, b) => new Date(a.date) - new Date(b.date));

  myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: sortedData.map(({ date }) => date.slice(5, 10)),
      datasets: [
        {
        label: '收入',
        data: sortedData.map(({ expense }) => expense || 0),
        type: 'line',

         // Line
        lineTension: 0,
        backgroundColor: '#63c78c',
        borderColor: '#63c78c',
        borderWidth: 2,
        // Point
        pointRadius: 5,
        pointHoverRadius: 7,
      },
      {
        label: '支出',
        data: sortedData.map(({ income }) => income || 0),
        type: 'line',
         // Line
        lineTension: 0,
        backgroundColor: '#f87e70',
        borderColor: '#f87e70',
        borderWidth: 2,
        // Point
        pointRadius: 5,
        pointHoverRadius: 7,
      }
    ]
    },
    options: {
      title:{
        display: true,                 // 顯示標題
        text: 'Traffic Volume',   
        position: 'bottom',            // 在圖表下方顯示
        fontSize: 24,                  // 字體相關的參數           
        fontStyle: 'normal',
        fontFamily: 'Century Gothic'
      },
      legend:{
        display: true,
        position: 'top',
      },
      responsive: false,    
      plugins: {
        filler: {
          propagate: false,
        },
        title: {
          display: true,
        }
      },
      interaction: {
        intersect: false,
      }
  
    }
  }); 
}


function showNotification() {
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 2000);
}

function generateID() {
  const existingIds = transactions.map((transaction) => transaction.id);
  const maxId = Math.max(...existingIds);
  const newId = maxId !== -Infinity ? maxId + 1 : 1;
  return newId;
}

let map;
let placesService;
let marker;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 8,
    center: {lat: 24.970959212686388, lng: 121.26344220000001}
  });
  marker = new google.maps.Marker({
    position: {lat: 24.970959212686388, lng: 121.26344220000001},
    map: map,
  });

  // 初始化 PlacesService
  placesService = new google.maps.places.PlacesService(map);

  // 將 placesService 傳遞給 performNearbySearch 函式
  document.getElementById('find-location').addEventListener('click', function() {
    getCurrentLocation();
  });

}

function getCurrentLocation() {
  if (!navigator.geolocation){
    alert("您的瀏覽器不支援 Geolocation");
    return;
  }

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const location = new google.maps.LatLng(latitude, longitude);
    map.setCenter(location);
    map.setZoom(20);
    marker.setPosition(location);
    performNearbySearch(location);
  }

  function error() {
    alert("無法獲取您的位置");
  }

  navigator.geolocation.getCurrentPosition(success, error);
}

function performNearbySearch(location) {
  const request = {
    location: location,
    radius: 600,
    type: "restaurant"
  };

  placesService.nearbySearch(request, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      displayLocationOptions(results);
    }
  });
}

function displayLocationOptions(locations) {
  locationSelect.innerHTML = '';

  locations.forEach(function(location, index) {
    const option = document.createElement('option');
    option.value = location.place_id;
    option.text = location.name;
    locationSelect.appendChild(option);
  });
}

function addTransaction(e) {
  e.preventDefault();
  console.log(locationSelect.index);
  if (text.value.trim() === "" || amount.value.trim() === "" || date.value.trim() === "" ||  locationSelect.value.trim() === "請選擇地點") {
    console.log(text.value.trim());
    console.log(amount.value.trim());
    console.log(date.value.trim());
    console.log(locationSelect.value.trim());
    showNotification();
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value,
      date: date.value,
      location: locationSelect.options[locationSelect.selectedIndex].text,
    };

    coin += 10;
    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateTransactions(); 
    updateCoin();
    text.value = "";
    amount.value = "";
    date.value = ""; 
    locationSelect.value = "";
    
    // 檢查是否需要顯示彈出視窗
    const currentDate = new Date().toLocaleDateString();
    const hasEntriesToday = transactions.some(transaction => {
      const formattedDate = new Date(transaction.date).toLocaleDateString(); // 格式為 "yyyy/mm/dd"
      return formattedDate === currentDate;
    });
    if (hasEntriesToday) {
      console.log("success");
      showModal();
    }

  }
}

function showModal() {
  const modalOverlay = document.querySelector(".modal-overlay");
  const closeButton = document.getElementById("close-button");

  modalOverlay.style.display = "flex";
  closeButton.addEventListener("click", hideModal);  
}


function hideModal() {
  const modalOverlay = document.querySelector(".modal-overlay");
  modalOverlay.style.display = "none";
}

function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");
  item.classList.add(sign === "+" ? "plus" : "minus");
  item.innerHTML = `
    ${transaction.text} 
    <span>${sign}${Math.abs(transaction.amount)}</span>
    <span class="date">${transaction.date}</span>
    <span class="location">${transaction.location}</span>
    <button class="delete-btn" onclick="removeTransaction(${
      transaction.id
    })"><i class="fa fa-times"></i></button>
  `;
  list.appendChild(item);
}

function updateValues() {
  const sortedTransactions = transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
  const amounts = sortedTransactions.map((transaction) => transaction.amount);
  const total = amounts
    .reduce((accumulator, value) => (accumulator += value), 0)
    .toFixed(2);
  const income = amounts
    .filter((value) => value > 0)
    .reduce((accumulator, value) => (accumulator += value), 0)
    .toFixed(2);
  const expense = (
    amounts
      .filter((value) => value < 0)
      .reduce((accumulator, value) => (accumulator += value), 0) * -1
  ).toFixed(2);
  balance.innerText = `$${total}`;
  moneyPlus.innerText = `$${income}`;
  moneyMinus.innerText = `$${expense}`;
  coinValue.innerText = `${coin}`;
  groupedIncomeData = groupDataByDate(sortedTransactions.filter(transaction => transaction.amount > 0));
  groupedExpenseData = groupDataByDate(sortedTransactions.filter(transaction => transaction.amount < 0));
  drawLineChart(groupedIncomeData, groupedExpenseData);
}


function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  //const email = "a.cojftyh26@gmail.com"; // 獲取使用者輸入的信箱值
  console.log(id);
  deleteTransactions(id);
  init();
}

// Init
function init() {
  list.innerHTML = "";
  updateValues();
  transactions.forEach(addTransactionDOM);
  performNearbySearch(map.getCenter());
}

form.addEventListener("submit", addTransaction);
getTransactions();

