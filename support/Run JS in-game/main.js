/*
BUILD INFO:
  dir: dev
  target: main.js
  files: 2
*/



// file: commands.js

var ctx = UI.getContext();
var getScreen = __config__.getBool("getscreen");

const run = function(text){
  try{
    eval(text);
  }catch(e){
    Game.message("§4" + e);
  }
}

Callback.addCallback("NativeCommand", function(str){
  var Commands = ["/getscreen","/run"];
  var length = 0;
  for(var i in Commands){
    if(str.substring(0,Commands[i].length) == Commands[i]) length = Commands[i].length;
  }
  if(str.substring(0,length) == Commands[0]){
    Game.prevent();
    if(str.substring(length + 1, str.length)){
      if(str.substring(length + 1, length + 1 + "enable".length) == "enable"){
        getScreen = true;
        Game.message(Translation.translate("gettingScreen"));
      }
      if(str.substring(length + 1, length + 1 + "disable".length) == "disable"){
        getScreen = false;
        Game.message(Translation.translate("notGettingScreen"));
      }
    }else{
      Game.message(Translation.translate("getScreen") + getScreen.toString() + ".");
    }
    return true;
  }
  if(str.substring(0,length) == Commands[1]){
    Game.prevent();
    str.substring(length + 1, str.length) != "" ? run(str.substring(length + 1, str.length)) : MainUI.codeWindow(str.substring(length + 1,str.length));
    return true;
  }
});

const MainUI = {
  codeWindow: function(text){
    ctx.runOnUiThread(new java.lang.Runnable({
      run: function(){
        try{
          const editText = new android.widget.EditText(ctx); 
          editText.setHint(Translation.translate("enterCode2"));
          if(text){
            editText.setText(text);
          }
          new android.app.AlertDialog.Builder(ctx)
            .setTitle(Translation.translate("enterCode1"))
            .setView(editText)
            .setPositiveButton(Translation.translate("runCode"), new android.content.DialogInterface.OnClickListener({
              onClick: function(){
                const keyword = editText.getText() + "";
                run(keyword);
              }
            }
          )
        ).show();
      }catch(e){
        Game.message("§4" + e);
      }}
    }));
  }
};

Callback.addCallback("NativeGuiChanged", function(screenName){
  if(getScreen){
    alert(screenName);
  }
});




// file: translations.js

Translation.addTranslation("gettingScreen", {en: "Now getting screen name.", ru: "Теперь получаю псевдоним."});
Translation.addTranslation("notGettingScreen", {en: "Not getting screen name.", ru: "Не получаю псевдонима."});
Translation.addTranslation("getScreen", {en: "Getting screen name is ", ru: "Получение экранного имени "});
Translation.addTranslation("runCode", {en: "Run", ru: "Бегать"});
Translation.addTranslation("enterCode1", {en: "Enter JavaScript code", ru: "Введите код JavaScript"});
Translation.addTranslation("enterCode2", {en: "in this space", ru: "в этом пространстве"});




