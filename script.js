    /* 
    1. Hva er en hendelse?
    Et "event" eller en hendelse i Javascript er noe som aktiverer en funksjon. Et eksempel på dette er en klikk hendelse, dette er en hendelse som aktiverer en funksjon når en bruker klikker på et spesifikt element på nettsiden som venter på at en spesifik hendelse. Det er mange flere, men det er en av de mest vanlige hendelsen på en nettside. 
*/

/* 
    2. Hvilke hendelser har vi snakket om? Jeg trenger bare kategoriene.
    User interface hendelser.
    Fokus og blur hendelser.
    Muse hendelser. 
    Tastatur hendelser.
    Skjema hendelser.
    Mutasjons hendelser og observers.
    HTML5 hendelser. 
    CSS hendelser.
*/  

/* 
    3. Lag et lite nettspill der brukeren må trykke på knapper på en nettside. Hva det skal handle om og gjøre er opp til deg, men det skal minst inneholde disse elementene:

        1. En life counter
        Det er så langt to karakterer i spillet, spilleren og en fiende. De er begge satt opp som objekter og har en key value for "Health" eller "life". 

        2. Poeng
        Det er satt opp et poeng system i form av "victories". Hver gang en karakter bekjemper den andre får de et poeng.

        3. En form for interaksjon, enten vha knapper på skjermen eller tastetrykk
        Spillet er avhenging av en nettleser og spilleren har 2 valg som har utfall i spillet. De to valgene er "attack" og "heal". Uten om så er det tre meny valg, "start game"(Starter spillet), "reset"(instiller karakter objektene til standard) og "end game"(avslutter spillet)

        4. Flere valg som må tas underveis. Hva du legger i ordet “valg” er opp til deg.
        Flere valg i dette spillet for en spiller vil være "attack" eller "heal". Spilleren må selv velge hvilke av disse de vil bruke for å nå ende målet som er å vinne mot fienden.  
*/

/* Character data API */
const gameDataUrl = "https://sakh11.github.io/mainassignmentdata-json/gamedata.json"
/* /Character data API */


/* API fetch function - Fetches Character DataS */
async function getGameData() {
    try {
        const response = await fetch(gameDataUrl);
        const data = await response.json();
        console.log(data)
        
        const playerCharacterData = data.player
        const enemyCharacterData = data.enemies
        const randomEnemy = enemyCharacterData[Math.floor(Math.random() * enemyCharacterData.length)];

        playerCharacter = playerCharacterData
        enemyCharacters = randomEnemy

    } 
    
    catch (error) {
        console.error("There was an issue fetching the API.")

        const fetchError = document.createElement("p")
        fetchError.textContent = "There was an issue fetching the API."
        eventLog.appendChild(fetchError)
    }
}

/* /API fetch function */

// Character Objects
let playerCharacter = {}
let enemyCharacters = {}

/* let playerCharacter = {Name: "Adventurer", Attack: 0, Health: 25, Defense: 2, Initiative: 0, Victories: 0};
let enemyCharacter = {Name: "Bandit", Attack: 0, Health: 30, Defense: 4, Initiative: 0, Victories: 0}; */

// Round Counter 
let roundCounter = 1;
let playerTurn = null;

//Character Victory Counter
let playerVictories = 0;
let enemyVictories = 0;

// Character Initiative Storage
let playerInitiative = 0;
let enemyInitiative = 0;

// Character Attack Storage
let playerAttackRoll = 0;
let enemyAttackRoll = 0;

// Player HTML elements
const playerNameDisplay = document.getElementById("player-name")
const playerVictoriesDisplay = document.getElementById("player-victories")
const playerHealthDisplay = document.getElementById("player-health")
const playerAttackDisplay = document.getElementById("player-attack")
const playerDefenseDisplay = document.getElementById("player-defense")
const playerInitiativeDisplay = document.getElementById("player-initative")

// Enemy HTML elements
const enemyNameDisplay = document.getElementById("enemy-name")
const enemyVictoryDisplay = document.getElementById("enemy-victories")
const enemyHealthDisplay = document.getElementById("enemy-health")
const enemyAttackDisplay = document.getElementById("enemy-attack")
const enemyDefenseDisplay = document.getElementById("enemy-defense")
const enemyInitiativeDisplay = document.getElementById("enemy-initiative")

// Round title HTML element
const roundCounterTitle = document.getElementById("round-counter")

// Event log HTML element
const eventLog = document.getElementById("event-log-container")

// Player Actions HTML elements
const actionAttackButton = document.getElementById("player-attack-button")
const actionHealButton = document.getElementById("player-heal-button")

// Game Menu Buttons HTML elements
const menuButtonStart = document.getElementById("start-game-button")
const menuButtonReset = document.getElementById("reset-game-button")
const menuButtonEnd = document.getElementById("end-game-button")

// Event Listeners
menuButtonStart.addEventListener("click", startGame);
menuButtonReset.addEventListener("click", resetGame);
menuButtonEnd.addEventListener("click", endGame);

actionAttackButton.addEventListener("click", () => {
    if (playerTurn) {
        playerAction("attack");
        playerTurn = false;
        actionAttackButton.disabled = true;
        actionHealButton.disabled = true;
    }
})
actionHealButton.addEventListener("click", () => {
    if (playerTurn) {
        playerAction("heal");
        playerTurn = false;
        actionAttackButton.disabled = true;
        actionHealButton.disabled = true;
    }
})


// Textcontent Player Stats
playerNameDisplay.textContent = `${playerCharacter.name}`
playerVictoriesDisplay.textContent = `Victories: ${playerVictories}`
playerHealthDisplay.textContent = `Health: ${playerCharacter.health}`
playerAttackDisplay.textContent = `Attack: ${playerAttackRoll}`
/* playerDefenseDisplay.textContent = `Defense: ${playerCharacter.defense}` */

// Textcontent Enemy Stats
enemyNameDisplay.textContent = `${enemyCharacters.name}`
enemyVictoryDisplay.textContent = `Victories ${enemyVictories}`
enemyHealthDisplay.textContent = `Health: ${enemyCharacters.health}`
enemyAttackDisplay.textContent = `Attack: ${enemyAttackRoll}`
/* enemyDefenseDisplay.textContent = `Defense: ${enemyCharacters.defense}` */


// Observes to see if new elements appear in the event log div, and when a new element is added it automatically scrolls to the bottom in the window
const eventLogObserver = new MutationObserver(scrollToBottom)
const config = {childList: true};
eventLogObserver.observe(eventLog, config)

function scrollToBottom() {
    eventLog.scrollTop = eventLog.scrollHeight;
  }


  
/* 
    Die roll function

    We define our die as six sided by writing (parameter = 6) in the parameter field. This is what is refered to as a default parameter. The parameter name could be anything, we decided to name ours "sides" for clarity as we are defaulting to a 6-sided die. 

    As this is a die we take advantage of the math object call on two of it's methods, .floor and .random.

    .random will give us a random number between 0 and 1. 

    And .floor rounds the number down to the nearest whole number.

    The random number we get is multiplied with the amount of sides our die has.

    And we add +1 to the result we get. This is because the numbers we will recieve is between 0 to 5. So our final result will be between 1 and 6.

*/
// Die Roll Mechanic
// Emulates a 6 sided die when called. Can emulate other dice if an argument is added when calling the function.
function rollDie(sides = 6) {
    return Math.floor(Math.random() * sides) +1;
  }


// Determins who the first roun
function rollInitiative() {
    /* character.Initiative += rollDie() */
    playerInitiative = rollDie()
    enemyInitiative = rollDie()
}


// Rolls how much damage a character deals
function dealDamage() {
    playerAttackRoll += rollDie();
    enemyAttackRoll += rollDie();
}


// Function to resolve damage taken
function takeDamage(character, damage) {
    character.hitPoints -= damage;
    // If statement makes sure health does not go below 0
    if (character.hitPoints < 0) {
        character.hitPoints = 0;
    }
}


// Heal mechanic
function healHealth(character) {
    character.hitPoints += rollDie()
    // If statement makes sure health does not go above 25
    if (character.hitPoints > 100) {
        character.hitPoints = 100;
    }
}


// Resets character attack (Currently not in use)
function resetAttack(character) {
    /* character.Attack = 0; */
    playerAttackRoll = 0
    enemyAttackRoll = 0
}


// Resets character initative (Currently not in use)
/* function resetInitiative(character) {
    character.Initiative = 0;
} */

// Victory point system (Currently not in use)
/* function victoryCounter(character) {
    character.Victories += 1;
} */


function updateStats() {

    // Updates Round count HTML element
    roundCounterTitle.textContent = `Round: ${roundCounter}`

    // Textcontent Player Stats
    playerNameDisplay.textContent = `${playerCharacter.name}`
    playerVictoriesDisplay.textContent = `Victories: ${playerVictories}`
    playerHealthDisplay.textContent = `Health: ${playerCharacter.hitPoints}`
    playerAttackDisplay.textContent = `Attack: ${playerAttackRoll}`
    /* playerDefenseDisplay.textContent = `Defense: ${playerCharacter.Defense}` */

    // Textcontent Enemy Stats
    enemyNameDisplay.textContent = `${enemyCharacters.name}`
    enemyVictoryDisplay.textContent = `Victories ${enemyVictories}`
    enemyHealthDisplay.textContent = `Health: ${enemyCharacters.hitPoints}`
    enemyAttackDisplay.textContent = `Attack: ${enemyAttackRoll}`
    /* enemyDefenseDisplay.textContent = `Defense: ${enemyCharacters.Defense}` */

}


// Player turn
function playerAction(action) {
    
    // Player action ATTACK
    if (action === "attack") {
        dealDamage(playerCharacter)
        takeDamage(enemyCharacters, playerAttackRoll)
        
        // Player Attack HTML element
        const eventMessagePlayerAttack = document.createElement("p");
        eventMessagePlayerAttack.className = "event-message";
        eventLog.appendChild(eventMessagePlayerAttack)
        // Player Attack textcontent
        eventMessagePlayerAttack.textContent = `${playerCharacter.name} deals ${playerAttackRoll} damage to ${enemyCharacters.name}`

        // Enemy Health HTML element
        const eventMessageEnemyHealth = document.createElement("p")
        eventMessageEnemyHealth.className = "event-message"
        eventLog.appendChild(eventMessageEnemyHealth)
        // Enemy Health textcontent
        eventMessageEnemyHealth.textContent = `${enemyCharacters.name} Health: ${enemyCharacters.hitPoints}`
        
        // If statement checks if the enemyCharacter health is equal to or less than health points after the attack
        if (enemyCharacters.hitPoints <= 0) {
            endGame();

        } else {
            roundCounter++
            setTimeout(enemyTurn, 2000)
        
        }


    // Player Action HEAL
    } else if (action === "heal") {
        healHealth(playerCharacter)

        // Player Heal HTML element
        const eventMessagePlayerHeal = document.createElement("p")
        eventMessagePlayerHeal.className = "event-message"
        eventLog.appendChild(eventMessagePlayerHeal)
        // Player Heal textcontent
        eventMessagePlayerHeal.textContent = `${playerCharacter.name} heals, ${playerCharacter.name} health is now ${playerCharacter.hitPoints}`

        setTimeout(enemyTurn, 2000)
    }
}


// Enemy Turn
function enemyTurn() {
    dealDamage(enemyCharacters)
    takeDamage(playerCharacter, enemyAttackRoll)

    // Enemy Attack HTML element
    const eventMessageEnemyAttack = document.createElement("p")
    eventMessageEnemyAttack.className = "event-message"
    eventLog.appendChild(eventMessageEnemyAttack)
    // Enemy Attack textcontent
    eventMessageEnemyAttack.textContent = `${enemyCharacters.name} deals ${enemyAttackRoll} damage to ${playerCharacter.name}`

    // Player Health HTML element
    const eventMessagePlayerHealth = document.createElement("p")
    eventMessagePlayerHealth.className = "event-message"
    eventLog.appendChild(eventMessagePlayerHealth)
    // Player Health textcontent
    eventMessagePlayerHealth.textContent = `${playerCharacter.name} Health: ${playerCharacter.hitPoints}`

    // If statement checks if the playerCharacter health is equal to or less than health points after the attack 
    if (playerCharacter.hitPoints <= 0) {
        endGame();
    } else {
        setTimeout(() => {
            playerTurn = true;
            actionAttackButton.disabled = false;
            actionHealButton.disabled = false;
            resetAttack(playerCharacter)
            resetAttack(enemyCharacters)
            roundCounter++
            updateStats()
        }, 2000);
    }
}

// End Game 
// Current state: Only displays the winner by text
function endGame() {

    //IF statement checks if either of the characters have reached 0 health points and announces a victor if one equals true 
    if (playerCharacter.hitPoints <= 0) {
        roundCounterTitle.textContent = `${enemyCharacters.name} is victorious!`
        
        const eventMessageResultStatus = document.createElement("p")
        eventMessageResultStatus.className = "event-message"
        eventLog.appendChild(eventMessageResultStatus)
        
        eventMessageResultStatus.textContent = `${enemyCharacters.name} is victorious!`
        
        /* victoryCounter(enemyCharacters) */
        enemyVictories++
        updateStats()
        return console.log(`\n ${enemyCharacters.name} is victorious!`)
    
    } else if (enemyCharacters.hitPoints <= 0) {
        roundCounterTitle.textContent = `${playerCharacter.name} is victorious!`
        
        const eventMessageResultStatus = document.createElement("p")
        eventMessageResultStatus.className = "event-message"
        eventLog.appendChild(eventMessageResultStatus)

        eventMessageResultStatus.textContent = `${playerCharacter.name} is victorious!`
        
        /* victoryCounter(playerCharacter) */
        playerVictories++
        updateStats()
        return console.log(`\n ${playerCharacter.name} is victorious!`)
    }
    
}


// Reset Game Stats
function resetGame() {

    // Character Object default values
    playerCharacter = {};
    enemyCharacters = {};
    roundCounter = 1
    playerInitiative = 0
    enemyInitiative = 0
    playerAttackRoll = 0
    enemyAttackRoll = 0
    updateStats()

    // Reset Message
    const eventMessageReset = document.createElement("p")
    eventMessageReset.className = "event-message"
    eventLog.appendChild(eventMessageReset)
    eventMessageReset.textContent = "Character stats have been reset." 
    return console.log(`\n Character stats have been reset. \n`)
}


// Start Game function
function startGame() {

    getGameData()
    rollInitiative()
   
    // Rolls for initiative (Currently not in use)
    /* rollInitiative(playerCharacter)
       rollInitiative(enemyCharacters) */

    // IF statement checks if playerCharacter's initiative result is higher than enemyCharacter's result
    // If true the player begins this game 

    if (playerInitiative > enemyInitiative) {
        playerTurn = true;
        updateStats()
        
        const eventMessageInitiative = document.createElement("p")
        eventMessageInitiative.className = "event-message"
        eventLog.appendChild(eventMessageInitiative) 

        eventMessageInitiative.textContent = `\n ${playerCharacter.name} rolled an initative of ${playerInitiative} and will start first! \n`
        
        return console.log(`\n ${playerCharacter.name} rolled an initative of ${playerInitiative} and will start first! \n`)

    // IF statement checks if playerCharacter's initiative result is less than enemyCharacter's result
    // If true enemyCharacter begins this game
    } else if (playerInitiative < enemyInitiative) {
        playerTurn = false;
        updateStats()
        
        const eventMessageInitiative = document.createElement("p")
        eventMessageInitiative.className = "event-message"
        eventLog.appendChild(eventMessageInitiative) 

        eventMessageInitiative.textContent = `\n ${enemyCharacters.name} rolled an initiative of ${enemyInitiative} and will start first! \n`
        
        //Necessary to let the function resolve the initiative rolls before enemyTurn is called. (Discovered the necessity after debugging.)
        setTimeout(enemyTurn, 1000)

        return console.log(`\n ${enemyCharacters.name} rolled an initiative of ${enemyInitiative} and will start first! \n`)

    }
}