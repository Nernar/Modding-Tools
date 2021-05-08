var code;


Callback.addCallback("PostLoaded", function(){
    code = readFile(__dir__ + "scripts/1.js");
    
});


Callback.addCallback("NativeGuiChanged", function(screenName){
    if(screenName == "hud_screen" || screenName == "in_game_play_screen"){
        if(!container.isOpened()){
            container.openAs(window);
        }
    }
    else{
        container.close() 
    }
});