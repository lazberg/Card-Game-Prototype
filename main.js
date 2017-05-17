var gameRunning = false;
var turnOrder = 0;
var turnCounter = 0;
var textArea = document.getElementById("console");
var br = "\n";
var playerHand = [];
var botHand = [];
//CARD EFFECTS
var damage = 0;
var heal = 1;
var armor = 2;
var buff = 3;
//CARDS
var cardDamageOne = {cardName:"Firebolt", cardDescription:"deals 1 damage to the opponent.", cardEffect:damage, cardAmount:1, cardAction:"normal"};
var cardHealOne = {cardName:"Rejuvenation", cardDescription:"restores 1 hit point of yours.", cardEffect:heal, cardAmount:1, cardAction:"normal"};
var cardArmorOne = {cardName:"Divine Shield", cardDescription:"grants you 1 armor.", cardEffect:armor, cardAmount:1, cardAction:"normal"};
var cardBonusOne = {cardName:"Attunement", cardDescription:"adds 1 damage to your next attack this turn.", cardEffect:buff, cardAmount:1, cardAction:"bonus"};
//DECKS
var deck1 = [cardDamageOne, cardDamageOne, cardHealOne, cardHealOne, cardArmorOne, cardBonusOne];
var deck2 = [cardDamageOne, cardDamageOne, cardHealOne, cardHealOne, cardArmorOne, cardBonusOne];
//PLAYER STATS
var playerHealth = 0;
var playerArmor = 0;
var botHealth = 0;
var botArmor = 0;
var actionNormal = 0;
var actionBonus = 0;
//COMBAT STATS
var bonusDamage = 0;
//AI
var botPlayHealing = true;
var botPlayArmor = true;
//CURRENT CARD
var currentCard = 0;
var chosenCard = 0;
//RULE STATS
var maxHealth = 3;
var startHealth = 3;
var startHand = 3;


function StartGame(){
	if(!gameRunning) {
		textArea = document.getElementById("console");
		gameRunning = true;
		textArea.innerHTML+="Starting Game..."+br;
		RollInitiative();
		GameManager();
	}
	else {
		return;
	}
}

function RollInitiative() {
	playerHand=[];
	botHand=[];
	deck1 = [cardDamageOne, cardDamageOne, cardDamageOne,cardDamageOne, cardDamageOne,   cardHealOne, cardHealOne, cardArmorOne, cardBonusOne];
	deck2 = [cardDamageOne, cardDamageOne,  cardDamageOne,cardDamageOne, cardDamageOne,  cardHealOne, cardHealOne, cardArmorOne, cardBonusOne];
	turnCounter = 0;
	turnOrder = 0;
	playerHealth = startHealth;
	playerArmor = 0;
	botHealth = startHealth;
	botArmor = 0;
	DrawHand();
}

function Dice(d) {
	return Math.floor(Math.random() * (d-1 + 1)) /*+ 1*/;
}

function DrawHand(){
	for (var i = 0;i<startHand;i++){
		var j = Dice(deck1.length)
		playerHand.push(deck1[j]);
		deck1.splice(j,1);
	}
	for (var i = 0;i<startHand;i++){
		var j = Dice(deck2.length)
		botHand.push(deck2[j]);
		deck2.splice(j,1);
	}
}

function DrawCard(player){
	if (player==0){
		if(deck1.length>0){
			var j = Dice(deck1.length)
			playerHand.push(deck1[j]);
			deck1.splice(j,1);
		}
		else {
			return;
		}
	}
	if (player==1){
		if(deck2.length>0){
			var j = Dice(deck2.length)
			botHand.push(deck2[j]);
			deck2.splice(j,1);
		}
		else {
			return;
		}
	}
}

function ClearText() {
	textArea.innerHTML="";
	document.getElementById("playerInput").value = "";
}

function StopGame() {
	if(gameRunning) {
		gameRunning = false;
		textArea.innerHTML+="Stopping Game..."+br;
		GameManager();
	}
}

function UpdateHealth() {
	document.getElementById("playerHealth").innerHTML = "Player HP: "+playerHealth+" ("+playerArmor+" armor)";
	document.getElementById("botHealth").innerHTML 	=  "Bot HP: "+botHealth+" ("+botArmor+" armor)";
}

function GameManager() {
	if(gameRunning) {
		document.getElementById("startButton").disabled = true;
		document.getElementById("stopButton").disabled = false;
		UpdateHealth();
		if(turnOrder==0) {
			PlayerOne();
		}
		else if(turnOrder==1) {
			PlayerTwo();
		}
	}
	else if(!gameRunning) {
		document.getElementById("startButton").disabled = false;
		document.getElementById("stopButton").disabled = true;
		document.getElementById("playerInput").disabled = true;
		document.getElementById("playerInputSubmit").disabled = true;
	}
}

function DeckList() {
	for(var i = 0;i<playerHand.length;i++){
		textArea.innerHTML += (i+1)+". "+playerHand[i].cardName+", which "+playerHand[i].cardDescription+" ("+playerHand[i].cardAction+" action)"+br;
	}
}

function PlayerOne() {
	turnCounter++;
	DrawCard(0);
	textArea.innerHTML += "======================== TURN "+turnCounter+br;
	actionNormal = 1;
	actionBonus = 1;
	bonusDamage = 0;
	textArea.innerHTML += "Your Turn!"+br+br+"Your current hand:"+br;
	DeckList();
	textArea.innerHTML += br+"Please input the number of the card you wish to play below, or 'end' to end your turn!"+br;
	textArea.scrollTop = textArea.scrollHeight;
	document.getElementById("playerInput").disabled = false;
	document.getElementById("playerInputSubmit").disabled = false;
}

function PlayCard() {
	currentCard = document.getElementById("playerInput").value;
	if (currentCard == "end"){
		NextPlayer();
	}
	else if (currentCard<(playerHand.length+1)) {
		chosenCard = playerHand[currentCard-1];
		if (chosenCard.cardAction=="normal"&&actionNormal<=0){
			textArea.innerHTML+="You have already played a normal action card this turn!"+br;
			textArea.scrollTop = textArea.scrollHeight;
			return;
		}
		if (chosenCard.cardAction=="bonus"&&actionBonus<=0){
			textArea.innerHTML+="You have already played a bonus action card this turn!"+br;
			textArea.scrollTop = textArea.scrollHeight;
			return;
		}
		PlayingCard();
		textArea.scrollTop = textArea.scrollHeight;
	}
	else {
		textArea.innerHTML+=br+"Insert a valid number, please."+br;
		textArea.scrollTop = textArea.scrollHeight;
	}
	return;
}

function PlayingCard(){
	textArea.innerHTML+=br+"Playing "+chosenCard.cardName+"!"+br+br;
	// DAMAGE
	if(chosenCard.cardEffect == 0) {
		var totalDamage = chosenCard.cardAmount+bonusDamage;
		textArea.innerHTML+="Dealing "+totalDamage+" to the enemy."+br;
		if(botArmor>0){
			botArmor=0;
			totalDamage--;
			textArea.innerHTML+="The enemy had armor on, which caused the attack to deal less damage!"+br;
		}
		botHealth -= totalDamage;
		textArea.innerHTML += "Enemy HP: "+botHealth+"/"+startHealth+" (-"+totalDamage+")"+br;
		BonusNormal();
		UpdateHealth();
		CheckVictory();
	}
	// HEAL
	else if(chosenCard.cardEffect == 1) {
		if(playerHealth == maxHealth){
			textArea.innerHTML += "Already at max health!"+br;
		}
		else if((playerHealth+chosenCard.cardAmount)>=maxHealth){
			playerHealth=maxHealth;
			textArea.innerHTML +="Current HP: "+playerHealth+"/"+maxHealth+br;
			BonusNormal();
			UpdateHealth();
		}
		else {
			playerHealth += chosenCard.cardAmount;
			textArea.innerHTML +="Current HP: "+playerHealth+"/"+maxHealth+br;
			BonusNormal();
			UpdateHealth();
		}
	}
	// ARMOR
	else if(chosenCard.cardEffect == 2) {
		if(playerArmor>=1){
			textArea.innerHTML += "Already at max armor!"+br;
			UpdateHealth();
		}
		else {
			playerArmor+=chosenCard.cardAmount;
			textArea.innerHTML += "Armor is now "+playerArmor+"."+br;
			BonusNormal();
			UpdateHealth();
		}
	}
	// BUFF
	else if(chosenCard.cardEffect == 3) {
		bonusDamage = chosenCard.cardAmount;
		textArea.innerHTML += "Next attack is enhanced by "+chosenCard.cardAmount+"."+br;
		BonusNormal();
		UpdateHealth();
	}
}

function PlayingBotCard(){
	// DAMAGE
	if(chosenCard.cardEffect == 0) {
		textArea.innerHTML+=br+"Bot is playing "+chosenCard.cardName+"!"+br+br;
		var totalDamage = chosenCard.cardAmount;
		textArea.innerHTML+="Dealing "+totalDamage+" to you."+br;
		if(playerArmor>0){
			playerArmor=0;
			totalDamage--;
			textArea.innerHTML+="You had armor on, which caused the attack to deal less damage!"+br;
		}
		playerHealth -= totalDamage;
		textArea.innerHTML += "Your HP: "+playerHealth+"/"+startHealth+" (-"+totalDamage+")"+br;
		BonusNormal();
		UpdateHealth();
		CheckVictory();
	}
	// HEAL
	else if(chosenCard.cardEffect == 1 && botPlayHealing == true) {
		if(botHealth == maxHealth){
			botPlayHealing = false;
		}
		else if((botHealth+chosenCard.cardAmount)>=maxHealth){
			textArea.innerHTML+=br+"Bot is playing "+chosenCard.cardName+"!"+br+br;
			botHealth=maxHealth;
			textArea.innerHTML +="Current HP: "+botHealth+"/"+maxHealth+br;
			BonusNormal();
			UpdateHealth();
		}
		else {
			textArea.innerHTML+=br+"Bot is playing "+chosenCard.cardName+"!"+br+br;
			botHealth += chosenCard.cardAmount;
			textArea.innerHTML +="Current HP: "+botHealth+"/"+maxHealth+br;
			BonusNormal();
			UpdateHealth();
		}
	}
	// ARMOR
	else if(chosenCard.cardEffect == 2 && botPlayArmor == true) {
		if(botArmor>=1){
			botPlayArmor = false;
			UpdateHealth();
		}
		else {
			textArea.innerHTML+=br+"Bot is playing "+chosenCard.cardName+"!"+br+br;
			botArmor+=chosenCard.cardAmount;
			textArea.innerHTML += "Bot's armor is now "+playerArmor+"."+br;
			BonusNormal();
			UpdateHealth();
		}
	}
	// BUFF
	else if(chosenCard.cardEffect == 3) {
		bonusDamage = chosenCard.cardAmount;
		textArea.innerHTML += "Next attack is enhanced by "+chosenCard.cardAmount+"."+br;
		BonusNormal();
		UpdateHealth();
	}
}

function NextPlayer() {
	if(turnOrder==0){
		turnOrder=1;
		document.getElementById("playerInput").disabled = true;
		document.getElementById("playerInputSubmit").disabled = true;
		PlayerTwo();
	}
	else if(turnOrder==1) {
		turnOrder=0;
		PlayerOne();
	}
}

function PlayerTwo() {
	turnCounter++;
	DrawCard(1);
	textArea.innerHTML += "======================== TURN "+turnCounter+br;
	actionNormal = 1;
	actionBonus = 1;
	bonusDamage = 0;
	botPlayHealing = true;
	botPlayArmor = true;
	textArea.innerHTML += "Opponent's Turn!"+br+br;
	
	if(botHealth < maxHealth){
		for(var i = 0;i<botHand.length;i++){
			if (botHand[i].cardEffect==1){
				chosenCard=botHand[i];
				PlayingBotCard();
				break;
			}
		}
	}
	
	if(actionBonus>=1){
		for(var i = 0;i<botHand.length;i++){
			if (botHand[i].cardAction=="bonus"){
				chosenCard=botHand[i];
				PlayingBotCard();
				console.log("ree");
				if(actionBonus==0){
					break;
				}
			}
		}
		actionBonus--;
	}
	
	if(actionNormal>=1){
		for(var i = 0;i<botHand.length;i++){
			if (botHand[i].cardAction=="normal"){
				chosenCard=botHand[i];
				PlayingBotCard();
				if(actionNormal==0){
					break;
				}
				console.log("roo");
			}
		}
		actionNormal--;
	}
	
	if(gameRunning){
		textArea.scrollTop = textArea.scrollHeight;
		NextPlayer();
	}
}

function Command() {
	console.log(document.getElementById("commandLine").value.toString());
	var commandInput = document.getElementById("commandLine").value.toString();
	if (commandInput.substr(0,3) == "bot"){
		if (commandInput.substr(3,6) == "health") {
			botHealth=commandInput.substr(9,1);
			UpdateHealth();
		}
		if (commandInput.substr(3,5) == "armor") {
			botArmor=commandInput.substr(8,1);
			UpdateHealth();
		}
	}
	if (commandInput.substr(0,3) == "you"){
		if (commandInput.substr(3,6) == "health") {
			playerHealth=commandInput.substr(9,1);
			UpdateHealth();
		}
		if (commandInput.substr(3,5) == "armor") {
			playerArmor=commandInput.substr(8,1);
			UpdateHealth();
		}
	}
}

function BonusNormal() {
	if(chosenCard.cardAction=="normal"){
		if(turnOrder==0){
			playerHand.splice((currentCard-1),1);
			DeckList();
		}
		else if(turnOrder==1){
			botHand.splice((currentCard-1),1);
		}
		console.log("aaa");
		actionNormal--;
	}
	else if(chosenCard.cardAction=="bonus"){
		if(turnOrder==0){
			playerHand.splice((currentCard-1),1);
			DeckList();		
		}
		else if(turnOrder==1){
			botHand.splice((currentCard-1),1);
		}
		actionBonus--;
	}
}

function CheckVictory() {
	textArea.scrollTop = textArea.scrollHeight;
	if (playerHealth <=0) {
		textArea.innerHTML += "COMPUTER WINS! Better luck next time!"+br+br;
		StopGame();
	}
	if (botHealth <=0) {
		textArea.innerHTML += "PLAYER WINS!"+br+br;
		StopGame();
	}
}