document.addEventListener("DOMContentLoaded", () => {

    // ========================================================================
    // DOM ELEMENTS
    // ========================================================================
    const startBtn = document.getElementById("start-btn");
    const titleScreen = document.getElementById("title-screen");
    const gameScreen = document.getElementById("game-screen");
    const textBox = document.getElementById("text-box");
    const choicesDiv = document.getElementById("choices");
    const canvas = document.getElementById("scene-canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 400;

    // ========================================================================
    // ENGINE VARIABLES
    // ========================================================================
    let typing=false, skipTyping=false, waitingForEnter=false, nextLineCallback=null;
    const CHAR_SIZE = 16;

    // ========================================================================
    // RESET / BACKGROUND
    // ========================================================================
    function clearScene(){ ctx.clearRect(0,0,canvas.width,canvas.height); }

    function drawPixelBackground(){
        clearScene();

        // SKY + GROUND
        ctx.fillStyle="#87CEEB"; ctx.fillRect(0,0,800,200);
        ctx.fillStyle="#3FA136"; ctx.fillRect(0,200,800,200);

        // SUN
        ctx.fillStyle="#FFD700"; ctx.fillRect(700,40,30,30);

        // HILLS
        ctx.fillStyle="#267725";
        const hills=[[100,210,170,110],[400,210,470,130]];
        hills.forEach(([x1,y1,x2,y2])=>{
            ctx.beginPath();
            ctx.moveTo(x1,200);
            ctx.lineTo(x1+150,200);
            ctx.lineTo(x2,y2);
            ctx.fill();
        });

        // RIVER + PATH
        ctx.fillStyle="#1E90FF"; ctx.fillRect(220,310,160,18);
        ctx.fillStyle="#C89D59"; ctx.fillRect(50,345,270,26);
    }

    // ========================================================================
    // OBJECT DRAWERS
    // ========================================================================
    function drawPixelTree(x,y,s=20){
        ctx.fillStyle="#1E7B27";
        ctx.beginPath(); ctx.moveTo(x,y-s);
        ctx.lineTo(x-s,y+s/2); ctx.lineTo(x+s,y+s/2);
        ctx.fill();
        ctx.fillStyle="#5B3419";
        ctx.fillRect(x-s/6,y+s/2,s/3,s/2);
    }
    function drawPixelHouse(x,y,w=40,h=40){
        ctx.fillStyle="#7C4828"; ctx.fillRect(x,y,w,h);
        ctx.fillStyle="#9A3E24";
        ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+w,y);
        ctx.lineTo(x+w/2,y-h/2); ctx.fill();
    }
    function drawPixelTent(x,y,w=30,h=30){
        ctx.fillStyle="#E55D44";
        ctx.beginPath(); ctx.moveTo(x,y);
        ctx.lineTo(x-w/2,y+h); ctx.lineTo(x+w/2,y+h);
        ctx.fill();
    }
    function drawPixelCharacter(x,y,color="blue",hat=false,tool=false,bag=false){
        const s=CHAR_SIZE;

        // Head
        ctx.fillStyle="#FDD8B5"; ctx.fillRect(x,y,s,s);

        // Body
        ctx.fillStyle=color; ctx.fillRect(x,y+s,s,2*s);

        // Arms
        ctx.fillRect(x-s/2,y+s,s/2,2*s);
        ctx.fillRect(x+s,y+s,s/2,2*s);

        // Legs
        ctx.fillRect(x,y+3*s,s/2,2*s);
        ctx.fillRect(x+s/2,y+3*s,s/2,2*s);

        // Hat
        if(hat){ ctx.fillStyle="#6A3B15"; ctx.fillRect(x-s/4,y-s/4,s*1.4,s/4); }

        // Pickaxe
        if(tool){ ctx.fillStyle="#9BA4AC"; ctx.fillRect(x+s,y+s,4,1.8*s); }

        // Bag
        if(bag){ ctx.fillStyle="#725732"; ctx.fillRect(x-s/2,y+s,s/2,s); }
    }

    // ========================================================================
    // VISUAL SCENES
    // ========================================================================
    // SCENE 1 – Samuel Carter
    const scene1Visual=()=>{ drawPixelBackground();
        drawPixelCharacter(140,270,"#3AA",true,true,true);
        drawPixelCharacter(270,270,"#6A4",true,false,true);
        drawPixelTree(100,270); drawPixelHouse(500,260); drawPixelTree(680,270);
    };
    // SCENE 2 – Harlow / camp
    const scene2Visual=()=>{ drawPixelBackground();
        drawPixelCharacter(130,270,"#3AA",true,true,true);
        drawPixelCharacter(300,270,"#B57439",true,false,true);
        drawPixelTent(580,260); drawPixelHouse(450,260);
        drawPixelTree(380,270); drawPixelTree(700,260);
    };
    // SCENE 3 – Atsa Redfern arrival
    const npc3Visual=()=>{ drawPixelBackground();
        drawPixelCharacter(150,270,"#3AA",true,true,true);
        drawPixelCharacter(280,270,"#D68C52",true,false,true);
        drawPixelTent(600,260); drawPixelTree(450,270); drawPixelTree(720,260);
    };
    // SCENE 4 original branch
    const scene3Visual=()=>{ drawPixelBackground();
        drawPixelCharacter(150,270,"#3AA",true,true,true);
        drawPixelHouse(450,260); drawPixelTent(620,260);
        drawPixelTree(550,270); drawPixelTree(700,270);
    };
    // *** NEW SCENE *** – JOSIAH REED enslaved arrival
    const scene4Visual=()=>{ drawPixelBackground();
        drawPixelCharacter(140,270,"#3AA",true,true,true);     // player
        drawPixelCharacter(250,270,"#202020",false,false,true);// Josiah Reed
        drawPixelCharacter(330,270,"#9B622E",true,false,true); // Eli Turner
        drawPixelTent(550,260); drawPixelTree(470,270); drawPixelTree(700,270);
    };
    // FINAL battle
    const battleVisual=()=>{ drawPixelBackground();
        drawPixelCharacter(150,270,"#3AA",true,true,true);
        drawPixelCharacter(270,270,"#6A4",true,false,true);
        drawPixelTent(600,260); drawPixelTree(500,270); drawPixelHouse(440,260);
    };
    const finalVisual=()=>{ drawPixelBackground();
        drawPixelCharacter(150,270,"#3AA",true,true,true);
        drawPixelTree(550,270); drawPixelTent(600,260); drawPixelTree(720,270);
    };

    // ========================================================================
    // START UI / TYPEWRITER
    // ========================================================================
    startBtn.onclick=()=>{ titleScreen.style.display="none"; gameScreen.style.display="block"; showSkipHint(); scene1(); };

    function typeText(text,onComplete){
        typing=true;skipTyping=false;waitingForEnter=false;
        textBox.innerHTML="";hideChoices();showSkipHint();
        let i=0;const speed=28;

        function step(){
            if(skipTyping){ textBox.innerHTML=text;finish();return; }
            if(i<text.length){ textBox.innerHTML+=text[i++];setTimeout(step,speed); }
            else finish();
        }
        function finish(){ typing=false;waitingForEnter=true;nextLineCallback=onComplete; }
        step();
    }

    function showChoices(opts){
        hideSkipHint();waitingForEnter=false;choicesDiv.innerHTML="";
        opts.forEach(o=>{
            const b=document.createElement("button");
            b.textContent=o.text;
            b.onclick=()=>typeText(o.response,o.action);
            choicesDiv.appendChild(b);
        });
    }
    const skipHint=document.createElement("p");
    skipHint.textContent="Press ENTER to continue"; skipHint.style.color="#E4D09F";
    skipHint.style.display="none"; gameScreen.appendChild(skipHint);
    const showSkipHint=()=>skipHint.style.display="block";
    const hideSkipHint=()=>skipHint.style.display="none";
    const hideChoices=()=>choicesDiv.innerHTML="";

    document.addEventListener("keydown",e=>{
        if(e.key==="Enter"){
            if(typing)skipTyping=true;
            else if(waitingForEnter&&nextLineCallback){
                let n=nextLineCallback; nextLineCallback=null;n();
            }
        }
    });

    // ========================================================================
    // STORY SCENES (FULL)
    // ========================================================================
    function scene1(){
        scene1Visual();
        const L=[
            "The year is 1851. Mexico has just lost the war, and the United States has taken California.",
            "You travel west seeking gold, opportunity, a chance at wealth.",
            "Beside the trail sits Samuel Carter, a freedman you have seen on the road before.",
            'Samuel: "Back East I worked fields I would never own. Here they say the land is free. You think it will be free for someone like me?"'
        ]; let i=0; function next(){
            if(i<L.length) typeText(L[i++],next);
            else showChoices([
                {text:"Of course it's free",response:"Samuel nods, cautious but hopeful.",action:scene2},
                {text:"Not sure",response:"Samuel exhales, still hopeful.",action:scene2},
                {text:"I do not care",response:"Samuel goes quiet but remains polite.",action:scene2}
            ]);
        } next();
    }
    function scene2(){
        scene2Visual();
        const L=[
            "You enter a crowded valley of tents and miners from every nation.",
            "Hydraulic hoses scar the hills. Burnt native camps still mark the ground.",
            'William Harlow approaches: "When I rode in ’49 this land was Indian country. The state paid us to make it safe for folks like you."'
        ]; let i=0; function next(){
            if(i<L.length) typeText(L[i++],next);
            else showChoices([
                {text:"Approve him",response:"Harlow grins.",action:npc3Scene},
                {text:"Ask about villages",response:"Harlow shrugs it off.",action:npc3Scene},
                {text:"Ask for advice",response:"Harlow suggests avoiding rival claims.",action:npc3Scene}
            ]);
        } next();
    }
    function npc3Scene(){
        npc3Visual();
        const L=[
            "A Maidu woman approaches carrying woven baskets.",
            'Atsa Redfern: "Our oaks were cut, our waters poisoned. Will you buy something to help us survive?"'
        ]; let i=0; function next(){
            if(i<L.length) typeText(L[i++],next);
            else showChoices([
                {text:"Buy and listen",response:"She thanks you quietly.",action:scene3},
                {text:"Dismiss her",response:"She walks away silently.",action:scene3},
                {text:"Reassure but do not buy",response:"She nods without warmth.",action:scene3}
            ]);
        } next();
    }
    function scene3(){
        scene3Visual();
        const L=[
            "At the courthouse, a Californio land grant is rejected under U.S. law.",
            "Samuel Carter stands beside you watching – silent, uneasy.",
            "How do you respond?"
        ]; let i=0; function next(){
            if(i<L.length) typeText(L[i++],next);
            else showChoices([
                {text:"Praise ruling",response:"Harlow welcomes your loyalty.",action:scene4Normal},
                {text:"Approach family",response:"Samuel seems glad.",action:scene4NPCFollow},
                {text:"Walk away",response:"Samuel watches you think.",action:scene4NPCFollow},
                {text:"Object publicly",response:"Settlers jeer at you.",action:scene4NPCFollow}
            ]);
        } next();
    }

    // NEW **Scene 4A** Josiah Reed enslaved man
    function scene4Normal(){
        scene4Visual();
        const L=[
            "On the trail you find a wagon and a man tied at the wrists.",
            "This is Josiah Reed. Exhausted. Dehydrated.",
            'Eli Turner: "Brought him from Georgia. Good worker. Gold flows faster with muscle."',
            'Josiah: "Sir please. A drink or a word is all I ask."'
        ]; let i=0; function next(){
            if(i<L.length) typeText(L[i++],next);
            else showChoices([
                {text:"Give him water",response:"Josiah drinks slowly.",action:scene4Continue},
                {text:"Confront Eli about slavery",response:"Eli narrows his eyes.",action:scene4Continue},
                {text:"Speak privately to Josiah",response:"He whispers thanks.",action:scene4Continue},
                {text:"Cut him loose",response:"Eli reaches for a gun.",action:scene4Continue},
                {text:"Walk away",response:"Josiah watches in silence.",action:scene4Continue}
            ]);
        } next();
    }

    // Scene 4B branch from courthouse path
    function scene4NPCFollow(){
        npc3Visual();
        const L=[
            "Later Samuel approaches, bruised and shaken.",
            '"A man stole my claim. I fought, they beat me. Law says my word means nothing here."'
        ]; let i=0; function next(){
            if(i<L.length) typeText(L[i++],next);
            else showChoices([
                {text:"Blame him",response:"He leaves quietly.",action:scene4Continue},
                {text:"Swear to stand with him",response:"His eyes brighten.",action:scene4Continue},
                {text:"Tell him to leave California",response:"He walks away, wounded.",action:scene4Continue}
            ]);
        } next();
    }

    // Battle scene continuation unites both story branches
    function scene4Continue(){
        battleVisual();
        const L=[
            "Harlow rallies men for a raid on a native encampment.",
            "Violence is coming. You must decide who you will be."
        ]; let i=0; function next(){
            if(i<L.length) typeText(L[i++],next);
            else showChoices([
                {text:"Fire into the camp",response:"Buildings burn. The raid succeeds.",action:finalScene},
                {text:"Fire but miss",response:"You live with the guilt.",action:finalScene},
                {text:"Shield fleeing survivors",response:"You may be hunted for this.",action:finalScene}
            ]);
        } next();
    }

    function finalScene(){
        finalVisual();
        const L=[
            "1855 — the gold is nearly gone.",
            "Samuel Carter finds you again beside the riverbed.",
            '"We both changed California. The question is — did we change it for the better?"'
        ]; let i=0; function next(){
            if(i<L.length) typeText(L[i++],next);
            else typeText("=== THE END ===");
        } next();
    }

});
