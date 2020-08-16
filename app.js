const mainContent = document.querySelector(".repositories");
let user = 'rebekkabb';
let repositories = [];

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


async function getAllData() {
    try {
        console.log("beginning work now");
        let response = await fetch('http://api.github.com/users/' + user + '/repos');
        let data = await response.json();
        extractRepos(data);

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
        console.log("print");
        mainContent.innerHTML += `<br> <p> ${item.name} ${item.date} <a href=${item.link} target="_blank"> Link to Github </a> </p><hr>`;
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
