const fs = require('fs/promises');
const { resolve } = require('path');
const readline = require('readline')

// function to roll the dices
async function rollDice() {
    return Math.ceil(Math.random() * 6);
}

// function to get the block for the round
async function getRandomBlock() {
    let random = Math.random();
    let result;

    switch (true) {
        case random < 0.25:
            result = "MEELEE";
            break;
        
        case random >= 0.25 && random < 0.5:
            result = "RANGED";
            break;
        
        case random >= 0.5 && random < 0.75:
            result = "MAGIC";
            break
        
        case random >= 0.75:
            result = "CONFRONTATION";
            break;
    }

    return result;
}

// Function to declare the round winner
async function roundWinner(result1, result2, char1, char2) {
    if (result1 > result2){
        console.log(`${char1.NAME} won this round! +1 points.`)
        char1.SCORE++;
    }
    else if (result1 < result2){
        console.log(`${char2.NAME} won this round! +1 points.`)
        char2.SCORE++;
    }
    else if (result1 == result2){
        console.log(`It was a draw, nobody scores.`)
        char1.SCORE++;
    }
}

// Function to show the dices result
async function rollResult(charName, block, diceResult, attribute) {
    console.log(`${charName} 🎲 rolled ${diceResult} + ${attribute} on ${block}, the result is = ${diceResult + attribute}`);
    return diceResult + attribute;
}

// function for the race
async function fightEngine(char1, char2) {
    for (let round = 1; round <= 5; round++){
        console.log(`⚔️ Round ${round} ⚔️`);

        let block = await getRandomBlock();
        console.log(`🏅 Challenge: ${block} 🏅`)

        let diceResult1 = await rollDice();
        let diceResult2 = await rollDice();

        let testSkill1 = 0;
        let testSkill2 = 0;

        if (block === "MEELEE"){
            testSkill1 = diceResult1 + char1.STRENGHT;
            testSkill2 = diceResult2 + char2.STRENGHT;

            let result1 = await rollResult(char1.NAME, "MEELEE", diceResult1, char1.STRENGHT)
            let result2 = await rollResult(char2.NAME, "MEELEE", diceResult2, char2.STRENGHT)

            await roundWinner(result1, result2, char1, char2)
        }
        else if (block === "RANGED"){
            testSkill1 = diceResult1 + char1.AGILITY;
            testSkill2 = diceResult2 + char2.AGILITY;

            let result1 = await rollResult(char1.NAME, "RANGED", diceResult1, char1.AGILITY)
            let result2 = await rollResult(char2.NAME, "RANGED", diceResult2, char2.AGILITY)

            await roundWinner(result1, result2, char1, char2)
        }
        else if (block === "MAGIC"){
            testSkill1 = diceResult1 + char1.MAGIC;
            testSkill2 = diceResult2 + char2.MAGIC;

            let result1 = await rollResult(char1.NAME, "MAGIC", diceResult1, char1.MAGIC)
            let result2 = await rollResult(char2.NAME, "MAGIC", diceResult2, char2.MAGIC)

            await roundWinner(result1, result2, char1, char2)
        }
        else if (block === "CONFRONTATION"){
            testSkill1 = diceResult1 + char1.POWER;
            testSkill2 = diceResult2 + char2.POWER;

            console.log(`${char1.NAME} confronted ${char2.NAME}`)

            await rollResult(char1.NAME, "CONFRONTATION", diceResult1, char1.POWER)
            await rollResult(char2.NAME, "CONFRONTATION", diceResult2, char2.POWER)

            if (testSkill1 > testSkill2 && char2.SCORE > 0){
                console.log(`${char1.NAME} won this round. ${char2.NAME} loses 1 point.`);
                char2.SCORE--;
            }
            else if (testSkill1 < testSkill2 && char1.SCORE > 0){
                console.log(`${char2.NAME} won this round. ${char1.NAME} loses 1 point.`); 
                char1.SCORE--;
            }
            else if (testSkill1 === testSkill2){
                console.log("It's a draw, nobody loses a point") 
            }
            else if (testSkill1 > testSkill2 && char2.SCORE === 0){
                console.log(`${char1.NAME} won this round but ${char2.NAME} has no points to lose.`);
            }
            else if (testSkill1 < testSkill2 && char1.SCORE === 0){
                console.log(`${char2.NAME} won this round but ${char1.NAME} has no points to lose.`);
            }

        }

        console.log("--------------------------------------");
    }

    await declareWinner(char1, char2);
}

// Function to declare the winner player
async function declareWinner(char1, char2) {
    console.log(`🏆 Final result:\n${char1.NAME} scored ${char1.SCORE}\n${char2.NAME} scored ${char2.SCORE}`)

    if (char1.SCORE > char2.SCORE){
        console.log(`⚔️ ${char1.NAME} won the fight! ⚔️`)
    }
    else if (char1.SCORE < char2.SCORE){
        console.log(`⚔️ ${char2.NAME} won the fight! ⚔️`) 
    }
    else {
        console.log(`⚔️ The fight was a draw ⚔️`)
    }
}

// Function to choose wich class you wanna play
async function charChoose() {
    
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    
    return new Promise((resolve) => {
        rl.question("Choose a class:\n1. Rogue 🗡️\n2. Warrior ⚔️\n3. Mage 🧙\nType the number of the class: ", (answer) => {
            rl.close();
            resolve(answer);
        })
    });
}

// Auto invoke main function
(async function main() {
    const arquivo = await fs.readFile('assets/db.json')
    const db = JSON.parse(arquivo)

    const p1 = await charChoose()
    const p2 = await charChoose()

    const player1 = db.characters[parseInt(p1)-1];
    const player2 = db.characters[parseInt(p2)-1];

    console.log(`⚔️ Fight between ${player1.NAME} and ${player2.NAME} starting! ⚔️`);
    console.log("--------------------------------------");

    await fightEngine(player1, player2);
})()

