document.addEventListener("DOMContentLoaded", () => {

    const startBtn = document.getElementById("start-btn");
    const choicesDiv = document.getElementById("choices");
    const textBox = document.getElementById("text-box");

    // Start the game when Begin button is clicked
    startBtn.onclick = startGame;

    function startGame() {
        document.getElementById("title-screen").style.display = "none";
        document.getElementById("game-screen").style.display = "block";
        scene1();
    }

    // TYPEWRITER EFFECT
    function typeText(text, callback) {
    textBox.innerHTML = "";
    choicesDiv.innerHTML = ""; // hide choices while typing

    let i = 0;
    const speed = 12; // faster
    let typing = true;

    function type() {
        if (i < text.length) {
            textBox.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            typing = false;
            if (callback) callback();
        }
    }

    type();

    // Listen for Enter to skip
    function skipListener(e) {
        if (e.key === "Enter" && typing) {
            typing = false;
            textBox.innerHTML = text; // show full text
            if (callback) callback();
        }
    }

    document.addEventListener("keydown", skipListener, { once: true });
}

    // SHOW CHOICES
    function showChoices(choices) {
        choicesDiv.innerHTML = "";
        choices.forEach(choice => {
            const btn = document.createElement("button");
            btn.textContent = choice.text;
            btn.className = "choice-btn";
            btn.onclick = () => choice.action();
            choicesDiv.appendChild(btn);
        });
    }

    // -------------------- SCENES --------------------

    function scene1() {
        typeText(
`The year is 1851. Mexico has just lost the war, and the United States has taken California.
You walk beside your wagon headed for the Sierra Nevada, chasing the smell of gold.

You encounter NPC1, a freedman setting up camp.
NPC1: "Back East, I worked fields I would never own. I was just property.
Here, they say the land is free. You think it'll be free for someone like me?"`,
        () => {
            showChoices([
                { text: "Of course it's free", action: scene2 },
                { text: "Not sure", action: scene2 },
                { text: "I don’t care about what others think", action: scene2 }
            ]);
        });
    }

    function scene2() {
        typeText(
`You reach a river valley crowded with tents and rough shacks.
Gold Rush is in full swing.

NPC2, a militia man, approaches.
NPC2: "The name’s NPC2. State paid us per head to keep settlers safe."`,
        () => {
            showChoices([
                { text: "Approve", action: sceneNPC3 },
                { text: "Ask about the villages", action: sceneNPC3 },
                { text: "Ask for advice", action: sceneNPC3 }
            ]);
        });
    }

    function sceneNPC3() {
        typeText(
`A Maidu woman approaches carrying baskets.
NPC3: "The men who came before you cut down our oaks, drove off our game,
and turned the water into mud. Will you buy something from us?"`,
        () => {
            showChoices([
                { text: "Buy and listen", action: scene3 },
                { text: "Dismiss her", action: scene3 },
                { text: "Reassure but don't buy", action: scene3 }
            ]);
        });
    }

    function scene3() {
        typeText(
`You find a place to claim, but your gold search fails. Night falls.
Next morning, you see new notices outside the courthouse about:
- Protection of Indians
- Foreign Miner’s Tax
- Legal restrictions for evidence

Inside, a hearing is underway. The judge rules in favor of the settler.
NPC1 watches, expecting your response.`,
        () => {
            showChoices([
                { text: "Praise the ruling", action: scene4 },
                { text: "Object", action: scene4 }
            ]);
        });
    }

    function scene4() {
        typeText(
`Evening outside the saloon. NPC2 reads a notice about an expedition.
NPC2: "Player. You're standing on land men like us cleared. Are you riding with us?"`,
        () => {
            showChoices([
                { text: "Join fully", action: sceneBattle },
                { text: "Refuse", action: () => endGame("You refused the expedition. Nothing changes today.") },
                { text: "Join but won’t shoot unless needed", action: sceneBattle }
            ]);
        });
    }

    function sceneBattle() {
        typeText(
`Dawn. You ride into the hills. Camp found.
Gunfire erupts. People scatter. What do you do?`,
        () => {
            showChoices([
                { text: "Fire at a fleeing figure", action: () => endGame("The camp burns. You return with bounty — and blood on you.") },
                { text: "Fire over their heads", action: () => endGame("You fire but spare lives. Many still die. NPC1 is upset.") },
                { text: "Shield someone physically", action: () => endGame("You save a few. Most perish. NPC1 vows punishment.") }
            ]);
        });
    }

    function endGame(message) {
        typeText(`${message}\n\n=== END OF GAME ===`);
        choicesDiv.innerHTML = "";
    }

});
