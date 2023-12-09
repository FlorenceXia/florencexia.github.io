let colors = ["#ffffff", "#ffffff", "#ffffff", "#ffffff"];
let currentSquare = null;
var seed = Math.random() * 100;
var t;
var num;
var radius, mySize, margin;
var v_planet = [];
let currentColorIndex = 0;
let audioFiles = [
    "audio/Negative4.mp3",
    "audio/Negative3.mp3",
    "audio/Negative2.mp3",
    "audio/Negative1.mp3",
    "audio/Positive1.mp3",
    "audio/Positive2.mp3",
    "audio/Positive3.mp3",
    "audio/Positive4.mp3"
];
let scores = [];
let posX;
let posY;
let allScores;


function setup() {
    randomSeed(seed);
    mySize = min(windowWidth * 1.8, windowHeight * 1.8);
    margin = mySize / 100;
    createCanvas(windowWidth, windowHeight, WEBGL);
    background("#202020");
    num = int(random(30, 50));
    radius = mySize * 0.75;
    t = 0;

    let visitButton = createButton('Visit');
    visitButton.position(windowWidth - 150, windowHeight - 180);
    visitButton.mousePressed(visitData);
    styleButton(visitButton);

    let saveImgButton = createButton('Save Image');
    saveImgButton.position(windowWidth - 150, windowHeight - 100);
    saveImgButton.mousePressed(saveImgData);
    styleButton(saveImgButton);
}

function visitData() {
    window.location.href = "url";
}


function styleButton(button) {
    button.style('border', '1px solid white'); 
    button.style('background-color', 'transparent'); 
    button.style('color', 'white'); 
    button.style('font-family', 'inherit');
    button.style('width', '100px');
    button.style('height', '50px');
    button.style('padding', '0px');
    button.style('cursor', 'pointer');
}




async function loadData() {
    try {
        const response = await fetch('/loadData');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        data.forEach(item => {
            let textElement = document.createElement("div");
            textElement.className = "textDisplay";
            textElement.style.left = item.x + 'px';
            textElement.style.top = item.y + 'px';
            textElement.style.position = "absolute";
            textElement.innerText = item.text;
            document.body.appendChild(textElement);

            updateColor(item.score);
            playAudioBasedOnScore(item.score);
        });

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}


document.body.addEventListener("click", function (event) {
    if (currentSquare) {
        currentSquare.remove();
        currentSquare = null;
    }

    if (event.target.className === "textDisplay") {
        return;
    }

    currentSquare = createEditingSquare(event.clientX, event.clientY);

    let textElement = document.createElement("div");
    textElement.className = "textDisplay";
    textElement.contentEditable = "true";
    textElement.style.left = event.clientX + 'px';
    textElement.style.top = event.clientY + 'px';
    textElement.style.position = "absolute";
    document.body.appendChild(textElement);

    textElement.onblur = async function () {
        if (currentSquare) {
            currentSquare.remove();
            currentSquare = null;
        }
        const text = textElement.innerText;
        await analyzeSentiment(text);
    };

    textElement.oninput = function () {
        if (currentSquare) {
            currentSquare.remove();
            currentSquare = null;
        }
    };

    textElement.focus();
});

function createEditingSquare(x, y) {
    let square = document.createElement("div");

    square.style.width = "10px";
    square.style.height = "10px";
    square.style.backgroundColor = "white";
    square.style.position = "absolute";
    square.style.left = x + 'px';
    square.style.top = y + 'px';
    posX = x;
    posY = y;
    document.body.appendChild(square);
    return square;
}

document.body.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        if (document.activeElement.className === "textDisplay") {
            document.activeElement.blur();
        }
    }
});



async function analyzeSentiment(text) {
    if (!text.trim()) {
        console.log('No text provided for sentiment analysis');
        return;
    }

    try {
        const response = await fetch(`/analyzeSentiment?text=${encodeURIComponent(text)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        updateColor(data.score);
        displayScore(data.score, colors[currentColorIndex]);

        let sentimentData = {
            score: data.score,
            text: text,
            x: posX,
            y: posY
        };

        scores.push(sentimentData); 

        if (scores.length === 4) {
            playAudioBasedOnScore(sentimentData.score);
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}



function playAudioBasedOnScore(totalScore) {
    allScores = totalScore;
    let index;

    if (totalScore < -2) {
        index = 0;
        console.log(0);
    } else if (totalScore < -1) {
        index = 1;
        console.log(1);
    } else if (totalScore < -0.5) {
        index = 2;
        console.log(2);
    } else if (totalScore < 0) {
        index = 3;
        console.log(3);
    } else if (totalScore < 0.5) {
        index = 4;
        console.log(4);
    } else if (totalScore < 1) {
        index = 5;
        console.log(5);
    } else if (totalScore < 2) {
        index = 6;
        console.log(1);
    } else {
        index = 7;
    }

    let audio = new Audio(audioFiles[index]);
    audio.loop = true;
    audio.play();
}

function saveImgData() {
    html2canvas(document.body).then(function (canvas) {
        let timestamp = Date.now();
        canvas.toBlob(async function (blob) {
            let formData = new FormData();
            formData.append('image', blob, `image_${timestamp}.png`);

            let data = {
                score: allScores,
                imageName: `image_${timestamp}.png`
            };
            try {
                await fetch('/saveImageData', {
                    method: 'POST',
                    body: formData
                });

                await fetch('/saveData', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                console.log("Image and score data saved successfully");
            } catch (error) {
                console.error('Error saving image and score data:', error);
            }
        });
    });
}

function getCanvas() {
    return document.querySelector('canvas');
}

function scoreToHue(score) {
    return (1 - score) * 180;
}

function updateColor(score) {
    const hue = Math.floor(scoreToHue(score));
    const color = `hsl(${hue}, 100%, 50%)`;
    colors[currentColorIndex] = color;
    currentColorIndex = (currentColorIndex + 1) % colors.length;
    console.log("Updated colors:", colors);
    redraw();
}

function draw() {
    randomSeed(seed);
    background("#202020");

    for (let i = 0; i < num; i++) {
        let a = (TAU / num) * i;
        let x = radius * sin(a) / random(5, 3) / 1.0;
        let y = radius * cos(a) / random(3, 5) / 1.0;
        v_planet[i] = createVector(x, y);
    }

    push();

    for (let j = 0; j < colors.length; j++) {
        let color = colors[j];
        noFill();
        strokeWeight(2);
        stroke(color);

        beginShape();
        for (let i = 0; i < num; i++) {
            let d = radius / 10;
            let x_plus = 0.5 * sin(t + j) * random(-d, d);
            let y_plus = 0.5 * cos(t + j) * random(-d, d);
            let z_plus = 0.5 * sin(t + j) * random(-d, d);
            curveVertex(v_planet[i].x + x_plus, v_planet[i].y + y_plus, z_plus);
        }
        endShape(CLOSE);
    }

    pop();

    t += 0.05;

}

function displayScore(score, color) {
    var scoreDiv = document.getElementById('scoreDisplay');
    scoreDiv.innerHTML = 'Score: ' + score.toFixed(2);
}

window.onload = function () {
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
    document.body.classList.add('modal-open');
}

window.onclick = function (event) {
    var modal = document.getElementById("myModal");
    if (event.target == modal) {
        modal.style.display = "none";
        document.body.classList.remove('modal-open');
    }
}