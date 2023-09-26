const container = document.querySelector(".container");
const buttonData = [{
		text: "Cat",
		url: "https://www.bilibili.com/video/BV1RL41187N7"
	},
	{
		text: "Cat",
		url: "https://www.bilibili.com/video/BV1Su411H76u"
	},
	{
		text: "Cat",
		url: "https://www.bilibili.com/video/BV1wk4y1H7nq"
	},
	{
		text: "Cat",
		url: "https://www.bilibili.com/video/BV1gf4y1Z7mB"
	},
	{
		text: "Cat",
		url: "https://www.bilibili.com/video/BV1hM4y1t7tz"
	},
	{
		text: "Cat",
		url: "https://www.bilibili.com/video/BV1ZV4y1Y7bt"
	},
	{
		text: "Cat",
		url: "https://www.bilibili.com/video/BV1mt4y1N74o"
	},
	{
		text: "Cat",
		url: "https://www.bilibili.com/video/BV1iW4y1y7ko"
	},
	{
		text: "Cat",
		url: "https://www.bilibili.com/video/BV1NX4y1d7d7"
	},
	{
		text: "Cat",
		url: "https://www.bilibili.com/video/BV1wu411N74K"
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
    btn.target = "_blank"; // 如果你希望链接在新窗口或标签页中打开
    btn.style.left = `${Math.random() * 90}vw`;

    const animationDuration = 5 + Math.random() * 10; // 5到15秒的动画时间
    btn.style.animation = `fly ${animationDuration}s linear infinite`;

    // 随机起始位置
    btn.style.bottom = `${Math.random() * 100}vh`;

    // 为每个按钮设置一个随机的动画延迟，确保屏幕初始为空白
    btn.style.animationDelay = `-${Math.random() * animationDuration}s`; 

    btn.style.backgroundColor = getRandomColor();

    container.appendChild(btn);
}

// 计算所需的按钮数量
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
const containerArea = screenWidth * screenHeight * 0.8;
const averageButtonArea = 100 * 50; // 按钮的平均面积，假设为100px * 50px
const buttonCount = Math.ceil(containerArea / averageButtonArea);

// 多次调用 createButton 方法来创建按钮
for (let i = 0; i < buttonCount; i++) {
	const index = i % buttonData.length; // 循环使用按钮数据
	createButton(buttonData[index]);
}
