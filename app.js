const mainContent = document.querySelector(".timeline");
let user = 'rebekkabb';
let repositories = [];
let isLeft = true;

const usernameInput = document.querySelector("#username-input");

usernameInput.addEventListener("keyup", function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.querySelector("#input-button").click();
    }
});

function saveUsernameAndSearch() {
    clearThePage();
    user = document.querySelector("#username-input").value;
    console.log("inserted username" + user);
    getAllData();
}

function clearThePage() {
    mainContent.innerHTML = "";
    repositories = [];
}

function noUserFound() {
    mainContent.innerHTML = "No such user found";
}


async function getAllData() {
    try {
        console.log("beginning work now");
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
        return {name: name, languages: languages, date: date, description: description, link: link};
    } catch (err) {
        console.log(err);
    }
}

function displayHTML() {
    repositories.forEach(function func(item) {
        if (isLeft) {
            mainContent.innerHTML += `<div class="container left"> <div class="data"> 
            <h1>${item.name}</h1></h1>
            <p>${item.date}</p>
            <a href=${item.link} target="_blank"> Link to Github </a>
            </div></div>`
            isLeft = false;
        } else {
            mainContent.innerHTML += `<div class="container right"> <div class="data"> 
            <h1>${item.name}</h1></h1>
            <p>${item.date}</p>
            <a href=${item.link} target="_blank"> Link to Github </a>
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
