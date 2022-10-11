title = " Water Fishing";

description = `
[Tap]
 Swim & Catch
`;

characters = [
//fish 1
  ` 
 cc   
pppc
pcp 
pppc
 c  


`, //fish 2
  `
 gg   
rrrg
rgr 
rrrg
 g  

 
`, //submarine clicked
  ` 
   yy 
   y  
y yyyy
 yyyrr
 yyyrr
y yyyy
`, //submarine not clicked
  `
   yy 
   y  
y yyyy
 yyybb
 yyybb
y yyyy
`,
  ` 
l l
`, //fish 3
`
 pp   
gggp
gpg 
gggp
 p  


`, //fish 4
`
 cc   
rrrc
rcr 
rrrc
 c  


`, // net
`
   lll
 ll
l
l
 ll
   lll
`
];

options = {
  theme: "pixel",
  //turned off background music for now since it's too loud
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 3000,
};

/** @type {{x: number, height: number}[]} */
let walls;
let wallHeight;
let wallHeightVel;
/** @type {{pos: Vector, launchTicks: number}[]} */
//let missiles;
/** @type {Vector[]} */
//let tanks;
//let nextTankDist;
/** @type {{pos: Vector, vy: number}} */
let ship;
/** @type {Vector[]} */
//let shots;
/** @type {{pos: Vector, vel: Vector}[]} */
//the net
let bombs;
//the fish
let fish;
//distance of fish
let nextfishDist;
// let fuel;
//let colors
let multiplier;
//let mis = ["a", "b", "e", "f"]

function update() {
    if (!ticks) {
    // walls = times(11, (i) => {
    //   return { x: i * 10, height: 10 };
    // });
    //first number will show how many will be printed on the screen
    //
    //height is how high the bottom will be
    walls = times(11, (i) => {
      return { x: i * 10, height: 5 };
    });
    //how high the walls will be
    wallHeight = 10;
    //the iteration between the walls
    wallHeightVel = 0;

    //position of the ship on the map
    ship = { pos: vec(10, 50), vy: 0 };
    //the fish
    fish = [];
    nextfishDist = 10;

    bombs = [];
    // fuel = 50;
    multiplier = 1;
    }
    //const ran = Math.floor(Math.random() * 4);
    //colors = mis[ran]
  const scr = difficulty * 0.3;
  /** @type {Color} */
  // @ts-ignore
  //different changes in the wall
  const wallColor = ["purple", "blue", "green", "red"][floor(ticks / 420) % 4];
  color(wallColor);
  walls.forEach((w) => {
    w.x -= scr;
    if (w.x < -10) {
      w.x += 110;
      wallHeight += wallHeightVel;
      if (
        (wallHeight < 10 && wallHeightVel < 0) ||
        (wallHeight > 50 && wallHeightVel > 0)
      ) {
        wallHeightVel *= -1;
        wallHeight += wallHeightVel;
      } else if (rnd() < 0.2) {
        wallHeightVel = 0;
      } else if (rnd() < 0.3) {
        wallHeightVel = rnd() < 0.5 ? -10 : -5;
      }
      w.height = wallHeight;

    }
    //drawing ou the shape of the walls
    // rect(w.x, 90 - w.height, 9, w.height);
    // rect(w.x, 0, 9, 5);
    rect(w.x, 90 - w.height, 9, w.height);
    rect(w.x, 0, 9, 5);
  });
    color("black");
  if (input.isJustPressed) {

    //how high the ship will go when pressed
    ship.vy -= difficulty * 0.5;

    //bombs.push({ pos: vec(ship.pos), vel: vec(2 * sqrt(difficulty), 0) });
    //changes of how far the bullet travels as well as the curve going of it going down
    bombs.push({ pos: vec(ship.pos), vel: vec(5 * sqrt(2.5), 0.5) });
  }
  ship.vy += 0.015 * difficulty;
  ship.vy *= 0.98;
  ship.pos.y += ship.vy;
  if (
    char(addWithCharCode("c", ship.vy < 0 ? 0 : 1), ship.pos).isColliding.rect[
      wallColor
    ]
  ) {
    play("explosion");
    end();
  }
  color("blue");
  particle(ship.pos.x - 2, ship.pos.y, 0.5, 0.5, PI, PI / 5);

  color("blue");
  remove(bombs, (b) => {
    b.vel.y += 0.1 * difficulty;
    b.vel.mul(0.9);
    b.pos.add(b.vel);
    if (bar(b.pos, 2, 2, b.vel.angle).isColliding.rect[wallColor]) {
      return true;
    }
  });

    color("transparent");
    nextfishDist -= scr;
    if (nextfishDist < 0) {
        for (let i = 0; i < 4; i++) {
            fish.push({ pos: vec(203, rndi(10, 90)), vx: rnd(1, difficulty) * 0.3 });
            nextfishDist = rnd(50, 80) / sqrt(difficulty);
        }
    }
    color("black");
    remove(fish, (f) => {
        //nextfishDist -= scr;
        f.pos.x -= f.vx + scr;
        //change what it is colliding later
        const isBulletCollidingWithFish = char("a", f.pos).isColliding.rect.blue;
        console.log(isBulletCollidingWithFish);

        if (isBulletCollidingWithFish) {
              play("hit");
              color("blue");
              particle(f.pos);
              addScore(multiplier, f.pos);
              multiplier++;
              return true;
            }

        const isShipCollidingWithFish = char("a", f.pos).isColliding.char.c || char("a", f.pos).isColliding.char.d;
        if (isShipCollidingWithFish) {
          end();
        }

        return(isBulletCollidingWithFish || f.pos.x < 0);
    });



  remove(bombs, (b) => {
    const c = bar(b.pos, 2, 2, b.vel.angle).isColliding.char;
    return c.a || c.b;
  });

}