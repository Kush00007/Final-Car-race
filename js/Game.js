class Game {
  constructor() {
    this.resetTittle = createElement("h2")
    this.resetButton = createButton("")
    this.leaderBoardTittle = createElement("h2")
    this.leader1 = createElement("h2")
    this.leader2 = createElement("h2")
    this.playermoving = false
    this.leftkeyactive = false
    this.blast = false
  }
  readgs() {
    database.ref("gameState").on("value", function (data) {
      mygs = data.val()
    })
  }

  updategs(gs) {
    database.ref("/").update({
      gameState: gs
    })
  }
  start() {

    player = new Player();
    player.readpc();

    form = new Form();
    form.display();

    car1 = createSprite(width / 2 - 50, height - 100)
    car1.addImage(car1img)
    car1.scale = 0.07
    car1.addImage("blast", blastImage)

    car2 = createSprite(width / 2 + 100, height - 100)
    car2.addImage(car2img)
    car2.scale = 0.07
    car2.addImage("blast", blastImage)

    cars = [car1, car2]

    fuel = new Group()
    obstacles = new Group()
    powercoins = new Group()

    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2, y: height - 2800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
      { x: width / 2, y: height - 5300, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
    ];
    this.addSprites(obstacles, obstaclesPositions.length, obstacle1Image, 0.04, obstaclesPositions)
    this.addSprites(fuel, 4, fuelImage, 0.02)
    this.addSprites(powercoins, 18, powerCoinImage, 0.09)
  }
  addSprites(groupname, amount, images, scale, position = []) {
    for (var i = 0; i < amount; i++) {
      var x, y
      if (position.length > 0) {
        x = position[i].x
        y = position[i].y
        images = position[i].image
      }
      else {
        x = random(width / 2 + 150, width / 2 - 150)
        y = random(-height * 4.5, height - 400)
      }
      var sprites = createSprite(x, y)
      sprites.addImage(images)
      sprites.scale = scale
      groupname.add(sprites)
    }
  }
  handleFuels(index) {
    cars[index - 1].overlap(fuel, function (collector, collected) {
      player.fuel = 185
      player.updateplayerinfo()
      collected.remove()
    })
    if (player.fuel > 0 && this.playermoving === true) {
      player.fuel -= 0.3
    }
    if (player.fuel <= 0) {
      mygs = 2
      this.gameOver()
    }
  }
  gameOver() {
    swal({
      title: `Game Over`,
      text: "Oops you lost the race....!!!",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Thanks For Playing"
    });
  }
  handlePowerCoins(index) {
    cars[index - 1].overlap(powercoins, function (collector, collected) {
      player.score += 21
      player.updateplayerinfo()
      collected.remove()
    })
  }
  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");
    this.resetTittle.html("RESET")
    this.resetTittle.class("resetText")
    this.resetTittle.position(width / 2 + 200, 40)
    this.resetButton.class("resetButton")
    this.resetButton.position(width / 2 + 230, 100)
    this.leaderBoardTittle.html("Leaderboard")
    this.leaderBoardTittle.class("resetText")
    this.leaderBoardTittle.position(width / 3 - 60, 40)
    this.leader1.class("leadersText")
    this.leader1.position(width / 3 - 50, 80)
    this.leader2.class("leadersText")
    this.leader2.position(width / 3 - 50, 130)
  }
  handleControls() {
    if (this.blast === false) {
      if (keyIsDown(UP_ARROW)) {
        this.playermoving = true
        player.posy += 10
        player.updateplayerinfo()

      }
      if (keyIsDown(LEFT_ARROW) && player.posx > width / 3 - 50) {
        player.posx -= 10
        this.leftkeyactive = true
        player.updateplayerinfo()
      }
      if (keyIsDown(RIGHT_ARROW) && player.posx < width / 2 + 300) {
        player.posx += 10
        this.leftkeyactive = false
        player.updateplayerinfo()
      }
    }
  }
  handleReset() {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        players: {},
        carsatend: 0
      })
      window.location.reload()
    })
  }
  showleaderBoard() {
    var leader1, leader2
    var players = Object.values(allplayers)

    if ((players[0].rank === 0 && players[1].rank === 0) || players[0].rank === 1) {
      leader1 = players[0].rank + "&emsp;" + players[0].name + "&emsp;" + players[0].score
      leader2 = players[1].rank + "&emsp;" + players[1].name + "&emsp;" + players[1].score
    }
    if (players[1].rank === 1) {
      leader1 = players[1].rank + "&emsp;" + players[1].name + "&emsp;" + players[1].score
      leader2 = players[0].rank + "&emsp;" + players[0].name + "&emsp;" + players[0].score
    }
    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }
  play() {
    this.handleElements()
    this.handleReset()
    Player.getplayerinfo()
    player.getcarsatend()

    if (allplayers !== undefined) {
      image(trackimg, 0, -height * 5, width, height * 6)


      var index = 0
      for (var plr in allplayers) {
        index = index + 1
        var x = allplayers[plr].posx;
        var y = height - allplayers[plr].posy;
        var currentlife = allplayers[plr].life;
        if (currentlife <= 0) {
          cars[index - 1].changeImage("blast")
          cars[index - 1].scale = 0.3
        }

        cars[index - 1].position.x = x
        cars[index - 1].position.y = y

        if (index === player.index) {
          stroke(10)
          fill("red")
          ellipse(x, y, 60, 60)
          this.handleFuels(index)
          this.handlePowerCoins(index)
          this.handleobstacleCollision(index)
          this.handlecarsCollision(index)
          if (player.life <= 0) {
            this.blast = true
            this.playermoving = false
            this.end()
          }
          camera.position.y = cars[index - 1].position.y
        }
        this.showLife()
        this.showFuelBar()
        this.showleaderBoard()

      }
      if (this.playermoving === true) {
        player.posy += 5
        player.updateplayerinfo()

      }


      this.handleControls()
      const finishline = height * 6 - 100
      if (player.posy > finishline) {
        mygs = 2
        player.rank += 1
        Player.updatecarsatend(player.rank)
        console.log(player.rank)
        player.updateplayerinfo()
        this.showRank()
      }

      drawSprites()
    }
  }
  handlecarsCollision(index) {
    if (index === 1) {
      if (cars[index - 1].collide(cars[1])) {
        if (this.leftkeyactive === true) {
          player.posx += 100
        }
        else {
          player.posx -= 100
        }
        if (player.life > 0) {
          player.life -= 185 / 4
        }
        player.updateplayerinfo()
      }

    }
    if (index === 2) {
      if (cars[index - 1].collide(cars[0])) {
        if (this.leftkeyactive === true) {
          player.posx += 100
        }
        else {
          player.posx -= 100
        }
        if (player.life > 0) {
          player.life -= 185 / 4
        }
        player.updateplayerinfo()
      }
    }
  }
  handleobstacleCollision(index) {
    if (cars[index - 1].collide(obstacles)) {
      if (this.leftkeyactive === true) {
        player.posx += 100
      }
      else {
        player.posx -= 100
      }
      if (player.life > 0) {
        player.life -= 185 / 4
      }
      player.updateplayerinfo()
    }
  }
  showRank() {
    swal({
      title: `Awesome!${"\n"}Rank${"\n"}${player.rank}`,
      text: "You reached the finish line successfully",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok"
    });
  }
  showLife() {
    push()
    image(lifeImage, width / 2 - 130, height - player.posy - 400, 20, 20)
    fill("white")
    rect(width / 2 - 100, height - player.posy - 400, 185, 20)
    fill("red")
    rect(width / 2 - 100, height - player.posy - 400, player.life, 20)
    pop()
  }
  showFuelBar() {
    push()
    image(fuelImage, width / 2 - 130, height - player.posy - 350, 20, 20)
    fill("white")
    rect(width / 2 - 100, height - player.posy - 350, 185, 20)
    fill("gold")
    rect(width / 2 - 100, height - player.posy - 350, player.fuel, 20)
    pop()
  }
  end()
  {
    swal({
      title: `Game Over`,
      text: "Click The reset Button To Play Again Or Refresh The Page",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Thanks For Playing"
    });
    console.log("end")
  }
}