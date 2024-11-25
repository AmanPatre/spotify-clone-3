console.log("Lets write java Script /....");
//Variables
let songs;
let currentSong = new Audio();
//seconds changer function
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = []; //local variable(songs)
  for (let index = 0; index < as.length; index++) {
    const element = as[index];

    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}
const playMusic = (track) => {
  // let audio= new Audio("/songs/"+track)
  currentSong.src = "/songs/" + track;
  currentSong.play();
  play.src = "pause.svg";
  document.querySelector(".songInfo").innerHTML = track.replaceAll("%20", " ");
  document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
};
async function main() {
  // Get the list of all songs
  songs = await getSongs(); //Global  variable(songs)

  // all the song in the playlist
  let songUL = document
    .querySelector(".songsLists")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    // Convert the song to a string, then apply replace
    let songString = String(song);
    songUL.innerHTML =
      songUL.innerHTML +
      `<li><img src="music.svg" alt="">
                  <div class="info">
                         <div>${songString.replaceAll("%20", " ")}</div>
                        <div>${"Aman"}</div>
                    </div>
                    <div class="playNow">
                        
                        <img src="play.svg" alt="">
                    </div></li>`;
  }
  //Attach an event listener to each song
  Array.from(
    document.querySelector(".songsLists").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", () => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML);
    });
  });
  //Attach an event listener to play,next, previous
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "pause.svg";
    } else {
      currentSong.pause();
      play.src = "play.svg";
    }
  });
  //listen for time update function
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  //Add an event listener to seek bar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";

    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  //Adding an event listener to hamburger

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0%";
  });
  //Adding event listener for close button
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-150%";
  });

  //adding an event listener to previous

  previous.addEventListener("click", () => {
    console.log("Previous Clicked ");
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  //adding an event listener to Next
  next.addEventListener("click", () => {
    console.log("Next  Clicked ");
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  //Adding an event to volume button
  document
    .querySelector(".volume")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      console.log(e, e.target, e.target.value);
      currentSong.volume = parseInt(e.target.value) / 100;
    });
}
main();
