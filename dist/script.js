console.clear();

const c = document.querySelector("canvas");
const ctx = c.getContext("2d");
let cw = (c.width = innerWidth);
let ch = (c.height = innerHeight);
const bubbles = [];
const debounce = gsap.to(window, { duration: 0.1 }); //control the rate at which new bubbles can be made
const img = new Image();
const m = { x: 0, y: 0 };

img.src = "https://assets.codepen.io/721952/bubbles_1.webp"; //(8 frames)
// img.src = 'https://assets.codepen.io/721952/bubbles_2.webp' // (9 frames)

img.onload = () => {
    for (i = 0; i < 20; i++) {
        //make a few bubbles to start
        m.x = gsap.utils.random(150, cw - 150, 1);
        m.y = gsap.utils.random(150, ch - 150, 1);
        makeBubble(true);
    }
};

window.onpointerdown = window.onpointermove = (e) => {
    //the rest are made on pointer move/tap
    m.x = e.x;
    m.y = e.y;
    makeBubble();
};

function makeBubble(auto) {
    if (debounce.progress() == 1 || auto) {
        debounce.play(0);

        const dist = gsap.utils.random(100, 200);
        const scale = gsap.utils.random(0.4, 0.8);
        const b = {
            dur: gsap.utils.random(3, 7),
            spriteDur: gsap.utils.random(0.12, 0.5),
            rotate: gsap.utils.random(-9, 9),
            scaleX: scale,
            scaleY: scale,
            step: 0,
            x: 0,
            y: 0,
            n: bubbles.length,
        };

        bubbles.push(b);

        gsap.timeline({ defaults: { ease: "none" } })

            .fromTo(
                b,
                {
                    //move bubbles along a random curve
                    x: m.x - 75 * scale,
                    y: m.y - 75 * scale,
                },
                {
                    duration: b.dur,
                    rotate: "+=" + gsap.utils.random(-5, 5, 1),
                    motionPath: () =>
                        "M" +
                        b.x +
                        "," +
                        b.y +
                        "c" +
                        gsap.utils.random(-dist, dist, 1) +
                        "," +
                        gsap.utils.random(-dist, dist, 1) +
                        " " +
                        gsap.utils.random(-dist, dist, 1) +
                        "," +
                        gsap.utils.random(-dist, dist, 1) +
                        " " +
                        gsap.utils.random(-dist, dist, 1) +
                        "," +
                        gsap.utils.random(-dist, dist, 1),
                },
                0
            )

            .to(
                b,
                {
                    //scale changes to add more variation
                    duration: b.dur / 5,
                    ease: "sine.inOut",
                    yoyo: true,
                    repeat: 3,
                    repeatRefresh: true,
                    scaleX: () => scale + gsap.utils.random(-0.1, 0.1),
                    scaleY: () => scale + gsap.utils.random(-0.1, 0.1),
                },
                b.dur / 5
            )

            .to(
                b,
                {
                    //step through the popping image sequence
                    duration: b.spriteDur,
                    step: 8, //adjust per the number of frames in the sprite-sheet
                    snap: "step",
                },
                b.dur - b.spriteDur * 2
            );
    }
}

gsap.ticker.add(() => {
    ctx.clearRect(0, 0, cw, ch);
    //console.log(bubbles);
    bubbles.forEach((b) => {
      
        ctx.fillStyle = "#fff";
        ctx.fillText("Alex Paliskis", b.x + 20, b.y + 50);
        ctx.translate(b.x + b.scaleX * 75, b.y + b.scaleY * 75);
        ctx.rotate(b.rotate);
        ctx.drawImage(
            img,
            0,
            b.step * 150,
            150,
            150,
            -b.scaleX * 75,
            -b.scaleY * 75,
            b.scaleX * 150,
            b.scaleY * 150
        );
        ctx.rotate(-b.rotate);
        ctx.translate(-b.x - b.scaleX * 75, -b.y - b.scaleY * 75);
    });
});

window.onresize = () => {
    cw = c.width = innerWidth;
    ch = c.height = innerHeight;
};

function kill(e) {
    console.log(e);
}
