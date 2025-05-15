// Genera array de los primeros 151 Pokémon
const pokemons = Array.from({ length: 151 }, (_, i) => ({
  name: "",
  image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i + 1}.png`,
  number: i + 1
}));

// Nombres de los 151 Pokémon (por orden)
const pokemonNames = [
  "bulbasaur","ivysaur","venusaur","charmander","charmeleon","charizard","squirtle","wartortle","blastoise",
  "caterpie","metapod","butterfree","weedle","kakuna","beedrill","pidgey","pidgeotto","pidgeot","rattata",
  "raticate","spearow","fearow","ekans","arbok","pikachu","raichu","sandshrew","sandslash","nidoran♀",
  "nidorina","nidoqueen","nidoran♂","nidorino","nidoking","clefairy","clefable","vulpix","ninetales",
  "jigglypuff","wigglytuff","zubat","golbat","oddish","gloom","vileplume","paras","parasect","venonat",
  "venomoth","diglett","dugtrio","meowth","persian","psyduck","golduck","mankey","primeape","growlithe",
  "arcanine","poliwag","poliwhirl","poliwrath","abra","kadabra","alakazam","machop","machoke","machamp",
  "bellsprout","weepinbell","victreebel","tentacool","tentacruel","geodude","graveler","golem","ponyta",
  "rapidash","slowpoke","slowbro","magnemite","magneton","farfetch’d","doduo","dodrio","seel","dewgong",
  "grimer","muk","shellder","cloyster","gastly","haunter","gengar","onix","drowzee","hypno","krabby",
  "kingler","voltorb","electrode","exeggcute","exeggutor","cubone","marowak","hitmonlee","hitmonchan",
  "lickitung","koffing","weezing","rhyhorn","rhydon","chansey","tangela","kangaskhan","horsea","seadra",
  "goldeen","seaking","staryu","starmie","mr. mime","scyther","jynx","electabuzz","magmar","pinsir",
  "tauros","magikarp","gyarados","lapras","ditto","eevee","vaporeon","jolteon","flareon","porygon",
  "omanyte","omastar","kabuto","kabutops","aerodactyl","snorlax","articuno","zapdos","moltres","dratini",
  "dragonair","dragonite","mewtwo","mew"
];

// Asignar nombres
pokemons.forEach((p, i) => p.name = pokemonNames[i]);

// Cargar datalist
const datalist = document.getElementById("pokemonList");
pokemonNames.forEach(name => {
  const option = document.createElement("option");
  option.value = name;
  datalist.appendChild(option);
});

let currentPokemon;
let streak = parseInt(localStorage.getItem("streak")) || 0;
let mode = "classic";
let guessedCount = 0;
let timer;
let timeRemaining = 120;
let timeAttackStarted = false;

document.getElementById("dayLabel").textContent = new Date().toLocaleDateString();

function startGame(selectedMode) {
  mode = selectedMode;
  guessedCount = 0;
  timeAttackStarted = false;
  clearInterval(timer);
  document.getElementById("result").textContent = "";
  document.getElementById("guessInput").value = "";
  document.getElementById("pokemonImg").style.filter = "brightness(0%)";

  // Modo clásico: Pokémon del día
  if (mode === "classic") {
    const todayIndex = new Date().getDate() % pokemons.length;
    currentPokemon = pokemons[todayIndex];
  } else {
    currentPokemon = pokemons[Math.floor(Math.random() * pokemons.length)];
  }

  loadPokemonImage();

  if (mode === "classic") {
    document.getElementById("statusText").innerHTML = `Racha actual: <span id="streak">${streak}</span>`;
  } else {
    document.getElementById("statusText").textContent = "Adivinados: 0";
  }

  if (mode !== "timeAttack") {
    document.getElementById("timer").textContent = "";
  }
}

function updateTimer() {
  document.getElementById("timer").textContent = `Tiempo restante: ${timeRemaining}s`;
}

function loadPokemonImage() {
  const img = document.getElementById("pokemonImg");
  const preload = new Image();
  preload.onload = () => {
    img.src = preload.src;
    img.style.filter = "brightness(0%)";
  };
  preload.src = currentPokemon.image;
}

function checkGuess() {
  const guess = document.getElementById("guessInput").value.toLowerCase().trim();
  const result = document.getElementById("result");

  if (guess === currentPokemon.name.toLowerCase()) {
    result.textContent = "¡Correcto!";
    document.getElementById("pokemonImg").style.filter = "none";

    if (mode === "classic") {
      const today = new Date().toLocaleDateString();
      if (localStorage.getItem("lastPlayed") !== today) {
        streak++;
        localStorage.setItem("lastPlayed", today);
        localStorage.setItem("streak", streak);
      }
      document.getElementById("statusText").innerHTML = `Racha actual: <span id="streak">${streak}</span>`;
    }

    if (mode === "timeAttack") {
      if (!timeAttackStarted) {
        timeAttackStarted = true;
        timeRemaining = 120;
        updateTimer();
        timer = setInterval(() => {
          timeRemaining--;
          updateTimer();
          if (timeRemaining <= 0) {
            clearInterval(timer);
            document.getElementById("result").textContent = `Fin del tiempo. Adivinaste ${guessedCount} Pokémon(s).`;
          }
        }, 1000);
      }
    }

    if (mode === "timeAttack" || mode === "free") {
      guessedCount++;
      document.getElementById("statusText").textContent = `Adivinados: ${guessedCount}`;
      setTimeout(() => {
        document.getElementById("guessInput").value = "";
        document.getElementById("result").textContent = "";
        currentPokemon = pokemons[Math.floor(Math.random() * pokemons.length)];
        loadPokemonImage();
      }, 1000);
    }
  } else {
    result.textContent = "Incorrecto. Intenta de nuevo.";
  }
}

window.onload = () => {
  startGame('classic');
};
