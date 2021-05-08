var WorldEditAPI = {
    /**
    * addCommand(settings) - Добавить команду
    * @param object settings - Объект команды
    * settings{
    *     name:string, //Команда
    *     description:string, //Описание команды
    *     arguments:string || "", //Аргументы
    *     event:function, //Функция команды
    *     selectedArea:bool || true // Требуется ли для команды выделенная область
    * }
    */
    
    /**
    * addCommand(name, description, event, args, selectedArea) - Добавить команду
    * @param string name - Команда
    * @param string description - Описание команды
    * @param string args - Аргументы
    * @param function event - Функция команды
    * @param bool selectedArea - Требуется ли для команды выделенная область
    * }
    */
    addCommand:function(name, desc, event, args, selectedArea){
        if(typeof(name)=='object'){
            desc = name.description || name.descript || name.desc;
            args = name.arguments || name.args || "";
            event = name.event;
            selectedArea = name.selectedArea || true;
            name = name.name;
            
        }
        
        if(typeof(name)!="string")
            throw "Name command was be string";
        
        if(typeof(desc)!="string")
            return;
        if(typeof(args)!="string")
            return;
        if(typeof(event)!="function")
            return;
        if(typeof(selectedArea)!="boolean")
            return;
        
        if(selectedArea){
            _e = event;
            event = function(args){
                if(!WorldEdit.getValidPosition())
                    return Game.message(Translation.translate("Set both positions."));
                
                _e(args);
            }
        }
        
        if(Commands[name]){
            return;
        }
        
        Commands[name] = {
            name:name,
            description:desc,
            args:args,
            func:event
        }
        return;
    },
    
    
    /**
    * getCommand
    * @param string name
    */
    getCommand:function(name){
        return Commands[name] || false;
    },
    
    /**
    * getPosition() - Получить координаты точек
    * @return {pos1, pos2} - Координаты точек
    */
    getPosition:function(){
        return {
            pos1:WorldEdit.pos1,
            pos2:WorldEdit.pos2
        }
    },
    
    /**
    * getValidPosition() - Проверить выделенную область
    * @return bool - Обе ли точки существуют
    */
    getValidPosition:function(){
        return WorldEdit.getValifPosition();
    },
    
    /**
    * getSizeArea() - Получить размер выделенной области 
    * @return number - Кол-во блоков в выделенной области
    */
    getSizeArea:function(){
        return WorldEdit.getSizeArea();
    },
    
    /**
    * selectPosition(pos1, pos2) - выбрать позиции точек
    * @param object pos1 - Первая точка {x, y, z}
    * @param object pos2 - Вторая точка {x, y, z}
    */
    selectPosition:function(p1, p2){
        WorldEdit.selectPosition(p1, p2);
    }
};

ModAPI.registerAPI("WorldEdit", WorldEditAPI);