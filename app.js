const mainText = document.querySelector('.mainText');
const user = 'rebekkabb';
const repositories = [];
getAllData();

//Fetch all data
async function getAllData() {
    try {
        let response = await fetch('http://api.github.com/users/' + user + '/repos');
        let data = await response.json();
        extractRepos(data);

    } catch (err) {
        console.log(err);
    }
}


async function extractRepos(data) {
    for (const repo of data) {
        await extractData(repo)
    }
    // console.log(data);
    sortRepositories();
    displayHTML();


}

function sortRepositories(){
    repositories.sort((a, b) => a.date.localeCompare(b.date));
}

async function extractData(repository) {
    try {
        const name = getName(repository);
        const languages = await getLanguages(repository);
        const date = getDate(repository);
        const description = getDescription(repository);
        const link = getLink(repository);

        // mainText.innerHTML += `<br> ${name} ${languages} ${date} ${description} <a href=${link} target="_blank"> Link </a> <hr>`;
        let repo = {name: name, languages: languages, date: date, description: description, link: link};
        repositories.push(repo);
    } catch (err) {
        console.log(err);
    }
}

function displayHTML() {
    console.log(repositories);
    repositories.forEach(function func(item) {
        console.log("print");
        mainText.innerHTML += `<br> ${item.name} ${item.date}<hr>`;
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
        // console.log(Object.keys(data));
        return Object.keys(data);
    } catch (err) {
        console.log(err);
    }

}