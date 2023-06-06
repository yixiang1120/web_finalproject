const logoutButton = document.getElementById("logout");
const loginButton = document.getElementById("login");
let player;
let currentPlay = 0;


logoutButton.addEventListener("click", function() {
    // 清除使用者資訊
    localStorage.removeItem("currentUser");
    email = "";
    console.log("清除使用者資訊");
    console.log(localStorage.getItem("currentUser"));
    window.location.href = "login.html";
  });

//YouTube API Ready
function getTransactions() {
    const currentUser = localStorage.getItem("currentUser");
    const user = JSON.parse(currentUser);
  
    if (currentUser) {
      console.log("有儲存的使用者資訊");
      console.log(user);
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
  }

getTransactions();
function onYouTubeIframeAPIReady(){
    
    player = new YT.Player("player",{
        height:"390",
        width:"640",
        videoId:playList[currentPlay],
        playerVars:{
            autoplay:0,
            controls:0,
            start:playTime[currentPlay][0],
            end:playTime[currentPlay][1],
            iv_load_policy:3
        },
        events:{
            onReady:onPlayerReady,
            onStateChange:onPlayerStateChange
        }
    });
}

//YouTube Player Ready
function onPlayerReady(event){
    $(".videoButton").on("click", function() {
        const videoId = $(this).data("video-id");
        console.log(videoId);
        currentPlay = playList.indexOf(videoId);
        player.loadVideoById({
            videoId: videoId,
            startSeconds: playTime[currentPlay][0],
            endSeconds: playTime[currentPlay][1],
            suggestedQuality: "large"
        });
        $("h2").text(player.getVideoData().title);
    });

    $("#playButton").on("click", function() {
        $("h2").text(player.getVideoData().title);
        player.playVideo();
    });
}

//YouTube Stage Change
function onPlayerStateChange(event){
    if(Math.floor(player.getCurrentTime())==playTime[currentPlay][1]){
        if(currentPlay<playList.length-1){
            currentPlay++;
            player.loadVideoById({
                videoId:playList[currentPlay],
                startSeconds:playTime[currentPlay][0],
                endSeconds:playTime[currentPlay][1],
                suggestedQuality:"large"
            });
        }
        else{
            currentPlay=0;
            player.cueVideoById({
                videoId:playList[currentPlay],
                startSeconds:playTime[currentPlay][0],
                endSeconds:playTime[currentPlay][1],
                suggestedQuality:"large"
            });
        }
    }
    if(event.data == 1){
        $("h2").text(player.getVideoData().title);
    }
}



