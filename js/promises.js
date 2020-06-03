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
      } else reject(Error(xhr.statusText));
    };
    xhr.onerror = () => reject(Error("A network error occurred"));
    xhr.send();
  });
}

// we will have this  return one array
function getProfiles(json) {
  const profiles = json.people.map((person) => {
    return getJSON(wikiUrl + person.name);
  });
  return profiles;
}

// generate the markup of each person
function generateHTML(data) {
  const section = document.createElement("section");
  peopleList.appendChild(section);
  section.innerHTML = `
    <img src=${data.thumbnail.source}>
    <h2>${data.title}</h2>
    <p>${data.description}</p>
    <p>${data.extract}</p>
  `;
}

btn.addEventListener("click", (event) => {
  getJSON(astrosUrl)
    .then(getProfiles)
    // we are going to log our data
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });

  event.target.remove();
});
