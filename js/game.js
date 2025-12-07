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

    let typing = false, skipTyping = false, waitingForEnter = false, nextLineCallback = null;

    // =========================
    // ANIMATION VARIABLES
    // =========================
    let riverOffset = 0;
    let bobbing = 0, bobDirection = 1;
    let treeSwing = 0, treeDirection = 1;
    let animationFrameId = null;
    let currentSceneVisual = null;

    // =========================
    // CLEAR SCENE
    // =========================
    function clearScene() { ctx.clearRect(0,0,canvas.width,canvas.height); }

    // =========================
    // BACKGROUND DRAWING
    // =========================
    function drawBackground() {
        // Sky gradient
        let sky = ctx.createLinearGradient(0,0,0,canvas.height);
        sky.addColorStop(0,"#87ceeb"); 
        sky.addColorStop(1,"#b0e0e6"); 
        ctx.fillStyle = sky;
        ctx.fillRect(0,0,canvas.width,canvas.height);

        // Sun
        ctx.beginPath();
        ctx.arc(700,80,50,0,Math.PI*2);
        ctx.fillStyle="#FFD700";
        ctx.fill();

        // Distant hills
        ctx.fillStyle="#556B2F";
        ctx.beginPath();
        ctx.moveTo(0,300);
        ctx.quadraticCurveTo(200,250,400,300);
        ctx.quadraticCurveTo(600,350,800,300);
        ctx.lineTo(800,400); ctx.lineTo(0,400); ctx.fill();

        // Middle hills
        ctx.fillStyle="#228B22";
        ctx.beginPath();
        ctx.moveTo(0,320);
        ctx.quadraticCurveTo(200,270,400,320);
        ctx.quadraticCurveTo(600,370,800,320);
        ctx.lineTo(800,400); ctx.lineTo(0,400); ctx.fill();

        // Foreground grass
        ctx.fillStyle="#32CD32";
        ctx.fillRect(0,350,800,50);

        // River (animated)
        ctx.fillStyle="#1E90FF";
        ctx.beginPath();
        ctx.moveTo(100+Math.sin(riverOffset/20)*10,400);
        ctx.quadraticCurveTo(200,330+Math.sin(riverOffset/15)*10,350,400);
        ctx.quadraticCurveTo(500,470+Math.sin(riverOffset/10)*10,700,400);
        ctx.lineTo(700,400); ctx.lineTo(100,400); ctx.fill();
    }

    // =========================
    // STICK FIGURE
    // =========================
    function drawStick(x,y,color="white",hat=false,tool=false,bag=false) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        // Head
        ctx.beginPath(); ctx.arc(x, y, 12,0,Math.PI*2); ctx.stroke();
        // Hat
        if(hat){
            ctx.fillStyle="#774422";
            ctx.beginPath();
            ctx.moveTo(x-14,y-12);
            ctx.lineTo(x+14,y-12);
            ctx.lineTo(x,y-25);
            ctx.fill();
        }
        // Body
        ctx.beginPath(); ctx.moveTo(x,y+12); ctx.lineTo(x,y+50); ctx.stroke();
        // Arms
        ctx.beginPath(); ctx.moveTo(x-16,y+25); ctx.lineTo(x+16,y+25); ctx.stroke();
        if(tool){ ctx.beginPath(); ctx.moveTo(x+16,y+25); ctx.lineTo(x+24,y+15); ctx.stroke(); }
        if(bag){ ctx.fillStyle="#AA7744"; ctx.fillRect(x-8,y+30,16,18); }
        // Legs
        ctx.beginPath(); ctx.moveTo(x,y+50); ctx.lineTo(x-14,y+70); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x,y+50); ctx.lineTo(x+14,y+70); ctx.stroke();
    }

    // =========================
    // BUILDINGS & OBJECTS
    // =========================
    function drawHouse(x,y,w,h){
        ctx.fillStyle="#8B4513"; ctx.fillRect(x,y,w,h);
        ctx.fillStyle="#A52A2A";
        ctx.beginPath();
        ctx.moveTo(x,y); ctx.lineTo(x+w/2,y-h/2); ctx.lineTo(x+w,y); ctx.fill();
    }

    function drawTent(x,y){
        ctx.fillStyle="#FF6347";
        ctx.beginPath();
        ctx.moveTo(x,y); ctx.lineTo(x-25,y+60); ctx.lineTo(x+25,y+60);
        ctx.closePath();
        ctx.fill();
    }

    function drawTree(x,y){
        ctx.fillStyle="#228B22";
        ctx.beginPath();
        ctx.moveTo(x+treeSwing, y); ctx.lineTo(x-20+treeSwing, y+40); ctx.lineTo(x+20+treeSwing, y+40);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle="#8B4513"; ctx.fillRect(x-4, y+40, 8, 20);
    }

    // =========================
    // SCENE VISUALS
    // =========================
    const scene1Visual = () => { 
        drawStick(100,260,"#4AC",true,true,true);
        drawStick(200,260,"#6F4",true,false,true);
        drawHouse(400,280,60,60); 
        drawTree(500,260); 
    };
    const scene2Visual = () => {
        drawStick(90,260,"#4AC",true,true,true);
        drawStick(180,260,"#B85",true,false,true);
        drawHouse(350,280,70,60);
        drawTent(550,300);
        drawTree(250,270);
    };
    const npc3Visual = () => {
        drawStick(120,260,"#4AC",true,true,true);
        drawStick(200,260,"#E96",true,false,true);
        drawTree(400,270);
        drawTent(600,300);
    };
    const scene3Visual = () => {
        drawStick(150,260,"#4AC",true,true,true);
        drawHouse(400,280,50,50);
        drawTree(550,260);
        drawTent(600,300);
    };
    const saloonVisual = () => {
        drawStick(130,260,"#4AC",true,true,true);
        drawStick(210,260,"#B85",true,false,true);
        drawHouse(420,280,60,50);
        drawTree(580,270);
        drawTent(650,300);
    };
    const battleVisual = () => {
        drawStick(100,260,"#4AC",true,true,true);
        drawStick(200,260,"#6F4",true,false,true);
        drawHouse(450,280,60,60);
        drawTree(600,270);
        drawTent(650,300);
    };
    const npc4Visual = () => {
        drawStick(110,260,"#4AC",true,true,true);
        drawStick(180,260,"#C84",true,false,true);
        drawHouse(400,280,60,60);
        drawTree(550,270);
        drawTent(600,300);
    };
    const finalVisual = () => {
        drawStick(150,260,"#4AC",true,true,true);
        drawTree(500,270);
        drawTent(600,300);
    };

    // =========================
    // ANIMATION LOOP
    // =========================
    function animateScene() {
        clearScene();
        drawBackground();
        if(currentSceneVisual) currentSceneVisual();
        
        // update offsets for animations
        riverOffset += 1;
        if(riverOffset > 100) riverOffset = 0;

        if(bobDirection === 1) bobbing += 0.2; else bobbing -= 0.2;
        if(bobbing > 4 || bobbing < -4) bobDirection *= -1;

        treeSwing += treeDirection * 0.2;
        if(treeSwing > 3 || treeSwing < -3) treeDirection *= -1;

        animationFrameId = requestAnimationFrame(animateScene);
    }

    function switchScene(newVisual) { currentSceneVisual = newVisual; }

    // =========================
    // START BUTTON
    // =========================
    startBtn.addEventListener("click", () => {
        titleScreen.style.display = "none";
        gameScreen.style.display = "block";
        showSkipHint();
        switchScene(scene1Visual);
        animateScene();
        scene1();
    });

    // =========================
    // TYPEWRITER
    // =========================
    function typeText(text, onComplete) {
        typing = true; skipTyping = false; waitingForEnter = false;
        textBox.innerHTML = "";
        hideChoices();
        showSkipHint();
        let i = 0, speed = 28;
        function step() {
            if(skipTyping) { textBox.innerHTML=text; finish(); return; }
            if(i<text.length){ textBox.innerHTML += text.charAt(i); i++; setTimeout(step,speed); }
            else finish();
        }
        function finish() { typing=false; waitingForEnter=true; nextLineCallback=onComplete; }
        step();
    }

    // =========================
    // CHOICES
    // =========================
    function showChoices(list){
        choicesDiv.innerHTML=""; hideSkipHint(); waitingForEnter=false;
        list.forEach(c=>{
            const btn = document.createElement("button");
            btn.textContent = c.text;
            btn.onclick = () => typeText(c.response,()=>c.action());
            choicesDiv.appendChild(btn);
        });
    }
    function hideChoices(){ choicesDiv.innerHTML=""; }

    // =========================
    // SKIP HINT
    // =========================
    const skipHint = document.createElement("p");
    skipHint.style.color="#d4aa70";
    skipHint.style.fontSize="13px";
    skipHint.style.marginTop="8px";
    skipHint.innerText = "Press ENTER to continue";
    skipHint.style.display = "none";
    gameScreen.appendChild(skipHint);
    function showSkipHint(){ skipHint.style.display="block"; }
    function hideSkipHint(){ skipHint.style.display="none"; }

    // =========================
    // ENTER KEY
    // =========================
    document.addEventListener("keydown", e=>{
        if(e.key==="Enter"){
            if(typing) skipTyping = true;
            else if(waitingForEnter && nextLineCallback){
                let fn = nextLineCallback;
                nextLineCallback = null;
                waitingForEnter = false;
                fn();
            }
        }
    });

    // =========================
    // SCENES
    // =========================
function scene1() {
    switchScene(scene1Visual);
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
    switchScene(scene2Visual);
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
    switchScene(npc3Visual);
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
    switchScene(scene3Visual);
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
    switchScene(saloonVisual);
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
    switchScene(npc4Visual);
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
    switchScene(battleVisual);
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
    switchScene(finalVisual);
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
