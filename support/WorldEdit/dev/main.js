const IS_HORIZON = getCoreAPILevel() > 8;
var selectedAreaRenderMultiply = IS_HORIZON ? 16 : 1;

var WorldEdit = {
    wand:true,
    limit:-1,
    
    pos1:{x:Infinity,y:Infinity,z:Infinity},
    pos2:{x:Infinity,y:Infinity,z:Infinity},
    
    sp1:{x:Infinity,y:Infinity,z:Infinity},
    sp2:{x:Infinity,y:Infinity,z:Infinity},
    
    undo:[],
    redo:[],
    
    copy:[],
    
    getSizeArea:function(){
        if(!WorldEdit.getValidPosition())return 1;
        
        var x = this.pos2.x - this.pos1.x +1;
        var y = this.pos2.y - this.pos1.y +1;
        var z = this.pos2.z - this.pos1.z +1;
        return Math.abs(x*y*z);
    },
    
    getValidPosition:function(){
        if(WorldEdit.pos1.x == Infinity || WorldEdit.pos1.y == Infinity || WorldEdit.pos1.z == Infinity || WorldEdit.pos2.x == Infinity || WorldEdit.pos2.y == Infinity || WorldEdit.pos2.z == Infinity)
            return false;
        
        return true;
    },
    
    selectPosition:function(p1,p2){
        if(p1!=null){
            WorldEdit.sp1 = p1;
        }
        if(p2!=null){
            WorldEdit.sp2 = p2;
        }
        
        if(WorldEdit.sp1.x > WorldEdit.sp2.x){
            WorldEdit.pos2.x = WorldEdit.sp1.x;
            WorldEdit.pos1.x = WorldEdit.sp2.x;
        }else{
            WorldEdit.pos2.x = WorldEdit.sp2.x;
            WorldEdit.pos1.x = WorldEdit.sp1.x;
        }
        
        if(WorldEdit.sp1.y > WorldEdit.sp2.y){
            WorldEdit.pos2.y = WorldEdit.sp1.y;
            WorldEdit.pos1.y = WorldEdit.sp2.y;
        }else{
            WorldEdit.pos2.y = WorldEdit.sp2.y;
            WorldEdit.pos1.y = WorldEdit.sp1.y;
        }
        
        if(WorldEdit.sp1.z > WorldEdit.sp2.z){
            WorldEdit.pos2.z = WorldEdit.sp1.z;
            WorldEdit.pos1.z = WorldEdit.sp2.z;
        }else{
            WorldEdit.pos2.z = WorldEdit.sp2.z;
            WorldEdit.pos1.z = WorldEdit.sp1.z;
        }   
    
         setSelectedArea();
    },
    
    getMessageSize:function(count, type){
        if(!type)type=1;
        var a = count;
        a = a%100;
        if(a<10 || a > 20){
            a = a%10;
            if(a==1)
                return Translation.translate(type==1?"%count% block changed.":"%count% block.").replace("%count%", count);
            else
                return Translation.translate(type==1?"%count% blocks changed.":"%count% blocks.").replace("%count%", count);
        }else
            return Translation.translate(type==1?"%count% blocks changed.":"%count% blocks.").replace("%count%", count);
        
    },

    getValidLimit:function(count){
        if(this.limit == -1 || this.limit > count)
            return true;
        
        return false;
    }
}


if(IS_HORIZON){
    Callback.addCallback("DestroyBlock", function (coords, block, player) {
        if(Game.getGameMode() == 1 && Player.getCarriedItem().id == getWand() && WorldEdit.wand == true){
            Commands["//pos2"].func([coords.x, coords.y, coords.z]);
            Game.prevent();
        }
    });
}else{
    Game.getGameMode = function(){ return 0; }
    function runOnMainThread(func){ func(); }
}

function thread(call){
    var a = new java.lang.Thread(new java.lang.Runnable({
        run:function(){
            call();
        }
    }));
    return a;
};

function getWand(){
    if(__config__.access("wand_stick")==true)
        return 280;//Палка
    else
        return 271;//Деревянный топорик
}

function getGetIdWand(){
    if(__config__.access("wand_stick")==true)
        return 288;//Перо
    else
        return 268;//Деревянный меч
}

var Commands = {
    /** Общие команды **/
    "//help":{
        name:"//help",
        description:"Help.",
        args:"[page/command]",
        func:function(args){
            var page = args[0] ? parseInt(args[0]) : 1;
            if(isNaN(page)){
                var cmd = args[0];
                if(Commands.hasOwnProperty("//"+args[0])){
                    cmd = "//"+args[0];
                }
                
                if(Commands.hasOwnProperty(cmd)){
                    cmd = Commands[cmd];
                    
                    var message = cmd.name+" ";
                    if(cmd.args != null)message+= cmd.args+" ";
                    message+= "- "+Translation.translate(cmd.description);
                    
                    Game.message(message);
                }else{
                    Game.message(Translation.translate("There is no such command."));
                }
            }else{
                var _page = page - 1;
                var message = "";
                var count = 0;
                for(var i in Commands){
                    count++;
                    if(count <= 6*_page && count > 6*page)continue;
                    var cmd = Commands[i];
                    message+= cmd.name+" ";
                    if(cmd.args != null)
                        message+= cmd.args+" ";
                    message+= "- "+Translation.translate(cmd.description)+"\n";
                }
                Game.message(Translation.translate("===Help [Page %page%]===\n%cmd%===Help [Page %page%]===").replace(/(%page%)/g, page).replace("%cmd%", message));
            }
        }
    },
    "//?":{
        name:"//?",
        description:"Help.",
        args:"[page/command]",
        func:function(args){
            Commands["//help"].func(args);
        }
    },
    "//limit":{
        name:"//limit",
        description:"Set the maximum number of <limit> blocks used for commands. Acts only on you. Used to prevent catastrophic incidents.",
        args:"<limit>",
        func:function(args){
            if(!args[0] || isNaN(parseInt(args[0])) ){
                return Game.message(Translation.translate("Don't valid command."));
            }
            var a = parseInt(args[0]);
            WorldEdit.limit = a;
            Game.message(Translation.translate("The maximum number of blocks used with the commands %blocks%.").replace(/(%blocks%)/g, a));
        }
    },
    /** Перемещение **/
    /** Операции с биомами **/
    /** Создание **/
    /** Выделение **/
    "//pos1":{
        name:"//pos1",
        description:"Set selection position #1 to the block above the one that you are standing on.",
        args:"[<x> <y> <z>]",
        func:function(args){
            if(args[0] === undefined){
                var coords = Player.getPosition();
                coords.x = Math.round(coords.x);
                coords.y = Math.round(coords.y);
                coords.z = Math.round(coords.z);
                WorldEdit.selectPosition(coords, null);          
                Game.message(Translation.translate("The first position is set to %x%,%y%,%z%.").replace("%x%",coords.x).replace("%y%",coords.y).replace("%z%",coords.z));
                Game.message(Translation.translate("The selected region is %sizeArea%").replace("%sizeArea%", WorldEdit.getMessageSize(WorldEdit.getValidPosition()?WorldEdit.getSizeArea():1,0)));
            }else{
                if(args[1] === undefined || args[2] === undefined){
                    return Game.message(Translation.translate("Don't valid command."));
                }else{
                    WorldEdit.selectPosition({x:Math.round(args[0]),y:Math.round(args[1]),z:Math.round(args[2])},null);
                    
                    Game.message(Translation.translate("The first position is set to %x%,%y%,%z%.").replace("%x%",args[0]).replace("%y%",args[1]).replace("%z%",args[2]));
                    Game.message(Translation.translate("The selected region is %sizeArea%").replace("%sizeArea%", WorldEdit.getMessageSize(WorldEdit.getValidPosition()?WorldEdit.getSizeArea():1,0)));
                }
            }
        }
    },
    "//pos2":{
        name:"//pos2",
        description:"Set selection position #2 to the block above the one that you are standing on.",
        args:"[<x> <y> <z>]",
        func:function(args){
            if(args[0] === undefined){
                var coords = Player.getPosition();
                coords.x = Math.round(coords.x);
                coords.y = Math.round(coords.y);
                coords.z = Math.round(coords.z);
                WorldEdit.selectPosition(null, coords);
                Game.message(Translation.translate("The second position is set to %x%,%y%,%z%.").replace("%x%",coords.x).replace("%y%",coords.y).replace("%z%",coords.z));
                Game.message(Translation.translate("The selected region is %sizeArea%").replace("%sizeArea%", WorldEdit.getMessageSize(WorldEdit.getValidPosition()?WorldEdit.getSizeArea():1,0)));
            }else{
                if(args[1] === undefined || args[2] === undefined){
                    return Game.message(Translation.translate("Don't valid command."));
                }else{
                    WorldEdit.selectPosition(null,{x:Math.round(args[0]),y:Math.round(args[1]),z:Math.round(args[2])});
                    
                    Game.message(Translation.translate("The second position is set to %x%,%y%,%z%.").replace("%x%",args[0]).replace("%y%",args[1]).replace("%z%",args[2]));
                    Game.message(Translation.translate("The selected region is %sizeArea%").replace("%sizeArea%", WorldEdit.getMessageSize(WorldEdit.getValidPosition()?WorldEdit.getSizeArea():1,0)));
                }
            }
        }
    },
    "//wand":{
        name:"//wand",
        description:"Gives you the \"EditWand\" (by default, a wooden axe).",
        args:"",
        func:function(){
            Player.addItemToInventory(getWand(), 1);
        },
    },
    "//toggleeditwand":{
        name:"//toggleeditwand",
        description:"Toggles the edit wand selection mode, allowing you to use the edit wand item normally.",
        args:"",
        func:function(){
            WorldEdit.wand = !WorldEdit.wand;
            Game.message(Translation.translate("Mode wand edit switched."));
        }
    },
    "//desel":{
        name:"//desel",
        description:"Deselects the current selection.",
        args:"",
        func:function(){
    		WorldEdit.selectPosition(
    			{x:Infinity,y:Infinity,z:Infinity},
    			{x:Infinity,y:Infinity,z:Infinity}
    		);
            Game.message(Translation.translate("The current selection is canceled."));
        }
    },
    "//size":{
        name:"//size",
        description:"Get size area.",
        args:"[-с]",
        func:function(args){
            if(args[0] == "-c"){
                Game.message(WorldEdit.getMessageSize(WorldEdit.copy.length, 0));
            }else{
                Game.message(WorldEdit.getMessageSize(WorldEdit.getSizeArea(), 0));
            }
        }
    },
    /** Операции с регионом **/
    "//replace":{
        name:"//replace",
        description:"Replace all blocks of the specified block(s) with another block inside the region.",
        args:"[from_block] <to_block>",
        func:function(args){
            runOnMainThread(function(){
                if(!args[0])
                    return Game.message(Translation.translate("Don't valid command."));
                    
                if(!WorldEdit.getValidPosition())
                    return Game.message(Translation.translate("Set both positions."));
                
                
                var count = 0;
                var undo = [];
                var pos1 = {x:WorldEdit.pos1.x,y:WorldEdit.pos1.y,z:WorldEdit.pos1.z};
                var pos2 = {x:WorldEdit.pos2.x,y:WorldEdit.pos2.y,z:WorldEdit.pos2.z};

                for(var x = pos1.x; x <= pos2.x; x++){
                    if(!WorldEdit.getValidLimit(count)) break;
                    for(var y = pos1.y; y <= pos2.y; y++){
                        if(!WorldEdit.getValidLimit(count)) break;
                        for(var z = pos1.z; z <= pos2.z; z++){
                            if(!WorldEdit.getValidLimit(count)) break;

                            undo.push([x,y,z,World.getBlock(x, y, z).id,World.getBlock(x, y, z).data]);
                            if(!args[1]){
                                var block = args[0].split(":");
                                var id = parseInt(block[0]);
                                var data = block[1]?parseInt(block[1]):0;
                                if(World.getBlock(x, y, z).id!=0){
                                    World.setBlock(x, y, z, id, data);
                                    count++;
                                }
                            }else{
                                var block = args[0].split(":");
                                var id = parseInt(block[0]);
                                var data = block[1]?parseInt(block[1]):-1;
                                if(World.getBlock(x, y, z).id == id && (data == -1 || World.getBlock(x, y, z).data == data)){
                                    var block2 = args[1].split(":");
                                    var id2 = parseInt(block2[0]);
                                    var data2 = block2[1] ? parseInt(block2[1]) :0;
                                    World.setBlock(x, y, z, id2, data2);
                                    count++;
                                }
                                
                            }
                        }   
                    }
                }
                WorldEdit.undo.push(undo);
                
                Game.message(WorldEdit.getMessageSize(count));
            })
        }
    },
    "//set":{
        name:"//set",
        description:"Set all blocks inside the selection region to a specified block.",
        args:"<block>",
        func:function(args){
            runOnMainThread(function(){
                if(!args[0])
                    return Game.message(Translation.translate("Don't valid command."));
                    
                if(!WorldEdit.getValidPosition())
                    return Game.message(Translation.translate("Set both positions."));

                var block = args[0].split(":");
                var id = parseInt(block[0]);
                var data = block[1]?parseInt(block[1]):0;
                var undo = [];
                var count = 0;
                var pos1 = {x:WorldEdit.pos1.x,y:WorldEdit.pos1.y,z:WorldEdit.pos1.z};
                var pos2 = {x:WorldEdit.pos2.x,y:WorldEdit.pos2.y,z:WorldEdit.pos2.z};

                for(var x = pos1.x; x <= pos2.x; x++){
                    if(!WorldEdit.getValidLimit(count)) break;
                    for(var y = pos1.y; y <= pos2.y; y++){
                        if(!WorldEdit.getValidLimit(count)) break;
                        for(var z = pos1.z; z <= pos2.z; z++){
                            if(!WorldEdit.getValidLimit(count)) break;
                            
                            let tile = World.getBlock(x, y, z);

                            undo.push([x,y,z, tile.id, tile.data]);
                            World.setBlock(x, y, z, id, data);
                            
                            count++;
                        }   
                    }
                }
                WorldEdit.undo.push(undo);
                
                var a = WorldEdit.getSizeArea();
                Game.message(WorldEdit.getMessageSize(a));
            });
        }
    },
    /** Операции с чанками **/
    /** Операции с буфером обмена **/
    "//copy":{
        name:"//copy",
        description:"Copy the selected area.",
        args:"[-a]",
        func:function(args){
            var air = args.indexOf("-a")!=-1?true:false;
            WorldEdit.copy = [];
            var count = 0;
            for(var x = WorldEdit.pos1.x; x <= WorldEdit.pos2.x; x++){
                for(var y = WorldEdit.pos1.y; y <= WorldEdit.pos2.y; y++){
                    for(var z = WorldEdit.pos1.z; z <= WorldEdit.pos2.z; z++){
                        var block = World.getBlock(x, y, z);
                        var coord = Player.getPosition();
                        coord.x = Math.round(coord.x);
                        coord.y = Math.round(coord.y);
                        coord.z = Math.round(coord.z);
                        if(block.id == 0 && air == false)continue;
                        WorldEdit.copy.push([coord.x - x, coord.y - y, coord.z - z,block]);
                        count++;
                    }   
                }
            }
            
            Game.message(Translation.translate("Region copied."));
        },
    },
    "//cut":{
        name:"//cut",
        description:"Cut the selected area.",
        args:"[-a]",
        func:function(args){
            runOnMainThread(function(){
                var air = args.indexOf("-a")!=-1?true:false;
                WorldEdit.copy = [];
                var count = 0;
                var pos1 = {x:WorldEdit.pos1.x,y:WorldEdit.pos1.y,z:WorldEdit.pos1.z};
                var pos2 = {x:WorldEdit.pos2.x,y:WorldEdit.pos2.y,z:WorldEdit.pos2.z};

                for(var x = pos1.x; x <= pos2.x; x++){
                    for(var y = pos1.y; y <= pos2.y; y++){
                        for(var z = pos1.z; z <= pos2.z; z++){

                            var block = World.getBlock(x, y, z);
                            var coord = Player.getPosition();
                            coord.x = Math.round(coord.x);
                            coord.y = Math.round(coord.y);
                            coord.z = Math.round(coord.z);
                            if(block.id == 0 && air == false)continue;
                            WorldEdit.copy.push([coord.x - x, coord.y - y, coord.z - z,block]);
                            World.setBlock(x,y,z,0,0);
                            count++;
                        }   
                    }
                }
                
                Game.message(Translation.translate("Region cut."));
            });
        },
    },
    "//paste":{
        name:"//paste",
        description:"Paste the copied area.",
        args:"",
        func:function(args){
            if(WorldEdit.copy.length==0)return;
            runOnMainThread(function(){
                var copy = WorldEdit.copy;
                var count = 0;
                
                for(var i = 0; i < copy.length; i++){
                    var coord = Player.getPosition();
                    coord.x = Math.round(coord.x);
                    coord.y = Math.round(coord.y);
                    coord.z = Math.round(coord.z);
                    World.setBlock( coord.x - copy[i][0],
                                    coord.y - copy[i][1],
                                    coord.z - copy[i][2], copy[i][3].id, copy[i][3].data);
                    count++;
                }
                
                Game.message(WorldEdit.getMessageSize(count));
            });
        }
    },

    /** Управление снимками **/
    /** Управление историей действий **/
    "//undo":{
        name:"//undo",
        description:"Undo your last action.",
        args:"",
        func:function(){
            if(WorldEdit.undo.length == 0)return;
            runOnMainThread(function(){
                var undo = WorldEdit.undo[WorldEdit.undo.length-1];
                WorldEdit.redo = [];
                var count = 0;
                for(var i = 0; i < undo.length; i++){
                    WorldEdit.redo.push([undo[i][0], undo[i][1], undo[i][2],World.getBlock(undo[i][0], undo[i][1], undo[i][2]).id,World.getBlock(undo[i][0], undo[i][1], undo[i][2]).data]);
                    count++;
                    World.setBlock(undo[i][0], undo[i][1], undo[i][2], undo[i][3], undo[i][4]);
                }
                WorldEdit.undo.pop();
                Game.message(WorldEdit.getMessageSize(count));
            });
        },
    },
    "//redo":{
        name:"//redo",
        description:"Redo your last (undone) action. This command replays back history and does not repeat the command.",
        args:"",
        func:function(){
            runOnMainThread(function(){
                var redo = WorldEdit.redo;
                if(redo.length == 0)return;
                var count = 0;
                for(var i = 0; i < redo.length; i++){
                    count++;
                    World.setBlock(redo[i][0], redo[i][1], redo[i][2], redo[i][3], redo[i][4]);
                }
                
                Game.message(WorldEdit.getMessageSize(count));
            });
        },
    },
    "//clearhistory":{
        name:"//clearhistory",
        description:"Clear your history.",
        args:"",
        func:function(){
            WorldEdit.undo = [];
            WorldEdit.redo = [];
            Game.message(Translation.translate("History cleared."));
        },
    },
    /** Суперкирка **/
    /** Инструменты **/
    /** Утилиты **/

    /** Other **/
    "//box":{
        name:"//box",
        description:"Build walls, floor, and ceiling.",
        args:"<block>",
        func:function(args){
            runOnMainThread(function(){
                if(!args[0])
                    return Game.message(Translation.translate("Don't valid command."));
                    
                if(!WorldEdit.getValidPosition())
                    return Game.message(Translation.translate("Set both positions."));
                
                var count = 0;
                var block = args[0].split(":");
                var id = parseInt(block[0]);
                var data = block[1]?parseInt(block[1]):0;
                var undo = [];
                var pos1 = {x:WorldEdit.pos1.x,y:WorldEdit.pos1.y,z:WorldEdit.pos1.z};
                var pos2 = {x:WorldEdit.pos2.x,y:WorldEdit.pos2.y,z:WorldEdit.pos2.z};

                for(var x = pos1.x; x <= pos2.x; x++){
                    for(var y = pos1.y; y <= pos2.y; y++){
                        for(var z = pos1.z; z <= pos2.z; z++){
                            undo.push([x,y,z,World.getBlock(x, y, z).id,World.getBlock(x, y, z).data]);
                            if(x == WorldEdit.pos1.x || x == WorldEdit.pos2.x || y == WorldEdit.pos1.y || y == WorldEdit.pos2.y || z == WorldEdit.pos1.z || z == WorldEdit.pos2.z){
                                World.setBlock(x, y, z, id, data);
                                count++;
                            }
                        }   
                    }
                }
                WorldEdit.undo.push(undo);
                
                Game.message(WorldEdit.getMessageSize(count));
            });
        }
    },
    "//wall":{
        name:"//wall",
        description:"Build the walls of the region (not including ceiling and floor).",
        args:"<block>",
        func:function(args){
            runOnMainThread(function(){
                if(!args[0])
                    return Game.message(Translation.translate("Don't valid command."));
                    
                if(!WorldEdit.getValidPosition())
                    return Game.message(Translation.translate("Set both positions."));
                
                var count = 0;
                var block = args[0].split(":");
                var id = parseInt(block[0]);
                var data = block[1]?parseInt(block[1]):0;
                var undo = [];
                var pos1 = {x:WorldEdit.pos1.x,y:WorldEdit.pos1.y,z:WorldEdit.pos1.z};
                var pos2 = {x:WorldEdit.pos2.x,y:WorldEdit.pos2.y,z:WorldEdit.pos2.z};

                for(var x = pos1.x; x <= pos2.x; x++){
                    for(var y = pos1.y; y <= pos2.y; y++){
                        for(var z = pos1.z; z <= pos2.z; z++){
                            undo.push([x,y,z,World.getBlock(x, y, z).id,World.getBlock(x, y, z).data]);
                            if(x == WorldEdit.pos1.x || x == WorldEdit.pos2.x || z == WorldEdit.pos1.z || z == WorldEdit.pos2.z){
                                World.setBlock(x, y, z, id, data);
                                count++;
                            }
                        }   
                    }
                }
                WorldEdit.undo.push(undo);
                
                Game.message(WorldEdit.getMessageSize(count));
            });
        }
    },
    "//r":{
        name:"//r",
        description:"Work with the region.",
        args:"<type> [args]",
        func:function(args){
            switch(args[0]){
                case "help":
                case "?":
                case undefined:
                    var list = [
                        ["help", "<page>", "Commands for working with the region"],
                        ["up", "<count>", "Raise the selected region by the specified number of blocks"],
                        ["down", "<count>", "Lower the selected region by the specified number of blocks"],
                        ["pos1", "[<x> <y> <z>]", Commands["//pos1"].description],
                        ["pos2", "[<x> <y> <z>]", Commands["//pos2"].description],
                    ];
                    
                    var page = args[0]?parseInt(args[0]):1;
                    var _page = page - 1;
                    var message = "";
                    var count = 0;
                    for(var i in list){
                        count++;
                        if(count <= 6*_page && count > 6*page)continue;
                        var cmd = list[i];
                        message+= "//region "+cmd[0]+" ";
                        if(cmd[1] != null)
                            message+= cmd[1]+" ";
                        message+= "- "+Translation.translate(cmd[2])+"\n";
                    }
                    
                    Game.message(Translation.translate("===Help [Page %page%]===\n%cmd%===Help [Page %page%]===").replace(/(%page)/g, page).replace("%cmd%", message));
                break;
                case "up":
                    if(!args[1])
                        return Game.message(Translation.translate("Don't valid command."));
                        
                    if(!WorldEdit.getValidPosition())
                        return Game.message(Translation.translate("Set both positions."));
                    
                    var up = parseInt(args[1]);
                    if(isNaN(up))
                        return Game.message(Translation.translate("Don't valid command."));
                    
                    WorldEdit.pos2.y += up;
                    
                    var a = up;
                    a = a%100;
                    if(a<10 || a > 20){
                        a = a%10;
                        if(a==1)
                            sizeArea = Translation.translate("%count% block.").replace("%count%", a);
                        else
                            sizeArea = Translation.translate("%count% blocks.").replace("%count%", a);
                    }else
                        sizeArea = Translation.translate("%count% blocks.").replace("%count%", a);
                    
                    Game.message(Translation.translate("The region is raised to %area%").replace("%area%",sizeArea));
                    
                break;
                case "down":
                    if(!args[1])
                        return Game.message(Translation.translate("Don't valid command."));
                    
                    if(!WorldEdit.getValidPosition())
                        return Game.message(Translation.translate("Set both positions."));
                    
                    var up = parseInt(args[1]);
                    if(isNaN(up))
                        return Game.message(Translation.translate("Don't valid command."));
                    
                    WorldEdit.pos1.y -= up;
                    
                    var a = up;
                    a = a%100;
                    if(a<10 || a > 20){
                        a = a%10;
                        if(a==1)
                            sizeArea = Translation.translate("%count% block.").replace("%count%", a);
                        else
                            sizeArea = Translation.translate("%count% blocks.").replace("%count%", a);
                    }else
                        sizeArea = Translation.translate("%count% blocks.").replace("%count%", a);
                    
                    Game.message(Translation.translate("The region is omitted in %area%").replace("%area%",sizeArea));
                    
                    
                break;
                case "pos1":
                case "pos2":
                    var _args = args;
                    _args.shift();
                    Commands["//"+args[0]].func(_args);
                break;
                default:
                    return Game.message(Translation.translate("Don't valid command."));
                break;
            }
        }
    },
    "//reg":{
        name:"//reg",
        description:"Work with the region.",
        args:"<type> [args]",
        func:function(args){
            Commands["//r"].func(args);
        }
    },
    "//region":{
        name:"//region",
        description:"Work with the region.",
        args:"<type> [args]",
        func:function(args){
            Commands["//r"].func(args);
        }
    },
};

Callback.addCallback("NativeCommand", function(command){
    var cmd = command.split(" ");
    if(Commands.hasOwnProperty(cmd[0])){
        Commands[cmd[0]].func(typeof(cmd[1]) != "undefined" ? command.split(cmd[0] + " ")[1].split(" ") : []);
        Game.prevent();
    }
});

Callback.addCallback("ItemUse",function(coords, item, block){
    if(item.id == getGetIdWand()){
        Game.message(Translation.translate("Block ID %id%:%data%.").replace("%id%",block.id).replace("%data%",block.data));
        Game.prevent();
    }
    
    if(item.id == getWand() && WorldEdit.wand == true){
        Commands["//pos1"].func([coords.x, coords.y, coords.z]);
        Game.prevent();
    }
});

Callback.addCallback("DestroyBlockStart", function (coords, block, player) {
    if(Game.getGameMode() == 0 && Player.getCarriedItem().id == getWand() && WorldEdit.wand == true){
        Commands["//pos2"].func([coords.x, coords.y, coords.z]);
        Game.prevent();
    }
});

Callback.addCallback("LevelLeft", function(){
    WorldEdit.undo = [];
    WorldEdit.redo = [];
    
    WorldEdit.pos1 = {x:Infinity,y:Infinity,z:Infinity};
    WorldEdit.pos2 = {x:Infinity,y:Infinity,z:Infinity};
    
    WorldEdit.sp1 = {x:Infinity,y:Infinity,z:Infinity};
    WorldEdit.sp2 = {x:Infinity,y:Infinity,z:Infinity};
    
    if(selectedArea)
        selectedArea.destroy();
    
    selectedArea = null;
});

// Grid Area
var selectedAreaRender = new Render();
var selectedAreaRenderBodyPart = selectedAreaRender.getPart("head");
var selectedAreaMesh = new RenderMesh();
var selectedArea;
var selectedAreaThread;

function setSelectedArea(){
    if(selectedAreaThread != null && !selectedAreaThread.isInterrupted())
        selectedAreaThread.interrupt();

    selectedAreaThread = thread(function () {
        var cur = java.lang.Thread.currentThread();
        var sizeLine; 
        if(sizeLine = __config__.access("sizeLineGrid")){
            if(sizeLine instanceof java.lang.String){
    			sizeLine = new String(sizeLine);
                if(new RegExp("^([0-9]+(\\.[0-9]+)*)\\/([0-9]+(\\.[0-9]+)*)$").test(sizeLine)){
                    sizeLine = eval(sizeLine.toString());
                }else{
                    sizeLine = 1/16;
                }
            }else if(typeof(sizeLine) != "number" || !sizeLine instanceof java.lang.Int || !sizeLine instanceof java.lang.Float){
                sizeLine = 1/16;
            }
        }else
            sizeLine = 1/16;
    	
    	var sizeGrid; 
        if(sizeGrid = __config__.access("sizeBorderGrid")){
            if(sizeGrid instanceof java.lang.String){
    			sizeGrid = new String(sizeGrid);
                if(new RegExp("^([0-9]+(\\.[0-9]+)*)\\/([0-9]+(\\.[0-9]+)*)$").test(sizeGrid)){
                    sizeGrid = eval(sizeGrid.toString());
                }else{
                    sizeGrid = 1/16;
                }
            }else if(typeof(sizeGrid) != "number" || !sizeGrid instanceof java.lang.Int || !sizeGrid instanceof java.lang.Float){
                sizeGrid = 1/16;
            }
        }else
            sizeGrid = 1/16;
        
    	var spaceGrid;
    	if(spaceGrid = __config__.access("spaceGrid")){
    		spaceGrid = parseInt(spaceGrid);
    		if(isNaN(spaceGrid))
    			spaceGrid = 10;
    	}else
    		spaceGrid = 10;

        selectedAreaMesh.clear();
        selectedAreaMesh.rebuild();
        selectedAreaRenderBodyPart.setMesh(selectedAreaMesh);
        selectedAreaRender.getModel().reset();
        if(selectedArea)
            selectedArea.refresh();

        var pos1 = WorldEdit.pos1;
        var pos2 = WorldEdit.pos2;
        if(pos1.x == Infinity && pos2.x == Infinity){
            return false;
    	}
        
        if(pos1.x == Infinity && pos2.x != Infinity){
            pos1.x = pos2.x;
            pos1.y = pos2.y;
            pos1.z = pos2.z;
        }
        
        if(pos2.x == Infinity){
            pos2 = {
                x:pos1.x + 1,
                y:pos1.y + 1,
                z:pos1.z + 1
            }
        }else{
            pos2 = {
                x:pos2.x + 1,
                y:pos2.y + 1,
                z:pos2.z + 1
            };
        }
        
        if(!selectedArea){
            selectedArea = new Animation.Base();
            selectedArea.describe({
                render: selectedAreaRender.getId(),
                skin:__config__.access("customGridColor")==true?"WorldEdit/custom.png":"WorldEdit/standart.png"
            });
            
            selectedArea.load();
        }


        let size = {
            x:Math.abs( pos2.x - pos1.x ) + .02,
            y:Math.abs( pos2.y - pos1.y ) + .02,
            z:Math.abs( pos2.z - pos1.z ) + .02
        };

        let posAnim = {
            x: pos1.x + (size.x/2),
            y: pos1.y + (size.y/2),
            z: pos1.z + (size.z/2)
        };
        selectedArea.setPos(
            posAnim.x - 0.01,
            posAnim.y - 1.51,
            posAnim.z - 0.01
        );
        
        if(IS_HORIZON)
            selectedArea.setSkylightMode();
        
        if(cur.isInterrupted()) return;

        sizeGrid *= selectedAreaRenderMultiply;
    	//GeneralBox
        AddBoxInMesh(   selectedAreaMesh,
                        {x:0, y:0, z:0},
                        size,
                        sizeGrid,
                        {x: 0, y:0},
                        {x: 0.5, y:0.5}, cur);

        //FirstPosBox
        if(cur.isInterrupted()) return;
        let pos = WorldEdit.sp1;
        if(pos.x != Infinity){
             AddBoxInMesh(   selectedAreaMesh,
                        {
                            x:pos.x - posAnim.x + 0.51,
                            y:pos.y - posAnim.y + 0.51,
                            z:posAnim.z - pos.z - 0.51
                        },
                        {x:1.04, y:1.04, z:1.04},
                        sizeGrid,
                        {x: 0, y:0.5},
                        {x: 0.5, y:1}, cur);
        }
        //SecondPosBox
        if(cur.isInterrupted()) return;
        pos = WorldEdit.sp2;
        if(pos.x != Infinity){
             AddBoxInMesh(   selectedAreaMesh,
                        {
                            x:pos.x - posAnim.x + 0.51,
                            y:pos.y - posAnim.y + 0.51,
                            z:posAnim.z - pos.z - 0.51
                        },
                        {x:1.04, y:1.04, z:1.04},
                        sizeGrid,
                        {x: 0.5, y:0.5},
                        {x: 1, y:1}, cur);
        }

        if(cur.isInterrupted()) return;
        sizeLine *= selectedAreaRenderMultiply;
        spaceGrid *= selectedAreaRenderMultiply;
        //Grid
            let rot = [
                    [ 1, 0, 0, 1],
                    [ 1, 0, 0, -1],
                    [ 0, 1, 1, 0],
                    [ 0, -1, 1, 0],
                ];
            //X
            let c = Math.floor((Math.floor(size.x)- 1) / spaceGrid);
            if(c > 0){
                for(let i = 1; i <= c; i++){

                    let d = sizeLine/2;
                    let _pos = -size.x/2 + .01 + (size.x/(c+1)) * i;

                    for(let j = 0; j < 4; j++){
                        if(cur.isInterrupted()) return;
                        selectedAreaMesh.addVertex(_pos + d,
                            (size.y/2 - sizeGrid) * rot[j][0] + size.y/2 * rot[j][1],
                            (size.z/2 - sizeGrid) * rot[j][2] + size.z/2 * rot[j][3], .5, 0);
                        selectedAreaMesh.addVertex(_pos - d,
                            (size.y/2 - sizeGrid) * rot[j][0] + size.y/2 * rot[j][1],
                            (size.z/2 - sizeGrid) * rot[j][2] + size.z/2 * rot[j][3], 1, 0);
                        selectedAreaMesh.addVertex(_pos - d,
                            (-size.y/2 + sizeGrid) * rot[j][0] + size.y/2 * rot[j][1],
                            (-size.z/2 + sizeGrid) * rot[j][2] + size.z/2 * rot[j][3], .5, .5);

                        selectedAreaMesh.addVertex(_pos + d,
                            (size.y/2 - sizeGrid) * rot[j][0] + size.y/2 * rot[j][1],
                            (size.z/2 - sizeGrid) * rot[j][2] + size.z/2 * rot[j][3], .5, 0);
                        selectedAreaMesh.addVertex(_pos + d,
                            (-size.y/2 + sizeGrid) * rot[j][0] + size.y/2 * rot[j][1],
                            (-size.z/2 + sizeGrid) * rot[j][2] + size.z/2 * rot[j][3], 1, .5);
                        selectedAreaMesh.addVertex(_pos - d,
                            (-size.y/2 + sizeGrid) * rot[j][0] + size.y/2 * rot[j][1],
                            (-size.z/2 + sizeGrid) * rot[j][2] + size.z/2 * rot[j][3], .5, .5);
                    }
                }
            }
            //Y
            if(cur.isInterrupted()) return;
            c = Math.floor((Math.floor(size.y)- 1) / spaceGrid);
            if(c > 0){
                for(let i = 1; i <= c; i++){

                    let d = sizeLine/2;
                    let _pos = -size.y/2 + .01 + (size.y/(c+1)) * i;

                    for(let j = 0; j < 4; j++){
                        if(cur.isInterrupted()) return;
                        selectedAreaMesh.addVertex(
                            (size.x/2 - sizeGrid) * rot[j][0] + size.x/2 * rot[j][1],
                            _pos + d,
                            (size.z/2 - sizeGrid) * rot[j][2] + size.z/2 * rot[j][3], .5, 0);
                        selectedAreaMesh.addVertex(
                            (size.x/2 - sizeGrid) * rot[j][0] + size.x/2 * rot[j][1],
                            _pos - d,
                            (size.z/2 - sizeGrid) * rot[j][2] + size.z/2 * rot[j][3], 1, 0);
                        selectedAreaMesh.addVertex(
                            (-size.x/2 + sizeGrid) * rot[j][0] + size.x/2 * rot[j][1],
                            _pos - d,
                            (-size.z/2 + sizeGrid) * rot[j][2] + size.z/2 * rot[j][3], .5, .5);

                        selectedAreaMesh.addVertex(
                            (size.x/2 - sizeGrid) * rot[j][0] + size.x/2 * rot[j][1],
                            _pos + d,
                            (size.z/2 - sizeGrid) * rot[j][2] + size.z/2 * rot[j][3], .5, 0);
                        selectedAreaMesh.addVertex(
                            (-size.x/2 + sizeGrid) * rot[j][0] + size.x/2 * rot[j][1],
                            _pos + d,
                            (-size.z/2 + sizeGrid) * rot[j][2] + size.z/2 * rot[j][3], 1, .5);
                        selectedAreaMesh.addVertex(
                            (-size.x/2 + sizeGrid) * rot[j][0] + size.x/2 * rot[j][1],
                            _pos - d,
                            (-size.z/2 + sizeGrid) * rot[j][2] + size.z/2 * rot[j][3], .5, .5);
                    }
                }
            }
            //Z
            if(cur.isInterrupted()) return;
            c = Math.floor((Math.floor(size.z)- 1) / spaceGrid);
            if(c > 0){
                for(let i = 1; i <= c; i++){

                    let d = sizeLine/2;
                    let _pos = -size.z/2 + .01 + (size.z/(c+1)) * i;

                    for(let j = 0; j < 4; j++){
                        if(cur.isInterrupted()) return;
                        selectedAreaMesh.addVertex(
                            (size.x/2 - sizeGrid) * rot[j][0] + size.x/2 * rot[j][1],
                            (size.y/2 - sizeGrid) * rot[j][2] + size.y/2 * rot[j][3],
                            _pos + d, .5, 0);
                        selectedAreaMesh.addVertex(
                            (size.x/2 - sizeGrid) * rot[j][0] + size.x/2 * rot[j][1],
                            (size.y/2 - sizeGrid) * rot[j][2] + size.y/2 * rot[j][3],
                            _pos - d, 1, 0);
                        selectedAreaMesh.addVertex(
                            (-size.x/2 + sizeGrid) * rot[j][0] + size.x/2 * rot[j][1],
                            (-size.y/2 + sizeGrid) * rot[j][2] + size.y/2 * rot[j][3],
                            _pos - d, .5, .5);

                        selectedAreaMesh.addVertex(
                            (size.x/2 - sizeGrid) * rot[j][0] + size.x/2 * rot[j][1],
                            (size.y/2 - sizeGrid) * rot[j][2] + size.y/2 * rot[j][3],
                            _pos + d, .5, 0);
                        selectedAreaMesh.addVertex(
                            (-size.x/2 + sizeGrid) * rot[j][0] + size.x/2 * rot[j][1],
                            (-size.y/2 + sizeGrid) * rot[j][2] + size.y/2 * rot[j][3],
                            _pos + d, 1, .5);
                        selectedAreaMesh.addVertex(
                            (-size.x/2 + sizeGrid) * rot[j][0] + size.x/2 * rot[j][1],
                            (-size.y/2 + sizeGrid) * rot[j][2] + size.y/2 * rot[j][3],
                            _pos - d, .5, .5);
                    }
                }
            }
    	
        if(cur.isInterrupted()) return;
        selectedAreaMesh.rebuild();
        selectedAreaRenderBodyPart.setMesh(selectedAreaMesh);
        selectedAreaRender.getModel().reset();
        selectedArea.refresh();
    });
    
    selectedAreaThread.start();
}

function AddBoxInMesh(Mesh, start_pos, size, sizeBorder, uv_s, uv_e, thread){
    size.x *= selectedAreaRenderMultiply;
    size.y *= selectedAreaRenderMultiply;
    size.z *= selectedAreaRenderMultiply;

    start_pos.x *= selectedAreaRenderMultiply;
    start_pos.y *= selectedAreaRenderMultiply;
    start_pos.z *= selectedAreaRenderMultiply;

    let rotates = [
        //Z
        [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ],
        [-1, 0, 0, 0,-1, 0, 0, 0, 1 ],
        [ 0, 1, 0, 1, 0, 0, 0, 0, 1 ],
        [ 0,-1, 0, -1, 0, 0, 0, 0, 1 ],
        [ 1, 0, 0, 0, 1, 0, 0, 0,-1 ],
        [-1, 0, 0, 0,-1, 0, 0, 0,-1 ],
        [ 0, 1, 0, 1, 0, 0, 0, 0,-1 ],
        [ 0,-1, 0, -1, 0, 0, 0, 0,-1 ],
        //Y
        [ 1, 0, 0, 0, 0, 1, 0, 1, 0],
        [ 0, 1, 0, 0, 0, 1, 1, 0, 0],
        [ -1, 0, 0, 0, 0, 1, 0, -1, 0],
        [ 0, -1, 0, 0, 0, 1, -1, 0, 0],
        [ 1, 0, 0, 0, 0, -1, 0, 1, 0],
        [ 0, 1, 0, 0, 0, -1, 1, 0, 0],
        [ -1, 0, 0, 0, 0, -1, 0, -1, 0],
        [ 0, -1, 0, 0, 0, -1, -1, 0, 0],
        //X
        [ 0, 0, 1, 0, 1, 0, 1, 0, 0],
        [ 0, 0, 1, 1, 0, 0, 0, 1, 0],
        [ 0, 0, 1, 0,-1, 0, -1, 0, 0],
        [ 0, 0, 1, -1, 0, 0, 0,-1, 0],
        [ 0, 0,-1, 0, 1, 0, 1, 0, 0],
        [ 0, 0,-1, 1, 0, 0, 0, 1, 0],
        [ 0, 0,-1, 0,-1, 0, -1, 0, 0],
        [ 0, 0,-1, -1, 0, 0, 0,-1, 0]
    ];
    
    for (var i = 0; i < 24; i++){
        if(thread && thread.isInterrupted()) return;
        //Face 1
        Mesh.addVertex(
            start_pos.x + (size.x / 2 * rotates[i][0] + size.x / 2 * -rotates[i][1] + size.x / 2 * rotates[i][2]),
            start_pos.y + (size.y / 2 * rotates[i][3] + size.y / 2 *  rotates[i][4] + size.y / 2 * rotates[i][5]),
            start_pos.z + (size.z / 2 * rotates[i][6] + size.z / 2 * -rotates[i][7] + size.z / 2 * rotates[i][8]), uv_s.x, uv_s.y
            );
        Mesh.addVertex(
            start_pos.x + (size.x / 2 * -rotates[i][0] + size.x / 2 * -rotates[i][1] + size.x / 2 * rotates[i][2]),
            start_pos.y + (size.y / 2 * -rotates[i][3] + size.y / 2 *  rotates[i][4] + size.y / 2 * rotates[i][5]),
            start_pos.z + (size.z / 2 * -rotates[i][6] + size.z / 2 * -rotates[i][7] + size.z / 2 * rotates[i][8]), uv_s.x , uv_e.y
            );
        Mesh.addVertex(
            start_pos.x + ((size.x / 2 - sizeBorder) * -rotates[i][0] + (size.x / 2 - sizeBorder) * -rotates[i][1] + (size.x / 2) * rotates[i][2]),
            start_pos.y + ((size.y / 2 - sizeBorder) * -rotates[i][3] + (size.y / 2 - sizeBorder) *  rotates[i][4] + (size.y / 2) * rotates[i][5]),
            start_pos.z + ((size.z / 2 - sizeBorder) *  rotates[i][6] + (size.z / 2 - sizeBorder) * -rotates[i][7] + (size.z / 2) * rotates[i][8]), uv_e.x , uv_e.y
            );

        //Face 2
        Mesh.addVertex(
            start_pos.x + (size.x / 2 * rotates[i][0] + size.x / 2 * -rotates[i][1] + size.x / 2 * rotates[i][2]),
            start_pos.y + (size.y / 2 * rotates[i][3] + size.y / 2 *  rotates[i][4] + size.y / 2 * rotates[i][5]),
            start_pos.z + (size.z / 2 * -rotates[i][6] + size.z / 2 * -rotates[i][7] + size.z / 2 * rotates[i][8]), uv_s.x, uv_s.y
            );
        Mesh.addVertex(
            start_pos.x + ((size.x / 2 - sizeBorder) *  rotates[i][0] + (size.x / 2 - sizeBorder) * -rotates[i][1] + (size.x / 2) * rotates[i][2]),
            start_pos.y + ((size.y / 2 - sizeBorder) *  rotates[i][3] + (size.y / 2 - sizeBorder) *  rotates[i][4] + (size.y / 2) * rotates[i][5]),
            start_pos.z + ((size.z / 2 - sizeBorder) * -rotates[i][6] + (size.z / 2 - sizeBorder) * -rotates[i][7] + (size.z / 2) * rotates[i][8]), uv_s.x , uv_e.y
            );
        Mesh.addVertex(
            start_pos.x + ((size.x / 2 - sizeBorder) * -rotates[i][0] + (size.x / 2 - sizeBorder) * -rotates[i][1] + (size.x / 2) * rotates[i][2]),
            start_pos.y + ((size.y / 2 - sizeBorder) * -rotates[i][3] + (size.y / 2 - sizeBorder) *  rotates[i][4] + (size.y / 2) * rotates[i][5]),
            start_pos.z + ((size.z / 2 - sizeBorder) *  rotates[i][6] + (size.z / 2 - sizeBorder) * -rotates[i][7] + (size.z / 2) * rotates[i][8]), uv_e.x , uv_e.y
            );
    }
}

//Add Math function
Math.roundFloat = function(x, y){
    return Math.round(x*y)/y;
}