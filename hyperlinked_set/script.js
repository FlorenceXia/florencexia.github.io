const container = document.querySelector(".container");
const buttonData = [{
		text: "Cat",
		url: "https://www.youtube.com/watch?v=-ZGA6oZzdsU",
		description: "Best Funniest Cats 😹 - Don't try to hold back Laughter 😂 Funny Cats 2023 #7"
	},
	{
		text: "Cat",
		url: "https://www.youtube.com/watch?v=SB-qEYVdvXA",
		description: "So many cute kittens videos compilation 2023"
	},
	{
		text: "Cat",
		url: "https://www.youtube.com/watch?v=M6vVTZglSzM",
		description: "A DAY IN THE LIFE OF A CAT"
	},
	{
		text: "Cat",
		url: "https://www.youtube.com/watch?v=4miSy-4PEAM",
		description: "Three little Teddy kittens | Cutest Baby British kittens"
	},
	{
		text: "Cat",
		url: "https://www.youtube.com/watch?v=y0sF5xhGreA",
		description: "20 Minutes of Adorable Kittens 😍 | BEST Compilation"
	},
	{
		text: "Cat",
		url: "https://www.youtube.com/watch?v=NsUWXo8M7UA",
		description: "Funny Cats Compilation (Most Popular) Part 2"
	},
	{
		text: "Cat",
		url: "https://www.youtube.com/watch?v=QtC3Bo9B0yI",
		description: "THE BEST CUTE AND FUNNY CAT VIDEOS OF 2019! 🐱"
	},
	{
		text: "Cat",
		url: "https://www.youtube.com/watch?v=GTUruS-lnEo",
		description: "Off to the Vet (Full Film in COLOUR) I A Simon’s Cat SPECIAL"
	},
	{
		text: "Cat",
		url: "https://www.youtube.com/watch?v=ZH9OzGuSudM",
		description: "What Can't Cats Walk On? #36"
	},
	{
		text: "Cat",
		url: "https://www.youtube.com/watch?v=-YO14FM76lY",
		description: "Most Viral Cats of the Internet | FUNNIEST videos 😂"
	}
];

const colors = [
	"#cdb4db",
	"#ffc8dd",
	"#ffafcc",
	"#bde0fe",
	"#a2d2ff",
	"#a690be",
	"#e1a2c0",
	"#e69fb2",
	"#99c2e8",
	"#89b6dd"
];



function getRandomColor() {
	return colors[Math.floor(Math.random() * colors.length)];
}


function createButton(data) {
    const btn = document.createElement("a");
    btn.className = "button";
    btn.innerText = data.text;
    btn.href = data.url;
    btn.target = "_blank"; 
    btn.style.left = `${Math.random() * 90}vw`;

    const animationDuration = 5 + Math.random() * 10; 
    btn.style.animation = `fly ${animationDuration}s linear infinite`;

    btn.style.bottom = `${Math.random() * 100}vh`;

    btn.style.animationDelay = `-${Math.random() * animationDuration}s`; 

    btn.style.backgroundColor = getRandomColor();

    container.appendChild(btn);

	const descriptionPreview = document.createElement('div');
    descriptionPreview.innerText = data.description; 
    descriptionPreview.className = "preview";
    descriptionPreview.style.display = 'none';
    container.appendChild(descriptionPreview);

    btn.onmouseover = function() {
		this.style.animationPlayState = 'paused';
	
		this.style.zIndex = '1000';
			
		descriptionPreview.style.display = 'block';
		descriptionPreview.style.left = `${this.getBoundingClientRect().right + 10}px`; 
		descriptionPreview.style.top = `${this.getBoundingClientRect().top}px`; 
    };

    btn.onmouseout = function() {
    	this.style.animationPlayState = 'running';
        this.style.zIndex = '1';  
        descriptionPreview.style.display = 'none';
    };
}

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const containerArea = screenWidth * screenHeight * 0.8;
const averageButtonArea = 100 * 50; 
const buttonCount = 0.8*Math.ceil(containerArea / averageButtonArea);

for (let i = 0; i < buttonCount; i++) {
	const index = i % buttonData.length;
	createButton(buttonData[index]);
}

