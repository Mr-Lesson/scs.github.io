document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // ELEMENTS
    // =========================
    const startBtn = document.getElementById("start-btn");
    const titleScreen = document.getElementById("title-screen");
    const gameScreen = document.getElementById("game-screen");
    const textBox = document.getElementById("text-box");
    const choicesDiv = document.getElementById("choices");
    const canvas = document.getElementById("scene-canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 800;
    canvas.height = 400;

    let typing=false, skipTyping=false, waitingForEnter=false, nextLineCallback=null;

    // =========================
    // CHARACTER SIZE
    // =========================
    const CHAR_SIZE = 16;

    // =========================
    // CLEAR SCENE
    // =========================
    function clearScene() { 
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
    }

    // =========================
    // SIMPLE CLEAN BACKGROUND
    // =========================
    function drawPixelBackground() {
        clearScene();

        // Sky
        ctx.fillStyle = "#87ceeb";
        ctx.fillRect(0, 0, canvas.width, canvas.height / 2);

        // Ground
        ctx.fillStyle = "#32CD32";
        ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

        // Sun
        ctx.fillStyle = "#FFD700";
        ctx.fillRect(700, 50, 20, 20);

        // Hills (triangles)
        ctx.fillStyle = "#228B22";
        ctx.beginPath();
        ctx.moveTo(100, 200);
        ctx.lineTo(250, 200);
        ctx.lineTo(175, 100);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(400, 200);
        ctx.lineTo(550, 200);
        ctx.lineTo(475, 120);
        ctx.closePath();
        ctx.fill();

        // River
        ctx.fillStyle = "#1E90FF";
        ctx.fillRect(200, 300, 150, 20);

        // Path
        ctx.fillStyle = "#D2B48C";
        ctx.fillRect(50, 350, 200, 20);

        // Trees
        drawPixelTree(100, 300, 20);
        drawPixelTree(600, 280, 20);
        drawPixelTree(700, 320, 20);
    }

    // =========================
    // CLEAN TREE
    // =========================
    function drawPixelTree(x, y, size = 20) {
        ctx.fillStyle = "#228B22";
        ctx.beginPath();
        ctx.moveTo(x, y - size);
        ctx.lineTo(x - size, y + size / 2);
        ctx.lineTo(x + size, y + size / 2);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#8B4513";
        ctx.fillRect(x - size / 6, y + size / 2, size / 3, size / 2);
    }

    // =========================
    // CLEAN HOUSE
    // =========================
    function drawPixelHouse(x, y, w = 40, h = 40) {
        ctx.fillStyle = "#8B4513";
        ctx.fillRect(x, y, w, h);

        ctx.fillStyle = "#A52A2A";
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + w, y);
        ctx.lineTo(x + w / 2, y - h / 2);
        ctx.closePath();
        ctx.fill();
    }

    // =========================
    // CLEAN TENT
    // =========================
    function drawPixelTent(x, y, w = 30, h = 30) {
        ctx.fillStyle = "#FF6347";
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - w / 2, y + h);
        ctx.lineTo(x + w / 2, y + h);
        ctx.closePath();
        ctx.fill();
    }

    // =========================
    // CLEAN CHARACTER
    // =========================
    function drawPixelCharacter(x, y, color = "blue", hat = false, tool = false, bag = false) {
        const size = CHAR_SIZE;

        // Head
        ctx.fillStyle = "#FDDCC5";
        ctx.fillRect(x, y, size, size);

        // Body
        ctx.fillStyle = color;
        ctx.fillRect(x, y + size, size, size * 2);

        // Arms
        ctx.fillRect(x - size / 2, y + size, size / 2, size * 2);
        ctx.fillRect(x + size, y + size, size / 2, size * 2);

        // Legs
        ctx.fillRect(x, y + size * 3, size / 2, size * 2);
        ctx.fillRect(x + size / 2, y + size * 3, size / 2, size * 2);

        // Hat
        if (hat) {
            ctx.fillStyle = "#8B4513";
            ctx.fillRect(x - size / 4, y - size / 4, size * 1.5, size / 4);
        }

        // Tool (pickaxe)
        if (tool) {
            ctx.fillStyle = "#778899";
            ctx.fillRect(x + size, y + size, 4, size * 1.5);
        }

        // Bag
        if (bag) {
            ctx.fillStyle = "#8B6F47";
            ctx.fillRect(x - size / 2, y + size, size / 2, size);
        }
    }

    // =========================
    // SCENE VISUALS
    // =========================
    const scene1Visual = () => { 
        drawPixelBackground();
        drawPixelCharacter(150, 270,"#4AC", true, true, true);
        drawPixelCharacter(270, 270,"#6F4", true, false, true);
        drawPixelHouse(500, 260);
        drawPixelTree(650, 270, 20);
        drawPixelTree(100, 260, 20);
    };

    const scene2Visual = () => {
        drawPixelBackground();
        drawPixelCharacter(130, 270,"#4AC", true, true, true);
        drawPixelCharacter(300, 270,"#B85", true, false, true);
        drawPixelHouse(450, 260);
        drawPixelTent(600, 260);
        drawPixelTree(350, 270, 20);
        drawPixelTree(700, 260, 20);
    };

    const npc3Visual = () => {
        drawPixelBackground();
        drawPixelCharacter(160, 270,"#4AC", true, true, true);
        drawPixelCharacter(280, 270,"#E96", true, false, true);
        drawPixelTent(600, 260);
        drawPixelTree(400, 270, 20);
        drawPixelTree(700, 270, 20);
    };

    const scene3Visual = () => {
        drawPixelBackground();
        drawPixelCharacter(150, 270,"#4AC", true, true, true);
        drawPixelHouse(450, 260);
        drawPixelTree(550, 270, 20);
        drawPixelTent(600, 260);
        drawPixelTree(700, 270, 20);
    };

    const scene4NormalVisual = () => {
        drawPixelBackground();
        drawPixelCharacter(140, 270,"#4AC", true, true, true);
        drawPixelCharacter(260, 270,"#B85", true, false, true);
        drawPixelHouse(420, 260);
        drawPixelTree(580, 270, 20);
        drawPixelTent(650, 260);
        drawPixelTree(700, 270, 20);
    };

    const saloonVisual = scene4NormalVisual;

    const scene4NPC1FollowupVisual = () => {
        drawPixelBackground();
        drawPixelCharacter(110, 270,"#4AC", true, true, true);
        drawPixelCharacter(230, 270,"#C84", true, false, true);
        drawPixelHouse(400, 260);
        drawPixelTree(550, 270, 20);
        drawPixelTent(600, 260);
        drawPixelTree(700, 270, 20);
    };

    const npc4Visual = scene4NPC1FollowupVisual;

    const battleVisual = () => {
        drawPixelBackground();
        drawPixelCharacter(120, 270,"#4AC", true, true, true);
        drawPixelCharacter(240, 270,"#6F4", true, false, true);
        drawPixelHouse(450, 260);
        drawPixelTree(600, 270, 20);
        drawPixelTent(650, 260);
        drawPixelTree(700, 270, 20);
    };

    const finalVisual = () => {
        drawPixelBackground();
        drawPixelCharacter(150, 270,"#4AC", true, true, true);
        drawPixelTree(500, 270, 20);
        drawPixelTent(600, 260);
        drawPixelTree(700, 270, 20);
    };

    // =========================
    // START BUTTON
    // =========================
    startBtn.addEventListener("click", () => {
        titleScreen.style.display="none";
        gameScreen.style.display="block";
        showSkipHint();
        scene1();
    });

    // =========================
    // TYPEWRITER & CHOICES
    // =========================
    function typeText(text, onComplete){
        typing=true; skipTyping=false; waitingForEnter=false;
        textBox.innerHTML="";
        hideChoices();
        showSkipHint();
        let i=0, speed=28;
        function step(){
            if(skipTyping){ textBox.innerHTML=text; finish(); return; }
            if(i<text.length){ textBox.innerHTML+=text.charAt(i); i++; setTimeout(step,speed); }
            else finish();
        }
        function finish(){ typing=false; waitingForEnter=true; nextLineCallback=onComplete; }
        step();
    }

    function showChoices(list){
        choicesDiv.innerHTML=""; hideSkipHint(); waitingForEnter=false;
        list.forEach(c=>{
            const btn=document.createElement("button");
            btn.textContent=c.text;
            btn.onclick=()=>typeText(c.response,()=>c.action());
            choicesDiv.appendChild(btn);
        });
    }
    function hideChoices(){ choicesDiv.innerHTML=""; }

    const skipHint = document.createElement("p");
    skipHint.style.color="#d4aa70";
    skipHint.style.fontSize="13px";
    skipHint.style.marginTop="8px";
    skipHint.innerText="Press ENTER to continue";
    skipHint.style.display="none";
    gameScreen.appendChild(skipHint);
    function showSkipHint(){ skipHint.style.display="block"; }
    function hideSkipHint(){ skipHint.style.display="none"; }

    document.addEventListener("keydown", e=>{
        if(e.key==="Enter"){
            if(typing) skipTyping=true;
            else if(waitingForEnter && nextLineCallback){
                let fn=nextLineCallback;
                nextLineCallback=null;
                waitingForEnter=false;
                fn();
            }
        }
    });

    function endGame(message) {
        typeText(message, () => {
            setTimeout(() => {
                textBox.innerHTML += "<br><br><strong>Thank you for playing!</strong>";
            }, 1000);
        });
    }

    // =========================
    // SCENES
    // =========================
function scene1() {
    scene1Visual();
    const lines = [
        "The year is 1851. Mexico has just lost the war, and the United States has taken California. Settlers from all over now flock west, chasing the smell of gold. You walk beside your wagon headed for the Sierra Nevada, hoping for a chance to stake a claim to find some gold.",
        "As you walk, you breathe a smile of relief: after months of grueling travel, you were almost at California.",
        "The people you’ve met traveling the California Trail all said the same thing: This is the place of opportunity. This is where you will have the chance to make the money you need to make you and your family rich.",
        "You give yourself a small smile. This may be the place where your dreams can come true. A place of equal opportunity: where every man could have an equal shot at getting rich. But you must remain vigilant: despite all that those have said to you, you have no idea what you’re getting into.",
        "As you walk, you encounter NPC1, a freedman you’ve encountered many times on your way to California, setting up camp. As it’s getting late, you decide to do the same.",
        "After you finish, you begin chatting with NPC1 about the land ahead.",
        'NPC1: "Back East, I worked fields I would never own. I was just property. Here, they say the land is free. You think it’ll be free for someone like me?"'
    ];
    let i = 0;
    function nextLine() {
        if(i < lines.length) {
            nextLineCallback = nextLine;
            typeText(lines[i], nextLine);
            i++;
        } else {
            showChoices([
                { text: "Of course it's free", response: "NPC1 nods quietly, a small hopeful smile on his face.", action: scene2 },
                { text: "Not sure", response: "NPC1 shrugs, uncertain, but maintains a quiet optimism.", action: scene2 },
                { text: "I don’t care about what others think", response: "NPC1 looks at you, takes a deep breath, but continues with a quiet optimism.", action: scene2 }
            ]);
        }
    }
    nextLine();
}
function scene2() {
    scene2Visual();
    const lines = [
        "After some time, you finally reach a river valley crowded with tents and rough shacks. As you look around, you see the Gold Rush in full swing: Americans like you from the East, European fortune seekers, Chilean and Sonoran miners, Kanakas from the Pacific, and growing numbers of Chinese laborers work the banks.",
        "The hills bear scars where hydraulic hoses and picks have torn the soil. You see the remnants of what appear to be native villages along the river burnt to ashes.",
        "A broad-shouldered man with a faded militia jacket walks up to you.",
        'NPC2: "The name’s NPC2. When I rode in ‘49, this valley was full of camps. Governor said they wanted to make it ‘safe’ for you settlers. We took care of that. State paid us per head."'
    ];
    let i = 0;
    function nextLine() {
        if(i < lines.length) {
            nextLineCallback = nextLine;
            typeText(lines[i], nextLine);
            i++;
        } else {
            showChoices([
                { text: "Approve", response: "NPC2 will remember this.", action: npc3Scene },
                { text: "Ask about the villages", response: "NPC2 brushes you off.", action: npc3Scene },
                { text: "Ask for advice", response: "NPC2 advises you to avoid areas with other white men staking a claim.", action: npc3Scene }
            ]);
        }
    }
    nextLine();
}

function npc3Scene() {
    npc3Visual();
    const lines = [
        "As you examine the banks, a small group approaches. At their head walks a Maidu woman, carrying woven baskets. You see those behind her carrying items foraged from around the river.",
        'NPC3: "Hello, I am NPC3. The men who came before you cut down our oaks, drove off our game, and turned our water into mud. Our dead still reside here. Whatever we can find, we bring here to sell. Please, will you buy something from us?"'
    ];
    let i = 0;
    function nextLine() {
        if(i < lines.length) {
            nextLineCallback = nextLine;
            typeText(lines[i], nextLine);
            i++;
        } else {
            showChoices([
                { text: "Buy and listen", response: "NPC3 thanks you and tells you more about their story.", action: scene3 },
                { text: "Dismiss her", response: "NPC3 leaves quietly.", action: scene3 },
                { text: "Reassure her but don’t buy", response: "NPC3 didn’t seem to appreciate that.", action: scene3 }
            ]);
        }
    }
    nextLine();
}
function scene3() {
    scene3Visual();
    const lines = [
        "Having finally found a place to claim, you begin trying to find gold, but fail. As night falls, you head to the small settlement put together for those searching for gold. You eat and fall asleep, thinking about NPC3.",
        "As you wake up, you see some new notices being set up outside the courthouse.",
        "You walk towards them, reading the following:",
        '“Act for the Government and Protection of Indians”: By order of the State of California, settlers are authorized to employ indigenous persons under binding contracts and to assume custody of Indian minors as necessary for their care and protection. All such arrangements must be registered within the county.',
        "Section 14 of the Criminal Proceedings Act: No Indian or Black person shall be permitted to give evidence in any case involving a white citizen.",
        "Foreign Miner’s Tax: Effective immediately, all foreign miners are required to pay a monthly fee of $20 dollars to mine. Persons originating from China, Mexico, Chile, or other foreign countries must present proof of payment on request or vacate their claims.",
        "Inside, you see a hearing underway. A Californio man waves land-grants written in Spanish while a white man argues that under American law, that grant is void.",
        'Judge: "Under the treaty of Guadalupe Hidalgo, valid Mexican grants may be recognized only when proven under the procedure of the United States. This court follows American law, and that law requires proper documentation in English."',
        'Californio (Through interpreter): "This land fed our family before either flag flew above it. We hold a grant signed by the Mexican Governor. Our cattle grazed here long before the Americans arrived. Must our home disappear because our papers are different?"',
        'Judge: "Your claim lacks the survey and documentation required by the Land Act of 1851. Your grant is not sufficient for recognition in this court. The present settler has demonstrated occupation and improvement under U.S. standards, thus the claim is awarded to him."',
        "You step back into the crowd and see NPC1, alongside the family of the Mexican and some white settlers, watching the trial. NPC1 looks to you, almost expecting you to say something."
    ];
    let i = 0;
    function nextLine() {
        if(i < lines.length) {
            nextLineCallback = nextLine;
            typeText(lines[i], nextLine);
            i++;
        } else {
            showChoices([
                { text: "Praise the ruling", response: "NPC1 scoffs and turns away. NPC2 steps out of the crowd: 'That’s the kind of clear head we need out here. Old grants, tribal talk, they just tie up good ground. There’s a stretch upriver we want in steady hands. Good water, decent soil. I think it’s got your name on it.'", action: scene4Normal },
                { text: "Quietly approach the family", response: "Family is obviously distraught. NPC1 gives you a more positive look.", action: scene4NPC1Followup },
                { text: "Turn away", response: "NPC1 gives you a strange look.", action: scene4NPC1Followup },
                { text: "Object to the trial", response: "Judge flatly denies you. Settlers watching heckle you. NPC2 comes up to you afterwards, extremely unhappy. Threatens you.", action: scene4NPC1Followup }
            ]);
        }
    }
    nextLine();
}
function scene4Normal() {
    saloonVisual();
    const lines = [
        "One evening, miners and townspeople gather outside a saloon. NPC2 sits on a crate, reading a notice.",
        'NPC2: "County Supervisors have authorized funds for a new expedition. A band in the hills has been accused of stock theft and threatening settlers. The state will reimburse expenses and those who bring in ‘hostiles’."',
        'NPC2: "Player, your standing on land men like us cleared. Are you riding with us?"'
    ];
    let i = 0;
    function nextLine() {
        if(i < lines.length) {
            nextLineCallback = nextLine;
            typeText(lines[i], nextLine);
            i++;
        } else {
            showChoices([
                { text: "Join fully", response: "You agree to join the expedition fully.", action: sceneBattle },
                { text: "Refuse", response: "You refuse. Nothing changes today.", action: () => endGame("You refused the expedition. Nothing changes today.") },
                { text: "Join but won’t shoot unless needed", response: "You join but promise to avoid killing unless necessary.", action: sceneBattle }
            ]);
        }
    }
    nextLine();
}

function scene4NPC1Followup() {
    npc4Visual();
    const lines = [
        "NPC1 comes up to you later that day, covered in scratches and bruises.",
        'NPC1: "A white miner jumped my claim. When I fought back, he and his friends beat me. If this goes to court, notice says my word can’t stand against his."',
        "What do you say?"
    ];
    let i = 0;
    function nextLine() {
        if(i < lines.length) {
            nextLineCallback = nextLine;
            typeText(lines[i], nextLine);
            i++;
        } else {
            showChoices([
                { text: "Blame him", response: "Distance grows between you and NPC1. NPC1 leaves.", action: scene4Normal },
                { text: "Promise to testify for him", response: "NPC1 thanks you sincerely.", action: scene4Normal },
                { text: "Tell him he should move on", response: "NPC1 gets upset and leaves.", action: scene4Normal }
            ]);
        }
    }
    nextLine();
}
function sceneBattle() {
    battleVisual();
    const lines = [
        "At dawn, you ride into the hills with NPC1 and several others. You find the camp filled with small shelters.",
        "Gunfire erupts. People scatter. What will you do?"
    ];
    let i = 0;
    function nextLine() {
        if(i < lines.length) {
            nextLineCallback = nextLine;
            typeText(lines[i], nextLine);
            i++;
        } else {
            showChoices([
                { text: "Fire at a fleeing figure", response: "The camp is destroyed and burnt down. NPC1 praises your effort. You win a sizeable bounty.", action: finalScene },
                { text: "Fire and purposefully miss", response: "Same destruction occurs. NPC1 is upset and you don’t receive any reward.", action: finalScene },
                { text: "Shield someone physically", response: "A few are saved. NPC1 is extremely upset and promises punishment.", action: finalScene }
            ]);
        }
    }
    nextLine();
}
function finalScene() {
    finalVisual();
    const lines = [
        "Fast forward to 1855, the gold is all but gone.",
        "You get an opportunity to talk to NPC1 and reflect on the choices you made.",
        'NPC1: "Based on your actions, here’s what I think about how we all navigated these times..."'
    ];
    let i = 0;
    function nextLine() {
        if(i < lines.length) {
            nextLineCallback = nextLine;
            typeText(lines[i], nextLine);
            i++;
        } else {
            endGame("=== THE END ===");
        }
    }
    nextLine();
}
});
