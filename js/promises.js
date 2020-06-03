const astrosUrl = "http://api.open-notify.org/astros.json";
const wikiUrl = "https://en.wikipedia.org/api/rest_v1/page/summary/";
const peopleList = document.getElementById("people");
const btn = document.querySelector("button");

// making an AJAX request
// we deleted the call back
function getJSON(url) {
  // adding a promise to resolve the data
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = () => {
      if (xhr.status === 200) {
        let data = JSON.parse(xhr.responseText);
        resolve(data);
      } else {
        reject(Error(xhr.statusText));
      }
    };
    xhr.send();
    xhr.onerror = () => reject(Error("A network error occurred"));
  });
}

// we will have this  return one array
function getProfiles(json) {
  const profiles = json.people.map((person) => {
    //putting this because we are having an issue with the name
    if (person.name == "Anatoly Ivanishin") {
      person.name = "Anatoli_Ivanishin";
    }
    return getJSON(wikiUrl + person.name);
  });
  // this will reject if one of them fails
  return Promise.all(profiles);
}
// generate the markup of each person
function generateHTML(data) {
  // now we map out the data for our HTML
  data.map((person) => {
    const section = document.createElement("section");
    peopleList.appendChild(section);
    section.innerHTML = `
      <img src=${person.thumbnail.source}>
      <h2>${person.title}</h2>
      <p>${person.description}</p>
      <p>${person.extract}</p>
    `;
  });
}

btn.addEventListener("click", (event) => {
  event.target.textContent = "Loading...";
  getJSON(astrosUrl)
    .then(getProfiles)
    // generating html
    .then(generateHTML)
    .catch((err) => {
      // this message appears at the end of an error
      peopleList.innerHTML = "<h3>Something went wrong...</h3>";
      console.log(err);
    })
    // finally returns a function to cap it off
    .finally(() => {
      event.target.remove();
    });
});
