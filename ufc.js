//DATA (JSON File of data originally from csv file)
var data = _data; //_data contains JSON data, this var assignment is for clarity

//STORING DATA BY FIGHTER USING MAP (FOR CONVENIENCE)
var fighters = new Map(); //using prebuilt JS map because they're not important for the actual search algorithms
for(fight in data){ //look through all fights
  { //store red fighter
    let previous = fighters.get(data[fight].R_fighter);
    if(!previous){ //first entry
      let fighterObj = new Fighter(data[fight], "red");
      fighters.set(fighterObj.name, fighterObj);
    }
    else //following entries
      previous.update(data[fight], "red");
  }
  { //store blue fighter
    let previous = fighters.get(data[fight].B_fighter);
    if(!previous){ //first entry
      let fighterObj = new Fighter(data[fight], "blue");
      fighters.set(fighterObj.name, fighterObj);
    }
    else //following entries
      previous.update(data[fight], "blue");
  }
}
//MOVING DATA(FIGHTER OBJECTS) TO ARRAY AND SORTING (FOR THE SEARCHING ALGORITHMS)
{
  var fightersArr = [];
  let i = 0; //local variable
  for([key, value] of fighters)
    fightersArr[i++] = value;
  fightersArr.sort((a, b) => (a.name > b.name) ? 1 : -1); //using sort() from array methods because it's trivial and not a part of the actual search algorithms
}


//SEARCH ALGORITHMS (THE ONES I AM COMPARING FOR THIS PROJECT)
//1. Jump Search: O(sqrt(n)) runtime
function jumpSearch(arr, target, passCounter){
  target = target.toLowerCase();
  var increment = Math.sqrt(arr.length); //increments of size sqrt(n)
  increment = Math.floor(increment); //round up in case of Non Perfect Square
  var startPos = increment-1; //start pos = increment (-1 because of 0 indexing)
  var prev = 0; //target could be between prev and pos
  //traverse array in increments of sqrt(n)
  for(var i=startPos; i<arr.length; i+=increment){ // O(sqrt(n))
    passCounter.val++;
    if(arr[i].name.toLowerCase() >= target){ //if target is within range
      for(let j=prev+1; j<=i; j++){ //traverse (prev->pos)
        if(arr[j].name.toLowerCase() == target)return arr[j]; //target found
      }
    }
    prev += increment;
  }
  //in case we had to round sqrt(n) increment, check the remaining elements (linear search on remaining chunk of max size sqrt(n))
  while(i<arr.length){  //another (non-nested) O(sqrt(n)) traversal(of final elements)
    if(arr[i].name == target)return arr[i]; //target found
    i++; // 'i' begins where previous for-loop left off.
  }
  //if target is never found
  return null;
}
//2. Exponential Search: O(log(n)) runtime
function exponentialSearch(arr, target, passCounter){
  target = target.toLowerCase();
  var startPos = 1;
  //traverse array in increments of (previous_increment*2) O(log(n)) runtime
  for(var i=startPos; i<arr.length; i*=2){
    passCounter.val++;
    if(arr[i].name.toLowerCase() >= target) //if target in range (i/2->i), do binarySearch on range
      return binarySearch(arr, target, i/2, i);
  }
  //at this point, 'i' is either (A): near end of array OR (B): at the end
  //do binary search on remaining elements
  return binarySearch(arr, target, i/2, arr.length); //returns null if at the end of array
}
//Still 2. Binary Search (Used in exponential search^): O(log(n)) runtime
function binarySearch(arr, target, pos, end){
  if(pos>=end) return null; //return if done and target not found
  let middle = (end-pos)/2 + pos; //middle of array
  if (middle%1 != 0)
    return null;
  if(arr[middle].name.toLowerCase() == target) return arr[middle]; //return if target found
  //recursion
  if(arr[middle].name.toLowerCase() > target) //recurse forward
    return binarySearch(arr, target, pos, middle);
  else //recurse backward
    return binarySearch(arr, target, middle, end);
}


//SETTING UP THE HTML AND CSS DYNAMICALLY WITH JAVASCRIPT
//I know that it would be faster with pure html and css,
//but im trying to use this project to learn JS specifically

//USEFUL VARIABLES
const red = "#ff3d3d";
const lightGray = "#dbdfe0";
const white = "#ffffff";
const topSize = 150;
const titleSize = 60;
const midSize = window.innerHeight - topSize; //remainder of window
var searchDisplay;

//ENTIRE WINDOW
document.body.style.fontFamily = "Helvetica, sans-serif";
document.body.style.background = lightGray;
//resizing elements when window is resized
window.addEventListener("resize", resizeUpdate);
function resizeUpdate(){
  topUI.style.width = window.innerWidth + "px";
  midUI.style.width = window.innerWidth + "px";
  midUI.style.height = window.innerHeight - topSize + "px";
  if(window.innerWidth < 800) //scaling fontSize according to screen width
    title.style.fontSize = (titleSize/800)*window.innerWidth + "px";
}

//TOP SECTION
//background
var topUI = document.createElement("div");
topUI.style.width = window.innerWidth + "px";
topUI.style.height = topSize + "px";
topUI.style.background = red;
topUI.style.position = "absolute";
topUI.style.display = "flex";
topUI.style.justifyContent = "center";
topUI.style.overflow = "hidden";
document.body.appendChild(topUI);
//title
var title = document.createElement("p");
title.innerHTML = "<b>UFC FIGHTER STATS<b>";
title.style.fontSize = titleSize + "px";
title.style.textDecoration = "underline";
title.style.color = lightGray;
title.style.zIndex = "2";
title.style.margin = 30 + "px";
topUI.appendChild(title);
//fighter icon image
var topImg = document.createElement("img");
topImg.src = "topImgSmall.png";
topImg.style.position = "absolute";
topImg.style.top = 100 + "px";
topUI.appendChild(topImg);
//reload page when clicked
title.style.cursor = "pointer";
title.addEventListener("click", function(){
  window.location.reload();
  return false; //necessary for this type of eventListener
});

//MIDDLE SECTION
var midUI = document.createElement("div");
midUI.style.width = window.innerWidth + "px";
midUI.style.height = midSize + "px"; //rest of window size
midUI.style.background = lightGray;
midUI.style.top = topSize + "px";
midUI.style.position = "absolute";
document.body.appendChild(midUI);

//SEARCH BAR
var searchContainer = document.createElement("div");
var searchBarText = document.createElement("p");
searchBarText.innerHTML = "<b>Search Fighter<b>";
searchBarText.style.position = "absolute";
searchBarText.style.top = -50 + "px";
searchBarText.style.color = red;
searchBarText.style.fontSize = 22 + "px";
searchBarText.style.textShadow = "0px 0px 1px black";
searchContainer.appendChild(searchBarText);
var searchBar = document.createElement("input");
searchBar.type = "text";
searchBar.placeholder = "e.g. Conor McGregor";
searchBar.style.height = 40 + "px";
searchBar.style.border = 0 + "px";
searchBar.style.outline = 0 + "px";
searchBar.style.padding = 0 + "px";
searchBar.style.fontWeight = "bold";
searchBar.style.textAlign = "left";
searchBar.style.paddingLeft = 20 + "px";
searchBar.style.color = lightGray;
searchBar.style.fontSize = 16 + "px";
searchBar.style.background = red;
searchContainer.style.position = "relative";
searchContainer.style.top = 80 + "px";
searchContainer.style.height = 40 + "px";
searchContainer.style.textAlign = "center";
searchContainer.style.display = "flex";
searchContainer.style.justifyContent = "center";
midUI.appendChild(searchContainer);
searchContainer.appendChild(searchBar);
var searchIcon = document.createElement("img");
searchIcon.src = "searchIcon.png";
searchIcon.style.cursor = "pointer";
searchContainer.appendChild(searchIcon);
//SEARCHING FUNCTIONS
//DETECTING WHEN "ENTER" KEY IS PRESSED
searchBar.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    searchFighter(searchBar.value);
  }
});
//DETECTING WHEN SEARCH ICON IS CLICKED
searchIcon.addEventListener("click", function(){
  searchFighter(searchBar.value);
});
//SEARCH AND DISPLAY RESULTS
function searchFighter(value){
  if(searchDisplay!=null)searchDisplay.remove();
  var jumpCounter = {val: 0};
  results = jumpSearch(fightersArr, value, jumpCounter);
  var exponentialCounter = {val: 0};
  exponentialSearch(fightersArr, value, exponentialCounter);
  if(results==null){
    alert("Sorry! Fighter Not Found.");
    return;
  }
  //FIGHTER PROFILE (SEARCH RESULTS)
  searchDisplay = document.createElement("div");
  searchDisplay.style.width = 620 + "px";
  searchDisplay.style.height = 140 + "px";
  searchDisplay.style.position = "relative";
  searchDisplay.style.top = 180 + "px";
  searchDisplay.style.margin = "auto";
  searchDisplay.style.display = "flex";
  var profile = document.createElement("div");
  profile.style.display = "flex";
  profile.style.justifyContent = "center";
  profile.style.border = "2px solid red";
  profile.style.width = 240 + "px";
  //profile title
  var profileTitle = document.createElement("div");
  profileTitle.innerHTML = "<b>Fighter Data:<b>";
  profileTitle.style.position = "absolute";
  profileTitle.style.top = -30 + "px";
  profileTitle.style.color = red;
  profileTitle.style.fontSize = 22 + "px";
  profileTitle.style.textShadow = "0px 0px 1px black";
  profile.appendChild(profileTitle);
  //profile container
  var profileContainer = document.createElement("div");
  profileContainer.style.display = "inline-block";
  //profile text
  var profileText = document.createElement("p");
  profileText.innerHTML = "Name: <span style=\"display:inline; color:"+red+";\">" + results.name + "</span>"
  + "<br>UFC Record: <span style=\"display:inline; color:"+red+";\">" + results.record + "</span>"
  + "<br>Average Odds: <span style=\"display:inline; color:"+red+";\">" + results.getAvgOdds() + "</span>"
  + "<br>Height: <span style=\"display:inline; color:"+red+";\">" + results.height + "</span>"
  + "<br>Reach: <span style=\"display:inline; color:"+red+";\">" + results.reach + "</span>"
  + "<br>Age: <span style=\"display:inline; color:"+red+";\">" + results.age + "</span>";
  profileText.style.fontWeight = "bold";
  profileText.style.textShadow = "0px 0px 1px black";
  profileText.style.lineHeight = "1.25";
  profileText.style.margin = 8 + "px";
  profile.appendChild(profileText);
  profileContainer.appendChild(profile);
  searchDisplay.appendChild(profileContainer);
  midUI.appendChild(searchDisplay);
  //ALGORITHM ANALYSIS
  //curcly bracket
  var bracket = document.createElement("img");
  bracket.src = "bracket.png";
  bracket.style.display = "inline-block";
  bracket.style.padding = 0 + "px " + 20 + "px";
  searchDisplay.appendChild(bracket);
  //text description
  var algoText = document.createElement("p");
  algoText.innerHTML = "It took the <span style=\"display:inline; color:"+red+";\">Jump-Search</span> (O(√n)) algorithm "
  + "<span style=\"display:inline; color:"+red+";\">"+ jumpCounter.val +"</span>" + " passes to find this fighter. "
  + " The <span style=\"display:inline; color:"+red+";\">Exponential-Search</span> (O(logn)) algorithm took "
  + "<span style=\"display:inline; color:"+red+";\">"+ exponentialCounter.val +"</span>" + " passes in comparison.";
  algoText.style.fontWeight = "bold";
  algoText.style.textShadow = "0px 0px 1px black";
  algoText.style.lineHeight = "1.45";
  algoText.style.margin = 8 + "px";
  algoText.style.fontSize = 15 + "px";
  algoText.style.padding = 10 + "px " + "0px";
  searchDisplay.appendChild(algoText);
}


//EXTRA FUNCTIONS/OBJECTS THAT ARE USEFUL FOR PROJECT
//FIGHTER CONSTRUCTOR
function Fighter(fight, side){
  if(side == "red"){
    this.name = fight.R_fighter;
    this.fightCount = 1;
    this.age = fight.R_age;
    this.gender = fight.gender;
    this.odds = [fight.R_odds];
    this.weightclasses = [fight.weight_class];
    this.height = formatHeight(fight.R_Height_cms); //string format
    this.reach = formatReach(fight.R_Reach_cms); //string format
    this.wins = 0;
    if(fight.Winner=="Red"){this.wins++;}
    this.losses = 0;
    if(fight.Winner=="Blue"){this.losses++;}
    this.otherOutcomes = 0;
  }
  else if(side == "blue"){
    this.name = fight.B_fighter;
    this.fightCount = 1;
    this.age = fight.B_age;
    this.gender = fight.gender;
    this.odds = [fight.B_odds];
    this.weightclasses = [fight.weight_class];
    this.height = formatHeight(fight.B_Height_cms); //string format
    this.reach = formatReach(fight.B_Reach_cms); //string format
    this.wins = 0;
    if(fight.Winner=="Blue"){this.wins++;}
    this.losses = 0;
    if(fight.Winner=="Red"){this.losses++;}
    this.otherOutcomes = 0;
  }
  //OBJECT FUNCTIONS/METHODS
  //most recent weightclass
  this.getRecentWeightclass = function(){ //most recent weightclass
    return this.weightclasses[this.weightclasses.length-1];
  };
  //update function
  this.update = function(fight, side){
    this.fightCount++;
    if(side=="red"){
      this.odds.push(fight.R_odds);
      this.weightclasses.push(fight.weight_class);
      if(fight.Winner=="Red"){this.wins++;}
      else if(fight.Winner=="Blue"){this.losses++;}
      else{this.otherOutcomes++;}
    }
    if(side=="blue"){
      this.odds.push(fight.B_odds);
      this.weightclasses.push(fight.weight_class);
      if(fight.Winner=="Blue"){this.wins++;}
      else if(fight.Winner=="Red"){this.losses++;}
      else{this.otherOutcomes++;}
    }
    this.record = this.wins + " - " + this.losses + " - " + this.otherOutcomes;
  }
  //avg odds
  this.getAvgOdds = function(){
    let sum = 0;
    for(i in this.odds)
      sum += this.odds[i];
    return Math.round(sum/this.odds.length);
  };
  //win to loss ratio
  this.getWinRatio = function(){
    return Math.round(100*this.wins/this.fightCount) + "%";
  }
}
//UTILITY FUNCTIONS/METHODS
function formatHeight(cms){
  let inches = cms/2.54;
  let ft = Math.floor(inches/12);
  let leftover = Math.round(inches-ft*12);
  return ft + "\'" + leftover + "\"";
}
function formatReach(cms){
  return Math.round(cms/2.54) + "\"";
}
