/**
*	Opens a tab, displaying their content. 
*	Will start the game if the game tab is opened.
*	Help from https://www.w3schools.com/howto/howto_js_tabs.asp, 
*
*	@param event - the onclick event
*	@param name - the name of the tab that was clicked on
*/
function openTab(event, name) {
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	document.getElementById(name).style.display = "block";
	event.currentTarget.className += " active";

	//If we're on the game tab, start the game up
	if(name == "Game"){
		startGame();
	}

}