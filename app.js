const mainText = document.querySelector('.mainText');
const user = 'rebekkabb';


//Fetch all data
fetch('http://api.github.com/users/' + user + '/repos')
    .then(response => response.json())
    .then(data => extractRepos(data));


function extractRepos(data) {
    data.forEach(extractData);
    console.log(data);
}

async function extractData(repository) {
    try {
        const name = getName(repository);
        const languages = await getLanguages(repository);
        const date = getDate(repository);
        const description = getDescription(repository);
        const link = getLink(repository);

        mainText.innerHTML += `<br> ${name} ${languages} ${date} ${description} <a href=${link} target="_blank"> Link </a> <hr>`;

    } catch (err) {
        console.log(err);
    }
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