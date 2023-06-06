let id;
let email;
var prizes = [
  {id: 1, image: "images/nb992.png", name: "New Balance 992", stars: 5},
  {id: 3, image: "images/s5.png", name: "Nike Dunk", stars: 4},
  {id: 4, image: "images/s2.png", name: "Air Jordan 1 Low OG SP", stars: 3},
  {id: 11, image: "images/s6.png", name: "New Balance", stars: 2},
  {id: 12, image: "images/s1.png", name: "Adidas", stars: 5},
  {id: 13, image: "images/s4.png", name: "Nike", stars: 3},
  {id: 14, image: "images/s7.png", name: "Asics", stars: 4},
  {id: 15, image: "images/s3.png", name: "New Balance", stars: 3},
];

const logoutButton = document.getElementById("logout");
const loginButton = document.getElementById("login");

function getTransactions() {
  const currentUser = localStorage.getItem("currentUser");
  const user = JSON.parse(currentUser);

  if (currentUser) {
    console.log("有儲存的使用者資訊");
    console.log(user);
    email = user.email;
    const userNameElement = document.getElementById("user-name");
        if (userNameElement) {
          userNameElement.textContent = user.name; // 假設使用者名稱存儲在 account.name 中
        }
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

        id = account.shoes;
        console.log(id);
        const userNameElement = document.getElementById("user-name");
        if (userNameElement) {
          userNameElement.textContent = account.name; // 假設使用者名稱存儲在 account.name 中
        }
        createCards(id); // 根據ID創建卡片

      }
    },
    error: function (xhr, status, error) {
      alert("發生錯誤: " + xhr.status);
    }
  });


}

getTransactions();
// Movement Animation to happen
const card = document.querySelector(".card");
const container = document.querySelector(".container");

// Items
const title = document.querySelector(".title");
const sneaker = document.querySelector(".sneaker img");
const collect = document.querySelector(".collect");
const description = document.querySelector(".info h3");

// Moving animation event
container.addEventListener("mousemove", (e) => {
  let xAxis = (window.innerWidth / 2 - e.pageX) / 25;
  let yAxis = (window.innerHeight / 2 - e.pageY) / 25;
  card.style.transform = `rotateX(${yAxis}deg) rotateY(${xAxis}deg)`;
  title.style.textShadow = `${xAxis}px ${yAxis}px 10px rgba(0, 0, 0, 0.1)`;
});

// Animate In
container.addEventListener("mouseenter", (e) => {
  card.style.transition = "none";
  title.style.transform = "translateZ(150px)";
  sneaker.style.transform = "translateZ(200px) rotateZ(-45deg)";
  description.style.transform = "translateZ(125px)";
  collect.style.transform = "translateZ(75px)";
});

// Animate Out
container.addEventListener("mouseleave", (e) => {
  card.style.transition = "all 0.5s ease";
  card.style.transform = `rotateX(0deg) rotateY(0deg)`;
  title.style.transform = "translateZ(0px)";
  sneaker.style.transform = "translateZ(0) rotateZ(0deg)";
  description.style.transform = "translateZ(0px)";
  collect.style.transform = "translateZ(0px)";
  title.style.textShadow = "0px 0px 0px rgba(0, 0, 0, 0)";
});



function createCards(idArray) {
  const container = document.querySelector(".container");
  const uniqueIds = [...new Set(idArray)];

  // 根據ID尋找對應的商品
  const prizesToDisplay = prizes.filter(prize => uniqueIds.includes(prize.id));

  // 對於每一個商品，創建一個卡片並添加到容器中
  for (let prize of prizesToDisplay) {
    const card = document.createElement("div");
    card.className = "card";
    
    const sneaker = document.createElement("div");
    sneaker.className = "sneaker";

    const circle = document.createElement("div");
    circle.className = "circle";
    sneaker.appendChild(circle);

    const img = document.createElement("img");
    img.src = prize.image;
    img.alt = prize.name;
    sneaker.appendChild(img);

    const info = document.createElement("div");
    info.className = "info";

    const title = document.createElement("h1");
    title.className = "title";
    title.textContent = prize.name;
    info.appendChild(title);

    card.appendChild(sneaker);
    card.appendChild(info);
    container.appendChild(card);

    // Moving animation event
    card.addEventListener("mousemove", (e) => {
      let xAxis = (window.innerWidth / 2 - e.pageX) / 25;
      let yAxis = (window.innerHeight / 2 - e.pageY) / 25;
      card.style.transform = `rotateX(${yAxis}deg) rotateY(${xAxis}deg)`;
      title.style.textShadow = `${xAxis}px ${yAxis}px 10px rgba(0, 0, 0, 0.1)`;
    });

    // Animate In
    card.addEventListener("mouseenter", (e) => {
      card.style.transition = "none";
      title.style.transform = "translateZ(150px)";
      sneaker.style.transform = "translateZ(200px) rotateZ(-45deg)";
    });

    // Animate Out
    card.addEventListener("mouseleave", (e) => {
      card.style.transition = "all 0.5s ease";
      card.style.transform = `rotateX(0deg) rotateY(0deg)`;
      title.style.transform = "translateZ(0px)";
      sneaker.style.transform = "translateZ(0) rotateZ(0deg)";
      title.style.textShadow = "0px 0px 0px rgba(0, 0, 0, 0)";
    });

    const stars = document.createElement("div");
    stars.className = "stars";

    // 根據星星數量繪製星星
    for (let i = 0; i < prize.stars; i++) {
      const star = document.createElement("span");
      star.className = "star";
      star.innerHTML = "&#9733;";
      stars.appendChild(star);
    }

    info.appendChild(stars);
  }
}