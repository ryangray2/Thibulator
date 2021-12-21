console.log(teams[0].city);


fetch("https://free-nba.p.rapidapi.com/stats?page=0&per_page=25", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "free-nba.p.rapidapi.com",
		"x-rapidapi-key": "b32bb7f601mshfc896096c621b0ep14dde8jsn2098dd9c5936"
	}
})
.then(response => {
	console.log(response.json());
})
.catch(err => {
	console.error(err);
});

var currOpponent;
var currOffFocus = 0;
var currDefFocus = 0;

var navPage = document.getElementById("navPage");
var scheduleCont = document.getElementById("scheduleCont");
var statsCont = document.getElementById("statsCont");
var rotationCont = document.getElementById("rotationCont");
var pregamePage = document.getElementById("pregamePage");

function startPressed() {
  document.getElementById("startPage").style.display = "none";
  document.getElementById("navPage").style.display = "block";
  scheduleCont.style.display = "block";
  generateSchedule();
}

function scheduleNav() {
  if (getCurrMinutes() !== 240) {

  } else {
    scheduleCont.style.display = "block";
    statsCont.style.display = "none";
    rotationCont.style.display = "none";
    generateSchedule();
  }
}

function statsNav() {
  if (getCurrMinutes() !== 240) {

  } else {
    scheduleCont.style.display = "none";
    statsCont.style.display = "block";
    rotationCont.style.display = "none";
  }
}

function rotationNav() {
  scheduleCont.style.display = "none";
  statsCont.style.display = "none";
  rotationCont.style.display = "block";
  generateMinutes();
}

function generateSchedule() {
  var root = document.getElementById("scheduleCont");
  while (root.firstChild) {
    root.removeChild(root.firstChild);
  }
  var play = false;
  for (let i = 0; i < scheduleArr.length; i++) {
    var row = document.createElement("div");
    row.classList.add("row");

    var dateCol = document.createElement("div");
    dateCol.classList.add("col-4");
    var dateP = document.createElement("p");
    dateP.innerHTML = scheduleArr[i].Date;
    dateCol.appendChild(dateP);

    row.appendChild(dateCol);

    var locCol = document.createElement("div");
    locCol.classList.add("col-2");
    var locP = document.createElement("p");
    locP.innerHTML = scheduleArr[i].Location;
    locCol.appendChild(locP);

    locCol.appendChild(locP);
    row.appendChild(locCol);

    var teamCol = document.createElement("div");
    teamCol.classList.add("col-6");
    var teamLogo = document.createElement("img");
    teamLogo.classList.add("scheduleLogo");
    teamLogo.setAttribute("src", scheduleArr[i].Opponent.logo);

    teamCol.appendChild(teamLogo);

    row.appendChild(teamCol);

    if (scheduleArr[i].Result === "" && !play) {
      currOpponent = scheduleArr[i];
      var button = document.createElement("button");
      button.addEventListener('click', function() {
        playPressed();
      });
      button.innerHTML = "PLAY";
      row.appendChild(button);
      play = true;
    }
    root.appendChild(row);
  }
}

function getCurrMinutes() {
  var total = 0;
  for (let j = 0; j < roster.length; j++) {
    total += parseInt(roster[j].CurrMinutes);
  }
  return total;
}

function displayIndivMin(num, amount) {
  var ele = document.getElementById(num + "mins");
  ele.innerHTML = amount;
}

function generateMinutes() {
  var root = document.getElementById("rotationCont");
  while (root.firstChild) {
    root.removeChild(root.firstChild);
  }
  var row = document.createElement("div");
  row.classList.add("row");
  var totalP = document.createElement("p");
  totalP.innerHTML = "Total Minutes: " + getCurrMinutes() + " /240";
  row.appendChild(totalP);
  root.appendChild(row);
  for (let i = 0; i < roster.length; i++) {
    var row = document.createElement("div");
    row.classList.add("row");

    var playerCol = document.createElement("div");
    playerCol.classList.add("col-4");
    var playerP = document.createElement("p");
    playerP.innerHTML = roster[i].Name;

    playerCol.appendChild(playerP);
    row.appendChild(playerCol);

    // <div class="slidecontainer">
    //   <input type="range" min="1" max="100" value="50" class="slider" id="myRange">
    // </div>

    var sliderCol = document.createElement("div");
    sliderCol.classList.add("col-7");
    var slideCont = document.createElement("div");
    slideCont.classList.add("slidecontainer");
    var input = document.createElement("input");
    input.setAttribute("type", "range");
    input.setAttribute("min", "0");
    input.setAttribute("max", "48");
    input.setAttribute("value", roster[i].CurrMinutes);

    input.classList.add("slider");
    input.setAttribute("id", "myRange");

    var minCol = document.createElement("div");
    minCol.classList.add("col-1");
    var minP = document.createElement("p");
    minP.setAttribute("id", String(i) + "mins");
    minCol.appendChild(minP);


    input.oninput = function() {
      roster[i].CurrMinutes = this.value;
      displayIndivMin(String(i), roster[i].CurrMinutes);
      minP.innerHTML = this.value;
      var total = 0;
      for (let j = 0; j < roster.length; j++) {
        total += parseInt(roster[j].CurrMinutes);
      }
      totalP.innerHTML = "Total Minutes: " + total + "/240";
    }
    slideCont.appendChild(input);
    sliderCol.appendChild(slideCont);
    console.log();

    row.appendChild(sliderCol);
    row.appendChild(minCol);
    root.appendChild(row);
  }
}

function normalizer(minutes, stat, player) {
  var avgMinutes = player.MP;
  var prevStat = stat;
  var newStat = (minutes * prevStat) / avgMinutes;
  return newStat;
}


function playOff(focusNum) {
  var threeFocus;
  var totalPoints = 0;
  console.log(focusNum);
  if (focusNum === "-3") {
    threeFocus = 1.5;
  } else if (focusNum === "-2") {
    threeFocus = 1.25;
  } else if (focusNum === "-1") {
    threeFocus = 1.1;
  } else if (focusNum === "0") {
    threeFocus = 1;
  } else if (focusNum === "1") {
    threeFocus = .9;
  } else if (focusNum === "2") {
    threeFocus = .75;
  } else if (focusNum === "3") {
    threeFocus = .5;
  }

  console.log(threeFocus);

  for (let i = 0; i < roster.length; i++) {
    if (roster[i].CurrMinutes > 0) {
      var init3PA = normalizer(roster[i].CurrMinutes, roster[i].ThreeA, roster[i]);

      var new3PA = Math.round(init3PA * threeFocus);
      console.log(new3PA);
      var newA = Math.round(normalizer(roster[i].CurrMinutes, roster[i].FGA, roster[i]));
      var new2PA = newA - new3PA;
      /// adjust percents
      var new2Pcent = (randn_bm() * 2) * roster[i].TwoCENT;
      var new3Pcent = (randn_bm() * 2) * roster[i].ThreeCENT;
      /// include defense
      if (currOpponent.Opponent.ThreeD === 1) {
        var adj3Pcent = ((randn_bm() * 50 + 50) / 100) * new3Pcent;
      } else if (currOpponent.Opponent.ThreeD === 2) {
        var adj3Pcent = ((randn_bm() * 50 + 75) / 100) * new3Pcent;
      } else if (currOpponent.Opponent.ThreeD === 3) {
        var adj3Pcent = ((randn_bm() * 50 + 100) / 100) * new3Pcent;
      }
      if (currOpponent.Opponent.TwoD === 1) {
        var adj2Pcent = ((randn_bm() * 50 + 50) / 100) * new2Pcent;
      } else if (currOpponent.Opponent.TwoD === 2) {
        var adj2Pcent = ((randn_bm() * 50 + 75) / 100) * new2Pcent;
      } else if (currOpponent.Opponent.TwoD === 3) {
        var adj2Pcent = ((randn_bm() * 50 + 100) / 100) * new2Pcent;
      }
      var newFTcent = (randn_bm() * 2) * roster[i].FTCent;
      var newFTA = Math.round((randn_bm() * 2) * normalizer(roster[i].CurrMinutes, roster[i].FTA, roster[i]));

      var FTMade = Math.round(newFTcent * newFTA);
      var twoMade = Math.round(adj2Pcent * new2PA);
      var threeMade = Math.round(adj3Pcent * new3PA);

      var playerPoints = FTMade + (twoMade * 2) + (threeMade * 3);
      totalPoints += playerPoints;

      console.log(roster[i].Name);
      console.log("PTS: " + playerPoints);
      console.log("FG: " + (twoMade + threeMade) + "/" + newA);
      console.log("3P: " + threeMade + "/" + new3PA);
      console.log("FT: " + FTMade + "/" + newFTA);
    }
  }
  console.log("Total Points: " + totalPoints);
}


function randn_bm() {
  let u = 0, v = 0;
  while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) return randn_bm() // resample between 0 and 1
  return num
}

// console.log((randn_bm() * 50 + 50) / 100);
// console.log((randn_bm() * 50 + 50) / 100);
// console.log((randn_bm() * 50 + 50) / 100);
// console.log((randn_bm() * 50 + 50) / 100);
// console.log((randn_bm() * 50 + 50) / 100);
// console.log((randn_bm() * 50 + 50) / 100);
// console.log((randn_bm() * 50 + 50) / 100);
// console.log((randn_bm() * 50 + 50) / 100);
// console.log((randn_bm() * 50 + 50) / 100);
// console.log((randn_bm() * 50 + 50) / 100);



function playPressed() {
  navPage.style.display = "none";
  pregamePage.style.display = "block";
  generatePregame();
}

function generatePregame() {
  var root = document.getElementById("pregamePage");
  while (root.firstChild) {
    root.removeChild(root.firstChild);
  }
  var matchupRow = document.createElement("div");
  matchupRow.classList.add("row", "text-center");

  var knicksCol = document.createElement("div");
  knicksCol.classList.add("col-5");
  var knicksLogo = document.createElement("img");
  knicksLogo.setAttribute("src", knicks.logo);
  knicksLogo.classList.add("scheduleLogo", "float-right");
  knicksCol.appendChild(knicksLogo);
  matchupRow.appendChild(knicksCol);

  var locCol = document.createElement("div");
  locCol.classList.add("col-2");
  locCol.style.margin = "auto";
  var locP = document.createElement("p");
  if (currOpponent.Location === "Home") {
    locP.innerHTML = "vs.";
  } else {
    locP.innerHTML = "@";
  }
  locCol.appendChild(locP);
  matchupRow.appendChild(locCol);

  var oppCol = document.createElement("div");
  oppCol.classList.add("col-5", "text-center");
  oppCol.style.margin = "auto";
  var oppLogo = document.createElement("img");
  oppLogo.setAttribute("src", currOpponent.Opponent.logo);
  oppLogo.classList.add("scheduleLogo", "float-right");
  oppCol.appendChild(oppLogo);
  matchupRow.appendChild(oppCol);
  root.appendChild(matchupRow);

  var dateRow = document.createElement("div");
  dateRow.classList.add("row", "text-center");
  var dateCol = document.createElement("div");
  dateCol.classList.add("col-12");
  var dateP = document.createElement("p");
  dateP.innerHTML = currOpponent.Date;

  dateCol.appendChild(dateP);
  dateRow.appendChild(dateCol);
  root.appendChild(dateRow);

  var offRow = document.createElement("div");
  offRow.classList.add("row", "text-center");
  var offCol = document.createElement("div");
  offCol.classList.add("col-12");
  var offP = document.createElement("p");
  offP.innerHTML = "Offense";

  offCol.appendChild(offP);
  offRow.appendChild(offCol);
  root.appendChild(offRow);

  var offSlideRow = document.createElement("div");
  offSlideRow.classList.add("row", "text-center");

  var oc1 = document.createElement("div");
  oc1.classList.add("col-2");
  var op1 = document.createElement("p");
  op1.innerHTML = "Outside Shooting";
  oc1.appendChild(op1);
  offSlideRow.appendChild(oc1);

  var offSlideCol = document.createElement("div");
  offSlideCol.classList.add("col-8");
  var offSlideCont = document.createElement("div");
  offSlideCont.classList.add("slidecontainer");
  var offInput = document.createElement("input");
  offInput.setAttribute("type", "range");
  offInput.setAttribute("min", "-3");
  offInput.setAttribute("max", "3");
  offInput.setAttribute("value", 0);

  offInput.classList.add("slider");
  offInput.setAttribute("id", "offRange");
  offInput.oninput = function() {
    currOffFocus = this.value;
  }
  offSlideCont.appendChild(offInput);
  offSlideCol.appendChild(offSlideCont);
  offSlideRow.appendChild(offSlideCol);

  var oc2 = document.createElement("div");
  oc2.classList.add("col-2");
  var op2 = document.createElement("p");
  op2.innerHTML = "Get Inside";
  oc2.appendChild(op2);
  offSlideRow.appendChild(oc2);

  root.appendChild(offSlideRow);
///////////////////////////////////
  var defRow = document.createElement("div");
  defRow.classList.add("row", "text-center");
  var defCol = document.createElement("div");
  defCol.classList.add("col-12");
  var defP = document.createElement("p");
  defP.innerHTML = "Defense";

  defCol.appendChild(defP);
  defRow.appendChild(defCol);
  root.appendChild(defRow);

  var defSlideRow = document.createElement("div");
  defSlideRow.classList.add("row", "text-center");

  var dc1 = document.createElement("div");
  dc1.classList.add("col-2");
  var dp1 = document.createElement("p");
  dp1.innerHTML = "Defend Perimeter";
  dc1.appendChild(dp1);
  defSlideRow.appendChild(dc1);

  var defSlideCol = document.createElement("div");
  defSlideCol.classList.add("col-8");
  var defSlideCont = document.createElement("div");
  defSlideCont.classList.add("slidecontainer");
  var defInput = document.createElement("input");
  defInput.setAttribute("type", "range");
  defInput.setAttribute("min", "-3");
  defInput.setAttribute("max", "3");
  defInput.setAttribute("value", 0);

  defInput.classList.add("slider");
  defInput.setAttribute("id", "defRange");
  defInput.oninput = function() {
    currDefFocus = this.value;
  }
  defSlideCont.appendChild(defInput);
  defSlideCol.appendChild(defSlideCont);
  defSlideRow.appendChild(defSlideCol);

  var dc2 = document.createElement("div");
  dc2.classList.add("col-2");
  var dp2 = document.createElement("p");
  dp2.innerHTML = "Pack Paint";
  dc2.appendChild(dp2);
  defSlideRow.appendChild(dc2);

  root.appendChild(defSlideRow);

  var simRow = document.createElement("div");
  simRow.classList.add("row", "text-center");
  var simCol = document.createElement("div");
  simCol.classList.add("col-12");
  var simButton = document.createElement("button");
  simButton.innerHTML = "GO";
  simButton.addEventListener('click', function() {
    playOff(currOffFocus);
  });

  simCol.appendChild(simButton);
  simRow.appendChild(simCol);
  root.appendChild(simRow);

}
