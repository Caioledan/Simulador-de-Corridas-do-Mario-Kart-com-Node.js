const player1 = {
    NAME: "Mario",
    SPEED: 3,
    MANEUVERABILITY: 4,
    POWER: 3,
    STYLE: 4,
    SCORE: 0,
};

const player2 = {
    NAME: "Bowser",
    SPEED: 5,
    MANEUVERABILITY: 2,
    POWER: 5,
    STYLE: 1,
    SCORE: 0,
};

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
            result = "STRAIGHT";
            break;
        
        case random >= 0.25 && random < 0.5:
            result = "CURVE";
            break;
        
        case random >= 0.5 && random < 0.75:
            result = "CONFRONTATION";
            break
        
        case random >= 0.75:
            result = "RAMP";
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
async function raceEngine(char1, char2) {
    for (let round = 1; round <= 5; round++){
        console.log(`🏁 Round ${round}`);

        let block = await getRandomBlock();
        console.log(`Block: ${block}`)

        let diceResult1 = await rollDice();
        let diceResult2 = await rollDice();

        let testSkill1 = 0;
        let testSkill2 = 0;

        if (block === "STRAIGHT"){
            testSkill1 = diceResult1 + char1.SPEED;
            testSkill2 = diceResult2 + char2.SPEED;

            let result1 = await rollResult(char1.NAME, "STRAIGHT", diceResult1, char1.SPEED)
            let result2 = await rollResult(char2.NAME, "STRAIGHT", diceResult2, char2.SPEED)

            await roundWinner(result1, result2, char1, char2)
        }
        else if (block === "CURVE"){
            testSkill1 = diceResult1 + char1.MANEUVERABILITY;
            testSkill2 = diceResult2 + char2.MANEUVERABILITY;

            let result1 = await rollResult(char1.NAME, "CURVE", diceResult1, char1.MANEUVERABILITY)
            let result2 = await rollResult(char2.NAME, "CURVE", diceResult2, char2.MANEUVERABILITY)

            await roundWinner(result1, result2, char1, char2)
        }
        else if (block === "RAMP"){
            testSkill1 = diceResult1 + char1.STYLE;
            testSkill2 = diceResult2 + char2.STYLE;

            let result1 = await rollResult(char1.NAME, "RAMP", diceResult1, char1.STYLE)
            let result2 = await rollResult(char2.NAME, "RAMP", diceResult2, char2.STYLE)

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
    console.log(`Final result:\n${char1.NAME} scored ${char1.SCORE}\n${char2.NAME} scored ${char2.SCORE}`)

    if (char1.SCORE > char2.SCORE){
        console.log(`${char1.NAME} won the race!`)
    }
    else if (char1.SCORE < char2.SCORE){
        console.log(`${char2.NAME} won the race!`) 
    }
    else {
        console.log(`The race was a draw`)
    }
}


// Auto invoke main function
(async function main() {
    console.log(`🏁 Race between ${player1.NAME} and ${player2.NAME} starting!`);
    console.log("--------------------------------------");

    await raceEngine(player1, player2);
})()

