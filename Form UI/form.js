//Color checker
const form = document.querySelector("form");
const colorInput = document.querySelector("#web_color1");
const colorHiddenInput = document.querySelector("#color-hidden");

colorInput.addEventListener("change", function () {
  colorHiddenInput.value = colorInput.value;
});

form.addEventListener("submit", function (event) {
  if (colorHiddenInput.value === "#000000") {
    event.preventDefault();
    alert("Please pick at last a color");
  }
  if (colorHiddenInput.value !== "#000000") {
    event.preventDefault();
    const data = new FormData(this);
    var formData = {};
    for (const pair of data.entries()) {
      formData[pair[0]] = pair[1];
    }

    fetch("http://localhost:3000/submit-form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    setTimeout(() => {
      window.location.href = "../Gen_Website/Gen_Web.html";
    }, 500);
  }
});

//Drop Down Menu
let names = [
  "Social Media",
  "E-commerce",
  "News",
  "Blogging",
  "Entertainment",
  "Search Engine",
  "Educational",
  "Job Search",
  "Forum",
  "Community",
  "Government",
  "Business Directory",
  "Weather",
  "Sports",
  "Travel",
  "Food",
  "Music",
  "Video Sharing",
  "Photo Sharing",
  "Online Marketplace",
  "Review Aggregator",
  "Video Game",
  "Gaming Community",
  "Personal Portfolio",
  "Online Magazine",
  "Streaming Video",
  "Live Streaming",
  "Online Learning",
  "Online Forum",
  "Dating",
  "File Sharing",
  "Webmail",
  "Online Auction",
  "Real Estate",
  "Internet Radio",
  "Tech News",
  "E-book",
  "Humor",
  "Science",
  "Fashion",
  "Health",
  "Beauty",
  "Automotive",
  "Hobby",
  "Outdoor Recreation",
  "Parenting",
  "Finance",
  "Insurance",
  "Social Network for Professionals",
  "Online Business Card",
  "Graphic Design",
  "Web Design",
  "Freelance Marketplace",
  "Online Translation",
  "Online Collaboration",
  "Virtual Tour",
  "Gossip",
  "Celebrity News",
  "Personal Blog",
  "Educational Games",
  "Personal Finance",
  "Sports Betting",
  "Stock Trading",
  "Online Advertising",
  "Political News",
  "Charity",
  "Non-profit",
  "Horoscope",
  "Weather Forecast",
  "Sports News",
  "Fantasy Sports",
  "Political Blog",
  "Music Streaming",
  "Podcast",
  "Gardening",
  "Recipe",
  "Humor Blog",
  "Online Comics",
  "Webcomic",
  "Artistic Portfolio",
  "Digital Art Community",
  "Photography Portfolio",
  "Travel Blog",
  "Tech Blog",
  "Job Board",
  "Creative Writing",
  "Literary Magazine",
  "Online Resume",
  "Online Store",
  "Beauty Blog",
  "Fitness Blog",
  "Pet Care",
  "Pet Adoption",
  "Animal Rights",
  "Home Improvement",
  "DIY",
  "Architecture",
  "Wedding Planning",
  "Photography Services",
  "Interior Design",
  "Greeting Card",
  "Online Therapy",
  "Legal Advice",
  "Medical Advice",
  "Health Forum",
  "Online Support Group",
  "Online Meditation",
  "Religious Forum",
  "Online Book Club",
  "Music News",
  "Online Jewelry Store",
  "Handmade Crafts",
  "Luxury Goods",
  "Web Hosting",
  "Online Banking",
  "Online Tax Filing",
  "Online Surveys",
  "Online Tutoring",
  "Online Gaming Store",
  "Social Network for Gamers",
  "Online Auction for Charity",
  "Online Fundraising",
  "Online Auction for Art",
  "Online Auction for Collectibles",
  "Online Auction for Antiques",
  "Online Auction for Cars",
  "Online Auction for Real Estate",
  "Online Auction for Travel Packages",
  "Online Auction for Luxury Goods",
  "Online Auction for Electronics",
  "Online Auction for Sports Memorabilia",
  "Online Auction for Toys",
  "Online Auction for Clothing",
  "Online Auction for Handmade Crafts",
  "Online Auction for Jewelry",
];
//Sort names in ascending order
let sortedNames = names.sort();

//reference
let input = document.getElementById("web_type");

//Execute function on keyup
input.addEventListener("keyup", (e) => {
  //loop through above array
  //Initially remove all elements ( so if user erases a letter or adds new letter then clean previous outputs)
  removeElements();
  for (let i of sortedNames) {
    //convert input to lowercase and compare with each string

    if (
      i.toLowerCase().startsWith(input.value.toLowerCase()) &&
      input.value != ""
    ) {
      //create li element
      let listItem = document.createElement("li");
      //One common class name
      listItem.classList.add("list-items");
      listItem.style.cursor = "pointer";
      listItem.setAttribute("onclick", "displayNames('" + i + "')");
      //Display matched part in bold
      let word = "<b>" + i.substr(0, input.value.length) + "</b>";
      word += i.substr(input.value.length);
      //display the value in array
      listItem.innerHTML = word;
      document.querySelector(".list").appendChild(listItem);
    }
  }
});
function displayNames(value) {
  input.value = value;
  removeElements();
}
function removeElements() {
  //clear all the item
  let items = document.querySelectorAll(".list-items");
  items.forEach((item) => {
    item.remove();
  });
}

// Name of Website Genaerator
let names2 = [
  "Facebook",
  "Amazon",
  "WordPress",
  "CNN",
  "Google",
  "Gmail",
  "YouTube",
  "Udemy",
  "Indeed",
  "eBay",
  "Match",
  "Bluehost",
  "Booking.com",
  "ESPN",
  "Weather.com",
  "Zillow",
  "NASDAQ",
  "ASOS",
  "Steam",
  "Spotify",
  "DeviantArt",
  "Food.com",
  "WebMD",
  "Politico",
  "ScienceDirect",
  "TechCrunch",
  "Gardening Know How",
  "Sephora",
  "Car and Driver",
  "IMDb",
  "Forbes",
  "Charity Navigator",
  "Project Gutenberg",
  "Podbean",
  "BabyCenter",
  "LinkedIn",
  "Upwork",
  "Duolingo",
  "Eventbrite",
  "Coinbase",
  "Wix",
  "Fitbit",
  "Oculus",
  "eBid",
  "Dropbox",
  "Reddit",
  "Kickstarter",
  "Delicious",
  "GoFundMe",
  "Flickr",
  "Twitch",
  "Shutterfly",
  "Google Analytics",
  "Namecheap",
  "Monster",
  "PayPal",
  "Mega",
  "StumbleUpon",
  "Patreon",
  "Netflix",
  "Vistaprint",
  "Google Drive",
  "HubSpot",
  "SurveyMonkey",
  "Zillow Rental Manager",
  "WordPress.com",
  "Canva",
  "TurboTax",
  "BetterHelp",
  "Chase",
  "Squarespace",
  "Facebook Ads Manager",
  "DocuSign",
  "Mint",
  "Noom",
  "Etsy",
  "Skillshare",
  "Carbonite",
  "Box",
  "Hootsuite",
  "Zoho",
  "Evernote",
  "MyFitnessPal",
  "TD Bank",
  "Bing",
  "Google Ads",
  "DocuSign Signature",
  "Mental Health America",
  "TaxSlayer",
  "eBay for Charity",
  "Walmart Marketplace",
  "Square",
  "Amazon Web Services",
  "Zoom",
  "www",
  "www",
  "www",
  "www",
  "www",
  "www",
  "www",
  "www",
  "www",
  "www",
  "www",
];
//Sort names in ascending order
let sortedNames2 = names2.sort();

//reference
let input2 = document.getElementById("web_name");

//Execute function on keyup
input2.addEventListener("keyup", (e) => {
  //loop through above array
  //Initially remove all elements ( so if user erases a letter or adds new letter then clean previous outputs)
  removeElements();
  for (let i of sortedNames2) {
    //convert input to lowercase and compare with each string

    if (
      i.toLowerCase().startsWith(input2.value.toLowerCase()) &&
      input2.value != ""
    ) {
      //create li element
      let listItem2 = document.createElement("li");
      //One common class name
      listItem2.classList.add("list-items");
      listItem2.style.cursor = "pointer";
      listItem2.setAttribute("onclick", "displayNames2('" + i + "')");
      //Display matched part in bold
      let word = "<b>" + i.substr(0, input2.value.length) + "</b>";
      word += i.substr(input2.value.length);
      //display the value in array
      listItem2.innerHTML = word;
      document.querySelector(".list2").appendChild(listItem2);
    }
  }
});
function displayNames2(value2) {
  input2.value = value2;
  removeElements();
}
function removeElements() {
  //clear all the item
  let items = document.querySelectorAll(".list-items");
  items.forEach((item) => {
    item.remove();
  });
}
