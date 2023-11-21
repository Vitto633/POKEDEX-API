const BASEURL = "https://pokeapi.co/api/v2/pokemon/"

document.addEventListener("DOMContentLoaded", getPokemonList)

function getPokemonList() {
    fetch(BASEURL + '?limit=251')
        .then(response => {
            if (response.status === 200) {
                return response.json()
            }
        })
        .then(data => {
            data.results.forEach(pokemon => {
                displayPokemon(pokemon)
            });
        })
        .catch(error => console.error(error))
}

function getPokemonDetails(id) {
    if (id <= 251) {
        const url = `${BASEURL}${id}/`
        return fetch(url)
            .then(response => {
                if (response.status === 200) {
                    return response.json()
                } 
            });
    } else {
        alert ("ID inválido ( 1 - 251 ) ")
    }
}

function showPokemonDetails(id) {
    getPokemonDetails(id)
        .then(pokemon => {
            showPokemonDetailsModal(pokemon)
        });
}

function showPokemonByIdPrompt() {
    const pokemonId = prompt("Digite o ID do Pokémon:")
    if (pokemonId) {
        showPokemonDetails(pokemonId);
    }
}

function displayPokemon(pokemon) {
    let liPokemon = document.createElement("li")
    let liPokemonImg = document.createElement("img")

    const pokemonId = pokemon.url.split('/')[6];
    liPokemonImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`
    liPokemon.innerHTML = `${pokemon.name} - ${pokemonId}`

    liPokemon.setAttribute('data-pokemon-id', pokemonId)
    liPokemonImg.addEventListener("click", function () {
        const clickedPokemonId = this.parentNode.getAttribute('data-pokemon-id')
        addToTeam(clickedPokemonId)
    });

    const detailsButton = document.createElement("button")
    detailsButton.textContent = "Detalhes"
    detailsButton.addEventListener("click", function () {
        const clickedPokemonId = this.parentNode.getAttribute('data-pokemon-id');
        showPokemonDetails(clickedPokemonId)
    });

    liPokemon.appendChild(liPokemonImg)
    liPokemon.appendChild(detailsButton)

    document.getElementById("ListaPokemons").appendChild(liPokemon)
}



function showPokemonDetailsModal(pokemon) {
    const modalContent = document.getElementById("modalContent")
    modalContent.innerHTML = `<h2 id="pokemonName">${pokemon.name}</h2>`

    
    const detailsContainer = document.createElement("div")
    detailsContainer.id = "pokemonDetails"
    detailsContainer.innerHTML = `
        <div class="pokemon-details-inner">
            <img src="${pokemon.sprites.front_default}" alt="Imagem de ${pokemon.name}" class="pokemon-image">
            <div class="details-text">
                <strong>Tipo:</strong> ${pokemon.types.map(type => type.type.name).join(", ")}<br>
                <strong>Altura:</strong> ${pokemon.height / 10} m<br>
                <strong>Peso:</strong> ${pokemon.weight / 10} kg<br>
                <strong>Categoria:</strong> ${pokemon.species.name}
            </div>
        </div>
    `
    modalContent.appendChild(detailsContainer)

    const addToTeamButton = document.createElement("button")
    addToTeamButton.id = "addToTeamButton"
    addToTeamButton.textContent = "Adicionar ao Time"
    addToTeamButton.addEventListener("click", function () {
        addToTeam(pokemon.id)
        closeModal()
    });
    modalContent.appendChild(addToTeamButton)

    const modal = document.getElementById("pokemonModal")
    modal.style.display = "block"
}

function closeModal() {
    const modal = document.getElementById("pokemonModal")
    modal.style.display = "none"
}

function addToTeam(pokemonId) {
    const teamList = document.getElementById("teamPokemonList")

    const existingPokemon = teamList.querySelector(`[data-pokemon-id="${pokemonId}"]`)
    if (existingPokemon) {
        removeFromTeam(pokemonId)
    } else {
        if (teamList.childElementCount < 6) {
            const teamPokemon = document.createElement("li")
            const teamPokemonImg = document.createElement("img")

            teamPokemonImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`
            teamPokemon.textContent = `ID: ${pokemonId}`

            teamPokemon.setAttribute('data-pokemon-id', pokemonId)
            teamPokemon.addEventListener("click", function () {
                const clickedPokemonId = this.getAttribute('data-pokemon-id')
                removeFromTeam(clickedPokemonId)
            });

            teamPokemon.appendChild(teamPokemonImg)
            teamList.appendChild(teamPokemon)
        } else {
            alert("Você atingiu o limite de 6 Pokémon no time!")
        }
    }
}

function removeFromTeam(pokemonId) {
    const teamList = document.getElementById("teamPokemonList")
    const teamPokemon = document.querySelector(`#teamPokemonList [data-pokemon-id="${pokemonId}"]`)

    if (teamPokemon) {
        teamList.removeChild(teamPokemon)
    }
}

function showPokemonList() {
    document.getElementById("pokemonDetails").innerHTML = ""

    fetch(BASEURL + '?limit=251')
        .then(response => {
            if (response.status === 200) {
                return response.json()
            }
        })
        .then(data => {
            document.getElementById("ListaPokemons").innerHTML = ""

            data.results.forEach(pokemon => {
                displayPokemon(pokemon)
            })
        })
}
