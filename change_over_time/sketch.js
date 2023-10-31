let video;
let poseNet;
let poses = [];
const mVel = 1;
let particles = [];
let connectionCount = 0;
let baseColor;
let x = 0; // 初始x位置
let quadWidth = 45; // 平行四边形的宽度（从最左点到最右点）
let spacing = -10; // 间隔
let daysSinceChernobylDisaster;//全局变量：当前选择的日期与切尔诺贝利事故发生日期差值
const elements = {
    star: { count: 100, halfLife: 8 },  // I-137的半衰期为8天
    circle: { count: 100, halfLife: 30.2 * 365.25 },  // Cs-137的半衰期为30年
    triangle: { count: 100, halfLife: 28.8 * 365.25 }, // Sr-90的半衰期是28.8年
    square: { count: 100, halfLife: 24100 * 365.25 }     // Pu-239的半衰期是24100年
};//将每个放射物的半衰期进行声明

//管理变量
let numCircles = elements.circle.count;
let numSquares = elements.square.count;
let numTriangles = elements.triangle.count;
let numStars = elements.star.count;

let lastClickedElement = null;
let shouldDrawRectangle = false;
let lerpAmount;
let currentColor;
let moveSpeed = 0.2;

function setup() {
    createCanvas(windowWidth, windowHeight);

    updateElementCounts(daysSinceChernobylDisaster);

    baseColor = color(0, 0, 255);
    for (let i = 0; i < elements.circle.count; i++) {
        particles.push(new Particle('circle'));
    }
    for (let i = 0; i < elements.square.count; i++) {
        particles.push(new Particle('square'));
    }
    for (let i = 0; i < elements.triangle.count; i++) {
        particles.push(new Particle('triangle'));
    }
    for (let i = 0; i < elements.star.count; i++) {
        particles.push(new Particle('star'));
    }
}

function capturevideo() {
    video = createCapture(VIDEO);
    video.size(width, width * video.height / video.width);
    video.hide();
    poseNet = ml5.poseNet(video, function () {
        console.log("PoseNet model loaded!");
    });
    poseNet.on('pose', function (results) {
        poses = results;
    });

};

function draw() {
    background(0);
    if (poses.length > 0) {
        let pose = poses[0].pose;

        // 使用镜像坐标绘制蓝色圆代表眼睛
        let mirroredLeftEye = {
            x: width - pose.leftEye.x,
            y: pose.leftEye.y
        };
        let mirroredRightEye = {
            x: width - pose.rightEye.x,
            y: pose.rightEye.y
        };

        lerpAmount = constrain(connectionCount / 100 * 0.01, 0, 1);
        currentColor = lerpColor(baseColor, color(0, 255, 0), lerpAmount);


        fill(currentColor);
        noStroke();
        ellipse(mirroredLeftEye.x, mirroredLeftEye.y, 50);
        ellipse(mirroredRightEye.x, mirroredRightEye.y, 50);

        // 使用蓝色圆的原始坐标与黄色粒子进行互动
        for (let particle of particles) {
            let d1 = dist(particle.pos.x, particle.pos.y, mirroredLeftEye.x, mirroredLeftEye.y);
            let d2 = dist(particle.pos.x, particle.pos.y, mirroredRightEye.x, mirroredRightEye.y);

            if (d1 < 100 || d2 < 100) {
                stroke(currentColor);
                line(particle.pos.x, particle.pos.y, mirroredLeftEye.x, mirroredLeftEye.y);
                line(particle.pos.x, particle.pos.y, mirroredRightEye.x, mirroredRightEye.y);
                if (lerpAmount < 1) {
                    connectionCount++;
                } else {
                    moveSpeed = 3;
                }
            }
        }
    }

    for (let particle of particles) {
        particle.update();
        particle.render();
    }

    // 当四边形完全移出屏幕右侧后，重置x的位置
    if (x > quadWidth + spacing) {
        x = 0;
    }


    fill(237, 209, 71);
    rect(0, 0, width, 70);
    fill(237, 209, 71);
    rect(0, windowHeight - 70, width, 70);

    for (let i = x - (quadWidth + spacing); i < width + quadWidth; i += quadWidth + spacing) {
        drawQuad(i);
    }
    x += moveSpeed;

    if (shouldDrawRectangle) {
        drawBottomRectangle();
    } else {
        drawAggregateRectangle();
    }


    
    if (lerpAmount >= 1) {
        drawBlinkingText();
    }

}



class Particle {
    constructor(shape) {
        this.pos = createVector(random(width), random(height));
        this.vel = createVector(random(-mVel, mVel), random(-mVel, mVel));
        this.col = color(237, 209, 71);
        this.shape = shape;
    }

    update() {
        this.pos.add(this.vel);
        this.bounce();
    }

    render() {
        fill(this.col);
        noStroke();
        switch (this.shape) {
            case 'circle':
                ellipse(this.pos.x, this.pos.y, 12);
                break;
            case 'square':
                rect(this.pos.x, this.pos.y, 12, 12);
                break;
            case 'triangle':
                triangle(this.pos.x, this.pos.y - 6, this.pos.x - 6, this.pos.y + 6, this.pos.x + 6, this.pos.y + 6);
                break;
            case 'star':
                this.drawStar(this.pos.x, this.pos.y, 5, 10, 5);
                break;
        }
    }

    drawStar(x, y, radius1, radius2, npoints) {
        let angle = TWO_PI / npoints;
        let halfAngle = angle / 2.0;
        beginShape();
        for (let a = -PI / 10; a < TWO_PI; a += angle) { // 开始角度设置为 -PI / 10，这样会使得下方两个点在同一水平线上
            let sx = x + cos(a) * radius2;
            let sy = y + sin(a) * radius2;
            vertex(sx, sy);
            sx = x + cos(a + halfAngle) * radius1;
            sy = y + sin(a + halfAngle) * radius1;
            vertex(sx, sy);
        }
        endShape(CLOSE);
    }


    bounce() {
        if (this.pos.x > width || this.pos.x < 0) {
            this.vel.x *= -1;
        }
        if (this.pos.y > height || this.pos.y < 0) {
            this.vel.y *= -1;
        }
    }
}

function drawQuad(baseX) {
    fill(0);
    quad(baseX, 0, baseX + 20, 0, baseX - 5, 30, baseX - 25, 30);
    quad(baseX, windowHeight - 30, baseX + 20, windowHeight - 30, baseX - 5, windowHeight, baseX - 25, windowHeight);

}

function clearParticles() {
    particles = [];
}

// 生成圆形图形的函数
function generateCircles() {
    clearParticles();
    for (let i = 0; i < elements.circle.count; i++) {
        particles.push(new Particle('circle'));
    }

    // 根据 elements.circle.count 计算长方形的长度
    let rectLength = width * (50 - elements.circle.count) / 50;

    // 设置长方形的颜色（可以根据你的需要更改）
    fill(237, 209, 71); // 设置为红色，你可以根据需要更改

    // 绘制长方形
    // 这里的 'height - 50' 确保长方形在屏幕底部，'50' 是长方形的高度
    rect(0, height - 50, rectLength, 50);
}

// 生成方形图形的函数
function generateSquares() {
    clearParticles();
    for (let i = 0; i < elements.square.count; i++) {
        particles.push(new Particle('square'));
    }
}

// 生成三角形图形的函数
function generateTriangles() {
    clearParticles();
    for (let i = 0; i < elements.triangle.count; i++) {
        particles.push(new Particle('triangle'));
    }
}

// 生成星型图形的函数
function generateStars() {
    clearParticles();
    for (let i = 0; i < elements.star.count; i++) {
        particles.push(new Particle('star'));
    }
}
// 当页面加载完成时显示Modal
window.onload = function () {
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
    document.body.classList.add('modal-open');
}

// 当点击Modal外部时关闭它
window.onclick = function (event) {
    var modal = document.getElementById("myModal");
    if (event.target == modal) {
        modal.style.display = "none";
        document.body.classList.remove('modal-open');
    }
}

//画面左上的书签控制
function getBar() {
    var shell = document.querySelector('.shell');

    // 添加事件监听器，处理模块的点击事件
    shell.addEventListener('click', function (event) {
        this.classList.toggle('expanded');
        event.stopPropagation();  // 阻止事件冒泡，以避免外部点击事件监听器立即关闭模块
    });

    // 添加事件监听器，处理外部的点击事件
    document.addEventListener('click', function (event) {
        // 检查点击的目标是否是 `.shell` 或 `.shell` 的子元素
        if (!shell.contains(event.target)) {
            shell.classList.remove('expanded');
        }
    });
}

//计算当前日期与切尔诺贝利事故日期（04/26/1986）差值
function calculateDaysSinceChernobyl() {
    const chernobylDate = new Date('04/26/1986');

    // 获取h2元素中的日期文本
    const displayedDateText = document.getElementById('currentDate').textContent;
    // 使用这个文本内容创建一个新的日期对象
    const currentDate = new Date(displayedDateText);

    const diffInMilliseconds = currentDate - chernobylDate;
    return Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
}

//获取当前日期用作展示
function getCurrentDateStr() {
    const currentDate = new Date();
    return `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
}

//计算当前放射物的半衰期
function updateElementCounts(daysElapsed) {
    for (let key in elements) {
        let element = elements[key];
        let decayFactor = Math.pow(0.5, daysElapsed / element.halfLife);
        element.count = Math.floor(element.count * decayFactor);
        console.log(element.count)
    }
}

function drawBottomRectangle() {
    if (!lastClickedElement) return; // 如果没有元素被点击，直接返回

    // 获取对应元素的剩余数量
    let remainingCount = elements[lastClickedElement].count;

    // 计算长方形的长度
    let rectLength = width * (1 - remainingCount / 100);

    // 设置长方形的颜色
    fill(237, 209, 71);

    // 绘制长方形
    rect(0, height - 50, rectLength, 50);
    rect(0, 0, rectLength, 50);
}


function drawAggregateRectangle() {
    // 计算所有元素的初始总数量
    let totalInitialCount = 0;
    for (let key in elements) {
        totalInitialCount += elements[key].count;
    }

    // 计算所有元素的当前总数量
    let totalCurrentCount = 0;
    for (let key in elements) {
        let element = elements[key];
        let decayFactor = Math.pow(0.5, daysSinceChernobylDisaster / element.halfLife);
        totalCurrentCount += Math.floor(element.count * decayFactor);
    }

    // 根据这些数量计算长方形的长度
    let rectLength = width * (totalInitialCount - totalCurrentCount) / totalInitialCount;

    // 绘制长方形
    fill(237, 209, 71); // 设置为黄色，你可以根据需要更改
    rect(0, height - 50, rectLength, 50);
    rect(0, 0, rectLength, 50);
}

function drawBlinkingText() {
    // 基于connectionCount的值改变闪烁速度
    let aplhaSpeed = 0.1;
    let blinkValue = sin(frameCount * aplhaSpeed);

    // 将blinkValue映射到透明度范围：100到255之间
    let alpha = map(blinkValue, -1, 1, 100, 255);

    // 设置文本属性
    textSize(32); // 调整文本大小
    textAlign(CENTER, CENTER); // 设置文本对齐方式

    // 使用新的透明度值绘制文本
    fill(255, 0, 0, alpha); // 设置文本颜色为红色，根据blinkValue调整透明度
    let xPos = width / 2; // 在此处设置文本的x坐标
    let yPos = height / 2 + 300; // 在此处设置文本的y坐标
    text("CAUTION! LETHAL DOSE OF RADIATION!", xPos, yPos);

    // 设置文本属性
    textSize(32); // 根据CSS中未提供的具体值设置文本大小。你可能需要调整这个数值以匹配你的设计。
    textAlign(CENTER, CENTER); // 设置文本对齐方式
    textFont('Helvetica', 'Bold'); // 使用'Proxima Nova'字体并设置字体粗细为'Bold'

}