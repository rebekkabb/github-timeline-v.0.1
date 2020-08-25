const mainContent = document.querySelector(".timeline");
const errorArea = document.querySelector(".errorArea");
let user = 'rebekkabb';
let repositories = [];
let isLeft = true;

let removedIntro = false;

const usernameInput = document.querySelector("#username-input");
const headline = document.querySelector(".headline");
const introText = document.querySelector(".introText");

const starSvg = `<svg viewBox="0 0 15 15" width="15" height="15"> <path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path> </svg>`;

usernameInput.addEventListener("keyup", function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.querySelector("#input-button").click();
    }
});

function saveUsernameAndSearch() {
    clearThePage();
    user = document.querySelector("#username-input").value;
    getAllData();
}

function clearThePage() {
    mainContent.innerHTML = "";
    errorArea.innerHTML = "";
    headline.innerHTML = "";
    if(removedIntro === false){
        introText.parentNode.removeChild(introText);
        removedIntro = true;
    }

    repositories = [];
}

function noUserFound() {
    errorArea.innerHTML += "No such user found";
}


async function getAllData() {
    try {
        let response = await fetch('http://api.github.com/users/' + user + '/repos');
        if (response.status === 404) {
            noUserFound();
        } else {
            let data = await response.json();
            extractRepos(data);
        }

    } catch (err) {
        console.log(err);
    }
}


async function extractRepos(data) {
    let promises = [];
    for (const repo of data) {
        promises.push(extractData(repo));
    }

    for (const promise of promises) {
        repositories.push(await promise);
    }
    sortRepositories();
    displayHTML();
}

function sortRepositories() {
    repositories.sort((a, b) => a.date.localeCompare(b.date));
}

async function extractData(repository) {
    try {
        const name = getName(repository);
        const languages = await getLanguages(repository);
        const date = getDate(repository);

        const description = getDescription(repository);
        const link = getLink(repository);
        const stars = getStars(repository);
        return {name: name, languages: languages, date: date, description: description, link: link, stars: stars};
    } catch (err) {
        console.log(err);
    }
}

function displayHTML() {
    headline.innerHTML = `Timeline of ${user}'s public GitHub repositories: `;
    repositories.reverse();

    repositories.forEach(function func(item) {
        const readableDate = new Date(item.date);
        const langsWithSpaces = item.languages.join(', ');
        if (isLeft) {
            mainContent.innerHTML += `<div class="container left"> <div class="data"> 
            <a href=${item.link} target="_blank">${item.name}</a>
            <i>${readableDate.toDateString()}</i>
            <p> ${item.description} </p>
            <p> ${langsWithSpaces} </p>
            <div class="stars">  <span>${item.stars}</span> ${starSvg} </div>
            </div></div>`
            isLeft = false;
        } else {
            mainContent.innerHTML += `<div class="container right"> <div class="data"> 
            <a href=${item.link} target="_blank">${item.name}</a>
            <i>${readableDate.toDateString()}</i>
            <p> ${item.description} </p>
            <p> ${langsWithSpaces} </p>
            <div class="stars">  <span>${item.stars}</span> ${starSvg} </div>
            </div></div>`
            isLeft = true;
        }
    })
}

function getName(repository) {
    return repository.name;
}

function getDate(repository) {
    return repository.created_at;
}

function getDescription(repository) {
    if (repository.description == null) {
        return "No description available"
    } else {
        return repository.description;
    }
}

function getLink(repository) {
    return repository.html_url;
}

async function getLanguages(repository) {
    try {
        let languages = await fetch('http://api.github.com/repos/' + user + '/' + repository.name + '/languages');
        let data = await languages.json();
        return Object.keys(data);
    } catch (err) {
        console.log(err);
    }

}

function getStars(repository) {
    return repository.stargazers_count;
}
