/*

   Copyright 2021-2022 Nernar (github.com/nernar)

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

*/
LIBRARY({
    name: "Stacktrace",
    version: 1,
    api: "AdaptedScript",
    shared: true
});
launchTime = Date.now();
isHorizon = (function () {
    var version = MCSystem.getInnerCoreVersion();
    return parseInt(version.toString()[0]) >= 2;
})();
InnerCorePackages = isHorizon ? Packages.com.zhekasmirnov.innercore : Packages.zhekasmirnov.launcher;
isValidFile = function (file) {
    if (file instanceof java.io.File) {
        return file.isFile();
    }
    return false;
};
Translation.addTranslation("Oh nose everything broke", {
    ru: "Ох нет, все сломалось"
});
Translation.addTranslation("Preparing report", {
    ru: "Подготовка отчета"
});
Translation.addTranslation("Milliseconds estimated after launch", {
    ru: "Миллисекунды, прошедшие с запуска"
});
Translation.addTranslation("Defined at", {
    ru: "Объявлено в"
});
Translation.addTranslation("at line", {
    ru: "на строке"
});
Translation.addTranslation("from", {
    ru: "из"
});
Translation.addTranslation("Source may be incorrectly", {
    ru: "Источник может быть некорректным"
});
Translation.addTranslation("Understand", {
    ru: "Понятно"
});
Translation.addTranslation("Leave", {
    ru: "Выход"
});
Translation.addTranslation("Saved as", {
    ru: "Сохранено как"
});
Translation.addTranslation("Wouldn't fetch modification sources", {
    ru: "Не удалось получить исходники модификации"
});
Translation.addTranslation("Couldn't save trace", {
    ru: "Не удается сохранить сводку"
});
getLoadedModList = function () {
    try {
        var mods = Packages.com.zhekasmirnov.apparatus.modloader.ApparatusModLoader.getSingleton().getAllMods();
        var sorted = new java.util.ArrayList();
        for (var i = 0; i < mods.size(); i++) {
            var mod = mods.get(i);
            if (mod instanceof Packages.com.zhekasmirnov.apparatus.modloader.LegacyInnerCoreMod) {
                sorted.add(mod.getLegacyModInstance());
            }
        }
        return sorted;
    }
    catch (e) {
        return InnerCorePackages.mod.build.ModLoader.instance.modsList;
    }
};
fetchScriptSources = function (mod) {
    var founded = {};
    var buildConfig = mod.buildConfig;
    var sources = buildConfig.sourcesToCompile;
    for (var i = 0; i < sources.size(); i++) {
        var source = sources.get(i);
        founded[source.path] = source.sourceName;
    }
    var directory = buildConfig.defaultConfig.libDir;
    if (directory != null) {
        var folder = new java.io.File(mod.dir, directory);
        if (folder.exists() && folder.isDirectory()) {
            var libraries = folder.listFiles();
            for (var i = 0; i < libraries.length; i++) {
                var library = libraries[i].getName();
                founded[directory + library] = library;
            }
        }
    }
    return founded;
};
setupLoadedSources = function (mods) {
    for (var i = 0; i < mods.size(); i++) {
        var source = mods.get(i);
        setupLoadedSources.mods[source] = fetchScriptSources(source);
        setupLoadedSources.sources[source] = source;
    }
};
setupLoadedSources.mods = {};
setupLoadedSources.sources = {};
getModName = function (id) {
    if (setupLoadedSources.sources.hasOwnProperty(id)) {
        var source = setupLoadedSources.sources[id];
        if (source) {
            return "" + source.getName();
        }
    }
    return "";
};
findAvailabledMods = function (name) {
    var array = [];
    for (var element in setupLoadedSources.mods) {
        var mod = getModName(element);
        if (mod == name) {
            array.unshift(element);
        }
        else if (!name || mod.startsWith(name)) {
            array.push(element);
        }
        var source = setupLoadedSources.sources[element];
        if (source.dir.endsWith("/" + name + "/")) {
            array.unshift(element);
        }
        else if (source.dir.indexOf("/" + name) != -1) {
            array.push(element);
        }
    }
    return array;
};
findRelatedSources = function (name, file) {
    var sources = findAvailabledMods(name);
    if (sources.length == 0) {
        return {};
    }
    var related = {};
    for (var i = 0; i < sources.length; i++) {
        var mod = sources[i], source = setupLoadedSources.mods[mod];
        for (var path in source) {
            var name_1 = source[path];
            if (name_1 == file) {
                if (!related.hasOwnProperty(mod)) {
                    related[mod] = [];
                }
                related[mod].unshift(path);
            }
            else if (name_1.endsWith(file)) {
                if (!related.hasOwnProperty(mod)) {
                    related[mod] = [];
                }
                related[mod].push(path);
            }
        }
    }
    return related;
};
reformatSpecial = function (element) {
    element = "" + element;
    element = element.replace(/\+/g, "\\+");
    element = element.replace(/\(/g, "\\(");
    element = element.replace(/\)/g, "\\)");
    element = element.replace(/\[/g, "\\[");
    element = element.replace(/\]/g, "\\]");
    element = element.replace(/\{/g, "\\{");
    element = element.replace(/\}/g, "\\}");
    return element.replace(/\./g, "\\.");
};
requireFormat = function (message) {
    for (var element in addTranslation.messages) {
        var exp = reformatSpecial(element);
        exp = exp.replace(/%s/g, "(.*)");
        try {
            var regexp = new RegExp(exp, "m");
            if (regexp.test(message)) {
                return {
                    message: "" + element,
                    exec: regexp.exec(message)
                };
            }
        }
        catch (e) {
            // Must be detected if regexp fail
        }
    }
    return {
        message: message
    };
};
translateMessage = function (message) {
    if (typeof message != "string") {
        message = "" + message;
    }
    var format = requireFormat(message);
    if (addTranslation.messages.hasOwnProperty(format.message)) {
        message = Translation.translate(format.message);
        if (format.exec && format.exec.length > 1) {
            format.exec.shift();
            try {
                return java.lang.String.format(message, format.exec);
            }
            catch (e) {
                format.exec.forEach(function (who) {
                    message = message.replace("%s", who);
                });
            }
        }
    }
    return message;
};
resolveTraceSource = function (line) {
    if (typeof line != "string") {
        line = "" + line;
    }
    var at = line.indexOf("at ");
    if (at == -1) {
        return null;
    }
    line = line.substring(at + 3);
    var resolved = {};
    resolved.trace = line;
    if (line.endsWith(")")) {
        var index = line.lastIndexOf("(");
        resolved.where = line.slice(index + 1, line.length - 1);
        line = line.substring(0, index - 1);
    }
    var semi = line.lastIndexOf(":");
    if (semi != -1) {
        resolved.line = line.slice(semi + 1, line.length);
        line = line.substring(0, semi);
    }
    var name = line.indexOf("$");
    if (name != -1) {
        resolved.source = line.slice(0, name);
        line = line.substring(name + 1);
    }
    resolved.file = line;
    return resolved;
};
sliceMessageWithoutTrace = function (message, line) {
    if (typeof message != "string") {
        message = "" + message;
    }
    var trace = resolveTraceSource(line);
    if (trace === null) {
        return message;
    }
    trace = trace.trace.replace(":", "#");
    var index = message.lastIndexOf(trace);
    if (index != -1) {
        return message.slice(0, index - 2);
    }
    return message;
};
retraceToArray = function (trace) {
    if (trace === null || trace === undefined) {
        return [];
    }
    if (typeof trace != "string") {
        trace = "" + trace;
    }
    return trace.split("\n");
};
fetchErrorMessage = function (error) {
    if (error === null) {
        return "" + error;
    }
    if (typeof error == "object") {
        if (error.hasOwnProperty("message")) {
            return "" + error.message;
        }
        return null;
    }
    return "" + error;
};
fetchErrorName = function (error) {
    if (error && typeof error == "object") {
        if (error.name !== undefined) {
            return "" + error.name;
        }
    }
    return Translation.translate("Oh nose everything broke");
};
saveOrRewrite = function (path, text) {
    text = new java.lang.String(text);
    var file = new java.io.File(__dir__ + ".logging", path + ".trace");
    file.getParentFile().mkdirs();
    if (!file.isDirectory()) {
        file.createNewFile();
        var stream = new java.io.FileOutputStream(file);
        stream.write(text.getBytes());
        stream.close();
        print(Translation.translate("Saved as") + " " + path);
        return;
    }
    print(Translation.translate("Couldn't save trace"));
};
addTranslation = function (prefix, who, translation) {
    if (!addTranslation.messages.hasOwnProperty(who)) {
        Object.defineProperty(addTranslation.messages, who, {
            enumerable: true
        });
    }
    InnerCorePackages.api.runtime.other.NameTranslation.addSingleTranslation(prefix, who, translation);
};
addTranslation.messages = {};
// Codegen
addTranslation("ru", "Duplicate parameter name \"%s\".", "Дублируется название параметра \"%s\".");
addTranslation("ru", "Program too complex: too big jump offset.", "Программа слишком большая: слишком большое расстояние между кодом.");
addTranslation("ru", "Program too complex: internal index exceeds 64K limit.", "Программа слишком большая: количество методов превышает 64К.");
addTranslation("ru", "Encountered code generation error while compiling function \"%s\": %s", "Произошла ошибка во время компиляции функции \"%s\": %s");
addTranslation("ru", "Encountered code generation error while compiling script: %s", "Произошла ошибка во время компиляции кода: %s");
// Context
addTranslation("ru", "Constructor for \"%s\" not found.", "Конструктор для \"%s\" не найден.");
addTranslation("ru", "\"%s\" is not a constructor.", "\"%s\" не является конструктором.");
// FunctionObject
addTranslation("ru", "Method or constructor \"%s\" must be static with the signature \"(Context cx, Object[] args, Function ctorObj, boolean inNewExpr)\" to define a variable arguments constructor.", "Метод или конструктор \"%s\" должен быть создан по принципу \"(Context кс, Object[] аргы, Function кторОбк, boolean вНовомВыр)\" для объявления переменной аргументов конструктора.");
addTranslation("ru", "Method \"%s\" must be static with the signature \"(Context cx, Scriptable thisObj, Object[] args, Function funObj)\" to define a variable arguments constructor.", "Метод \"%s\" должен быть создан по принципу \"(Context кс, Scriptable местоОбк, Object[] аргы, Function фунОбк)\" для объявления переменной аргументов конструктора.");
addTranslation("ru", "Method \"%s\" called on incompatible object.", "Метод \"%s\" вызван на неподдерживаемом объекте.");
addTranslation("ru", "Unsupported parameter type \"%s\" in method \"%s\".", "Неподдерживаемый тип для параметра \"%s\" в методе \"%s\".");
addTranslation("ru", "Unsupported return type \"%s\" in method \"%s\".", "Неподдерживаемый тип результата \"%s\" в методе \"%s\".");
addTranslation("ru", "Construction of objects of type \"%s\" is not supported.", "Создание объектов для типа \"%s\" не поддерживается.");
addTranslation("ru", "Method \"%s\" occurs multiple times in class \"%s\".", "Метод \"%s\" выполнился слишком много раз в классе \"%s\".");
addTranslation("ru", "Method \"%s\" not found in \"%s\".", "Метод \"%s\" не найден в \"%s\".");
// IRFactory
addTranslation("ru", "Invalid left-hand side of for..in loop.", "Некорректная левая часть в for..in цикле.");
addTranslation("ru", "Only one variable allowed in for..in loop.", "Только одна переменная разрешена в for..in цикле.");
addTranslation("ru", "Left hand side of for..in loop must be an array of length 2 to accept key/value pair.", "Левая часть for..in цикла должна быть массивом с длиной 2, чтобы принять пару ключ/значение.");
addTranslation("ru", "Can't convert to type \"%s\".", "Невозможно привести к типу \"%s\".");
addTranslation("ru", "Invalid assignment left-hand side.", "Некорректная левая часть обращения.");
addTranslation("ru", "Invalid decrement operand.", "Некорректный операнд вычитания.");
addTranslation("ru", "Invalid increment operand.", "Некорректный операнд сложения.");
addTranslation("ru", "yield must be in a function.", "yield должен быть функцией.");
addTranslation("ru", "yield expression must be parenthesized.", "yield выражение должно быть направлено на родителя.");
// NativeGlobal
addTranslation("ru", "Function \"%s\" must be called directly, and not by way of a function of another name.", "Функция \"%s\" должна быть вызвана напрямую, а также не с помощью функции по другому ключу.");
addTranslation("ru", "Calling eval() with anything other than a primitive string value will simply return the value. Is this what you intended?", "Вызов eval() на чем угодно кроме примитива строки просто вернет значение. Это то, чего вы ожидали?");
addTranslation("ru", "Calling eval() with anything other than a primitive string value is not allowed in strict mode.", "Вызов eval() на чем угодно кроме примитива строки запрещен в строгом режиме.");
addTranslation("ru", "Invalid destructuring assignment operator", "Некорректное обращение к оператору уничтожения");
// NativeCall
addTranslation("ru", "\"%s\" may only be invoked from a \"new\" expression.", "\"%s\" может быть вызван только с помощью выражения \"new\".");
addTranslation("ru", "The \"%s\" constructor is deprecated.", "\"%s\" конструктор устарел.");
// NativeFunction
addTranslation("ru", "no source found to decompile function reference %s", "не найден исходник для декомпиляции источника функции %s");
addTranslation("ru", "second argument to Function.prototype.apply must be an array", "второй аргумент для Function.prototype.apply должен быть массивом");
// NativeGlobal
addTranslation("ru", "invalid string escape mask", "некорректная маска конца строки");
// NativeJavaClass
addTranslation("ru", "error instantiating (%s): class %s is interface or abstract", "ошибка наследования (%s): класс %s является абстрактным, либо интерфейсом");
addTranslation("ru", "Found constructor with wrong signature: %s calling %s with signature %s", "Найден конструктор с неправильным принципом: %s вызывает %s по принципу %s");
addTranslation("ru", "Expected argument to getClass() to be a Java object.", "Упущен аргумент для getClass() в виде Java объекта.");
addTranslation("ru", "Java constructor for \"%s\" with arguments \"%s\" not found.", "Java конструктор для \"%s\" с аргументами \"%s\" не найден.");
// NativeJavaMethod
addTranslation("ru", "The choice of Java method %s.%s matching JavaScript argument types (%s) is ambiguous; candidate methods are: %s", "Выбранный Java метод %s.%s, совпадающий с JavaScript аргументами (%s) не возможен; доступные методы: %s");
addTranslation("ru", "The choice of Java constructor %s matching JavaScript argument types (%s) is ambiguous; candidate constructors are: %s", "Выбранный Java конструктор %s, совпадающий с JavaScript аргументами (%s) не возможен; доступные конструкторы: %s");
// NativeJavaObject
addTranslation("ru", "Cannot convert function to interface %s with no methods", "Нельзя преобразовать функцию в интерфейс %s без методов");
addTranslation("ru", "Cannot convert function to interface %s since it contains methods with different names", "Нельзя преобразовать функцию в интерфейс %s, так как тот содержит методы с различными именами");
addTranslation("ru", "Cannot convert %s to %s", "Нельзя преобразовать %s в %s");
addTranslation("ru", "Property \"%s\" is not defined in interface adapter", "Свойство \"%s\" не объявлено в адаптере интерфейса");
addTranslation("ru", "Property \"%s\" is not a function in interface adapter", "Свойство \"%s\" не является функцией в адаптере интерфейса");
// NativeJavaPackage
addTranslation("ru", "Constructor for \"Packages\" expects argument of type java.lang.Classloader", "Конструктор для \"Packages\" упущен без аргумента java.lang.Classloader");
// NativeRegExp
addTranslation("ru", "Invalid quantifier %s", "Некорректный дескриптор %s");
addTranslation("ru", "Overly large back reference %s", "Слишком большая обратная ссылка %s");
addTranslation("ru", "Overly large minimum %s", "Слишком большой минимум %s");
addTranslation("ru", "Overly large maximum %s", "Слишком большой максимум %s");
addTranslation("ru", "Zero quantifier %s", "Нулевой дескриптор %s");
addTranslation("ru", "Maximum %s less than minimum", "Максимум %s меньше чем минимум");
addTranslation("ru", "Unterminated quantifier %s", "Незавершенный дескриптор %s");
addTranslation("ru", "Unterminated parenthetical %s", "Незавершенная иерархия %s");
addTranslation("ru", "Unterminated character class %s", "Незавершенный символьный лист %s");
addTranslation("ru", "Invalid range in character class.", "Некорректная часть в символьном листе.");
addTranslation("ru", "Trailing \\ in regular expression.", "Использована \\ в обычном выражении.");
addTranslation("ru", "unmatched ) in regular expression.", "несовпадающая ) в регулярном выражении.");
addTranslation("ru", "Regular expressions are not available.", "Регулярные выражения не доступны.");
addTranslation("ru", "back-reference exceeds number of capturing parentheses.", "обратная ссылка превысила максимальное количество захваченных родителей.");
addTranslation("ru", "Only one argument may be specified if the first argument to RegExp.prototype.compile is a RegExp object.", "Только один аргумент может быть использован, если первый аргумент в RegExp.prototype.compile является RegExp.");
addTranslation("ru", "Expected argument of type object, but instead had type %s", "Упущен аргумент в виде объекта, вместо этого имеющий тип %s");
// NativeDate
addTranslation("ru", "Date is invalid.", "Некорректная дата.");
addTranslation("ru", "toISOString must return a primitive value, but instead returned \"%s\"", "toISOString должно вернуть примитив, но вместо этого вернуло \"%s\"");
// Parser
addTranslation("ru", "Compilation produced %s syntax errors.", "Компиляция выявила %s синтаксических ошибок.");
addTranslation("ru", "TypeError: redeclaration of var %s.", "TypeError: редекларация значения %s.");
addTranslation("ru", "TypeError: redeclaration of const %s.", "TypeError: редекларация константы %s.");
addTranslation("ru", "TypeError: redeclaration of variable %s.", "TypeError: редекларация переменной %s.");
addTranslation("ru", "TypeError: redeclaration of formal parameter %s.", "TypeError: редекларация обязательного параметра %s.");
addTranslation("ru", "TypeError: redeclaration of function %s.", "TypeError: редекларация функции %s.");
addTranslation("ru", "SyntaxError: let declaration not directly within block", "SyntaxError: декларация let находится вне конструкции");
addTranslation("ru", "SyntaxError: invalid object initializer", "SyntaxError: некорректный инициализатор объекта");
// NodeTransformer
addTranslation("ru", "duplicated label", "повторяющаяся ссылка");
addTranslation("ru", "undefined label", "пустая ссылка");
addTranslation("ru", "unlabelled break must be inside loop or switch", "break без ссылок должен быть внутри цикла или switch");
addTranslation("ru", "continue must be inside loop", "continue должен быть внутри цикла");
addTranslation("ru", "continue can only use labeles of iteration statements", "continue может использовать только ссылки перечисляемых конструкций");
addTranslation("ru", "Line terminator is not allowed between the throw keyword and throw expression.", "Разделитель строки не может быть использован между throw и его выражением.");
addTranslation("ru", "missing ( before function parameters.", "пропущена ( после параметров функции.");
addTranslation("ru", "missing formal parameter", "пропущен обязательный параметр");
addTranslation("ru", "missing ) after formal parameters", "пропущена ) после обязательных параметров");
addTranslation("ru", "missing '{' before function body", "пропущена '{' перед конструкцией функции");
addTranslation("ru", "missing } after function body", "пропущена } после конструкции функции");
addTranslation("ru", "missing ( before condition", "пропущена ( перед условием");
addTranslation("ru", "missing ) after condition", "пропущена ) после условия");
addTranslation("ru", "missing ; before statement", "пропущена ; перед выражением");
addTranslation("ru", "missing ; after statement", "пропущена ; после выражения");
addTranslation("ru", "missing name after . operator", "пропущено имя после . оператора");
addTranslation("ru", "missing name after :: operator", "пропущено имя после :: оператора");
addTranslation("ru", "missing name after .. operator", "пропущено имя после .. оператора");
addTranslation("ru", "missing name after .@", "пропущено имя после .@");
addTranslation("ru", "missing ] in index expression", "пропущена ] в обозначении индекса");
addTranslation("ru", "missing ( before switch expression", "пропущена ( перед конструкцией switch");
addTranslation("ru", "missing ) after switch expression", "пропущена ) после конструкции switch");
addTranslation("ru", "missing '{' before switch body", "пропущена '{' перед телом switch");
addTranslation("ru", "invalid switch statement", "некорректное switch выражение");
addTranslation("ru", "missing : after case expression", "пропущено : после case выражения");
addTranslation("ru", "double default label in the switch statement", "дублируется default ссылка в switch выражении");
addTranslation("ru", "missing while after do-loop body", "пропущено while после структуры do");
addTranslation("ru", "missing ( after for", "пропущена ( после for");
addTranslation("ru", "missing ; after for-loop initializer", "пропущена ; после инициализатора цикла for");
addTranslation("ru", "missing ; after for-loop condition", "пропущена ; после условия цикла for");
addTranslation("ru", "missing in after for", "пропущено in после for");
addTranslation("ru", "missing ) after for-loop control", "пропущена ) после обозначения цикла for");
addTranslation("ru", "missing ( before with-statement object", "пропущена ( перед объектом конструкции with");
addTranslation("ru", "missing ) after with-statement object", "пропущена ) после объекта конструкции with");
addTranslation("ru", "with statements not allowed in strict mode", "использование with запрещено в строгом режиме");
addTranslation("ru", "missing ( after let", "пропущена ( после let");
addTranslation("ru", "missing ) after variable list", "пропущена ) после списка переменных");
addTranslation("ru", "missing } after let statement", "пропущена } после выражения let");
addTranslation("ru", "invalid return", "некорректный return");
addTranslation("ru", "missing } in compound statement", "пропущена } в корневом выражении");
addTranslation("ru", "invalid label", "некорректная ссылка");
addTranslation("ru", "missing variable name", "пропущено имя переменной");
addTranslation("ru", "invalid variable initialization", "некорректное создание переменной");
addTranslation("ru", "missing : in conditional expression", "пропущено : в условном выражении");
addTranslation("ru", "missing ) after argument list", "пропущена ) после списка аргументов");
addTranslation("ru", "missing ] after element list", "пропущена ] после списка элементов");
addTranslation("ru", "invalid property id", "некорректный идентификатор свойства");
addTranslation("ru", "missing : after property id", "пропущено : после идентификатора свойства");
addTranslation("ru", "missing } after property list", "пропущена } после списка свойств");
addTranslation("ru", "missing ) in parenthetical", "пропущена ) в иерархии");
addTranslation("ru", "identifier is a reserved word", "идентификатор является зарезервированным словом");
addTranslation("ru", "missing ( before catch-block condition", "пропущена ( перед условием структуры catch");
addTranslation("ru", "invalid catch block condition", "некорректное условие конструктора catch");
addTranslation("ru", "any catch clauses following an unqualified catch are unreachable", "любой catch делает предшествующие catch недоступными");
addTranslation("ru", "missing '{' before try block", "пропущена '{' перед try конструкцией");
addTranslation("ru", "missing '{' before catch-block body", "пропущена '{' перед catch конструкцией");
addTranslation("ru", "'try' without 'catch' or 'finally'", "'try' без 'catch' или 'finally'");
addTranslation("ru", "function %s does not always return a value", "функция %s не всегда возвращает значение");
addTranslation("ru", "anonymous function does not always return a value", "анонимная функция не всегда возвращает значение");
addTranslation("ru", "return statement is inconsistent with previous usage", "объявление return не поддерживается предыдущим использованием");
addTranslation("ru", "TypeError: generator function %s returns a value", "TypeError: функция генератора %s вернула значение");
addTranslation("ru", "TypeError: anonymous generator function returns a value", "TypeError: анонимная функция генератора вернула значение");
addTranslation("ru", "syntax error", "синтаксическая ошибка");
addTranslation("ru", "Unexpected end of file", "Неожиданный конец файла");
addTranslation("ru", "illegally formed XML syntax", "недопустимо составленный XML синтаксис");
addTranslation("ru", "XML runtime not available", "Среда XML не доступна");
addTranslation("ru", "Too deep recursion while parsing", "Слишком глубокая рекурсия для отработки");
addTranslation("ru", "Too many constructor arguments", "Слишком много аргументов конструктора");
addTranslation("ru", "Too many function arguments", "Слишком много аргументов функции");
addTranslation("ru", "Code has no side effects", "Код не имеет сторонних эффектов");
addTranslation("ru", "Extraneous trailing semicolon", "Перебор точек с запятой");
addTranslation("ru", "Trailing comma is not legal in an ECMA-262 object initializer", "Использование запятых не допускается в ECMA-262 объявлении объекта");
addTranslation("ru", "Trailing comma in array literal has different cross-browser behavior", "Использование запятых в массиве имеет различное поведение в браузерах");
addTranslation("ru", "Test for equality (==) mistyped as assignment (=)?", "Тест на сравнение (==) перепутан с приравниванием (=)?");
addTranslation("ru", "Variable %s hides argument", "Переменная %s скрывает аргумент");
addTranslation("ru", "Missing = in destructuring declaration", "Пропущено = в разрушающемся объявлении");
addTranslation("ru", "Octal numbers prohibited in strict mode.", "Двухбитные числа запрещены в строгом режиме.");
addTranslation("ru", "Property \"%s\" already defined in this object literal", "Свойство \"%s\" уже создано в этом объекте.");
addTranslation("ru", "Parameter \"%s\" already declared in this function.", "Параметр \"%s\" уже объявлен в этой функции.");
addTranslation("ru", "\"%s\" is not a valid identifier for this use in strict mode.", "\"%s\" не является правильным идентификатором для использования в строгом режиме.");
// ScriptRuntime
addTranslation("ru", "This operation is not allowed.", "Эта операция запрещена.");
addTranslation("ru", "%s has no properties.", "%s не имеет свойств.");
addTranslation("ru", "Invalid iterator value", "Некорректное перечисляемое значение");
addTranslation("ru", "__iterator__ returned a primitive value", "__iterator__ вернул примитивное значение");
addTranslation("ru", "Assignment to undeclared variable %s", "Обращение к необъявленной переменной %s");
addTranslation("ru", "Reference to undefined property \"%s\"", "Ссылка на пустое свойство \"%s\"");
addTranslation("ru", "Property %s not found.", "Свойство %s не найдено.");
addTranslation("ru", "Cannot set property %s that has only a getter.", "Нельзя изменить свойство %s, имеющее только getter.");
addTranslation("ru", "Invalid JavaScript value of type %s", "Некорректное JavaScript значение типа %s");
addTranslation("ru", "Primitive type expected (had %s instead)", "Примитив упущен (использован %s вместо этого)");
addTranslation("ru", "Namespace object expected to left of :: (found %s instead)", "Пространство имен упущено слева от :: (найдено %s вместо этого)");
addTranslation("ru", "Cannot convert null to an object.", "Невозможно преобразовать null в объект.");
addTranslation("ru", "Cannot convert undefined to an object.", "Невозможно преобразовать undefined в объект.");
addTranslation("ru", "Cyclic %s value not allowed.", "Цикличное значение %s запрещено.");
addTranslation("ru", "\"%s\" is not defined.", "\"%s\" не объявлено.");
addTranslation("ru", "Cannot read property \"%s\" from %s", "Не удается прочитать свойство \"%s\" из %s");
addTranslation("ru", "Cannot set property \"%s\" of %s to \"%s\"", "Не удается изменить свойство \"%s\" из %s на \"%s\"");
addTranslation("ru", "Cannot delete property \"%s\" of %s", "Не удается удалить свойство \"%s\" из %s");
addTranslation("ru", "Cannot call method \"%s\" of %s", "Не удается вызвать метод \"%s\" из %s");
addTranslation("ru", "Cannot apply \"with\" to %s", "Не удается применить \"with\" к %s");
addTranslation("ru", "%s is not a function, it is %s.", "%s не функция, это %s.");
addTranslation("ru", "Cannot call property %s in object %s. It is not a function, it is \"%s\".", "Не удается выполнить свойство %s в объекте %s. Это не функция, это \"%s\".");
addTranslation("ru", "Cannot find function %s in object %s.", "Не удается найти функцию %s в объекте %s.");
addTranslation("ru", "Cannot find function %s.", "Не удается найти функцию %s.");
addTranslation("ru", "%s is not an xml object.", "%s не является xml объектом.");
addTranslation("ru", "%s is not a reference to read reference value.", "%s не является данными, чтобы прочитать их значение.");
addTranslation("ru", "%s is not a reference to set reference value to %s.", "%s не является данными, чтобы установить им значение на %s.");
addTranslation("ru", "Function %s can not be used as the left-hand side of assignment or as an operand of ++ or -- operator.", "Функция %s не может быть использована по левую часть выражения или в виде операндов с ++ и -- операторами.");
addTranslation("ru", "Object's getDefaultValue() method returned an object.", "Метод getDefaultValue() объекта вернул объект.");
addTranslation("ru", "Can't use 'instanceof' on a non-object.", "Нельзя использовать 'instanceof' на не-объекте.");
addTranslation("ru", "'prototype' property of %s is not an object.", "'prototype' свойство %s не является объектом.");
addTranslation("ru", "Can't use 'in' on a non-object.", "Нельзя использовать 'in' на не-объекте.");
addTranslation("ru", "illegal radix %s.", "недопустимое окончание %s");
// ScriptableObject
addTranslation("ru", "Cannot find default value for object.", "Не удается найти определенное значение для объекта.");
addTranslation("ru", "Cannot load class \"%s\" which has no zero-parameter constructor.", "Нельзя загрузить класс \"%s\", не имеющего конструктор с пустыми аргументами.");
addTranslation("ru", "Invalid method \"%s\": name \"%s\" is already in use.", "Некорректный метод \"%s\": имя \"%s\" уже задействовано.");
addTranslation("ru", "Can't define constructor or class %s since more than one constructor has multiple parameters.", "Не удается объявить конструктор или класс %s, так как несколько конструкторов имеют несколько параметров.");
addTranslation("ru", "%s must extend ScriptableObject in order to define property %s.", "%s должен быть унаследован от ScriptableObject, чтобы объявить свойство %s.");
addTranslation("ru", "In order to define a property, getter %s must have zero parameters or a single ScriptableObject parameter.", "Чтобы объявить свойство, getter %s должен не иметь параметров или один ScriptableObject параметром.");
addTranslation("ru", "Expected static or delegated getter %s to take a ScriptableObject parameter.", "Упущен статичный или объявленный getter %s для получения ScriptableObject параметром.");
addTranslation("ru", "Getter and setter must both be static or neither be static.", "Getter и setter должны быть оба статичными.");
addTranslation("ru", "Setter must have void return type: %s", "Setter не должен ничего возвращать: %s");
addTranslation("ru", "Two-parameter setter must take a ScriptableObject as its first parameter.", "Двух-параметрный setter должен принимать ScriptableObject первым параметром.");
addTranslation("ru", "Expected single parameter setter for %s", "Упущен единственный параметр setter'а для %s");
addTranslation("ru", "Expected static or delegated setter %s to take two parameters.", "Упущен статичный или объявленный setter %s, чтобы принять два параметра.");
addTranslation("ru", "Expected either one or two parameters for setter.", "Упущен по крайней мере один или два параметра для setter'а.");
addTranslation("ru", "Unsupported parameter type \"%s\" in setter \"%s\".", "Неподдерживаемый тип параметра \"%s\" в setter'е \"%s\".");
addTranslation("ru", "Cannot add a property to a sealed object: %s.", "Не удается добавить свойство в замороженный объект: %s.");
addTranslation("ru", "Cannot remove a property from a sealed object: %s.", "Не удается удалить свойство из замороженного объекта: %s.");
addTranslation("ru", "Cannot modify a property of a sealed object: %s.", "Не удается изменить свойство в замороженном объекте: %s.");
addTranslation("ru", "Cannot modify readonly property: %s.", "Нельзя изменить свойство, открытое только для чтения: %s.");
addTranslation("ru", "Cannot be both a data and an accessor descriptor.", "Не удается использовать и данные, и открытый дескриптор.");
addTranslation("ru", "Cannot change the configurable attribute of \"%s\" from false to true.", "Не удается изменить настраиваемый атрибут из \"%s\" с false на true.");
addTranslation("ru", "Cannot change the enumerable attribute of \"%s\" because configurable is false.", "Не удается изменить перечисляемый атрибут из \"%s\", поскольку configurable отключено.");
addTranslation("ru", "Cannot change the writable attribute of \"%s\" from false to true because configurable is false.", "Не удается изменить перезаписываемый атрибут из \"%s\" с false на true, поскольку configurable отключено.");
addTranslation("ru", "Cannot change the value of attribute \"%s\" because writable is false.", "Не удается изменить значение атрибута из \"%s\,; поскольку writable отключено.");
addTranslation("ru", "Cannot change the get attribute of \"%s\" because configurable is false.", "Не удается изменить атрибут get из \"%s\", поскольку configurable отключено.");
addTranslation("ru", "Cannot change the set attribute of \"%s\" because configurable is false.", "Не удается изменить атрибут set из \"%s\", поскольку configurable отключено.");
addTranslation("ru", "Cannot change \"%s\" from a data property to an accessor property because configurable is false.", "Не удается изменить \"%s\" из источника данных к самому свойству, поскольку configurable отключено.");
addTranslation("ru", "Cannot change \"%s\" from an accessor property to a data property because configurable is false.", "Не удается изменить \"%s\" из самого свойства к источнику данных, поскольку configurable отключено.");
addTranslation("ru", "Cannot add properties to this object because extensible is false.", "Не удается добавить свойства к this, поскольку extensible отключено.");
// TokenStream
addTranslation("ru", "missing exponent", "упущен экспонент");
addTranslation("ru", "number format error", "проблема в формате числа");
addTranslation("ru", "unterminated string literal", "незавершенная строка");
addTranslation("ru", "unterminated comment", "незавершенный комментарий");
addTranslation("ru", "unterminated regular expression literal", "незавершенное регулярное выражение");
addTranslation("ru", "invalid flag after regular expression", "некорректный флаг после регулярного выражения");
addTranslation("ru", "no input for %s", "нет входной части для %s");
addTranslation("ru", "illegal character", "недопустимый символ");
addTranslation("ru", "invalid Unicode escape sequence", "некорректная Unicode завершающая цепочка");
addTranslation("ru", "not a valid default namespace statement. Syntax is: default xml namespace = EXPRESSION;", "неправильное стандартное пространство имен. Синтакс таков: default xml namespace = ВЫРАЖЕНИЕ;");
// TokensStream warnings
addTranslation("ru", "illegal octal literal digit %s; interpreting it as a decimal digit", "недопустимое двухбитное число %s; интерпретация в виде десятичного");
addTranslation("ru", "illegal usage of future reserved keyword %s; interpreting it as ordinary identifier", "недопустимое использование зарезервированного в будущем слова %s; интерпретация в виде обычного идентификатора");
// LiveConnect errors
addTranslation("ru", "Internal error: type conversion of %s to assign to %s on %s failed.", "Внутренняя ошибка: попытка преобразования %s в %s из %s прошла неудачно.");
addTranslation("ru", "Can't find converter method \"%s\" on class %s.", "Не удается найти метод преобразования \"%s\" в классе %s.");
addTranslation("ru", "Java method \"%s\" cannot be assigned to.", "Java метод \"%s\" не может быть приведен.");
addTranslation("ru", "Internal error: attempt to access private/protected field \"%s\".", "Внутренняя ошибка: не удалось получить доступ к приватному/защищенному полю \"%s\".");
addTranslation("ru", "Can't find method %s.", "Не удалось найти метод %s.");
addTranslation("ru", "Script objects are not constructors.", "Скриптовые объекты не являются конструкторами.");
addTranslation("ru", "Java method \"%s\" was invoked with %s as \"this\" value that can not be converted to Java type %s.", "Java метод \"%s\" был вызван с %s, где \"this\" не может быть приведен к Java типу %s.");
addTranslation("ru", "Java class \"%s\" has no public instance field or method named \"%s\".", "Java класс \"%s\" не имеет публичного значения или метода под названием \"%s\".");
addTranslation("ru", "Array index %s is out of bounds [0..%s].", "Индекс массива %s выходит за рамки [0..%s].");
addTranslation("ru", "Java arrays have no public instance fields or methods named \"%s\".", "Java массивы не имеют публичного значения или метода под названием \"%s\".");
addTranslation("ru", "Java package names may not be numbers.", "Имена Java пакетов не могут быть числами.");
addTranslation("ru", "Access to Java class \"%s\" is prohibited.", "Доступ к Java классу \"%s\" запрещен.");
// ImporterTopLevel
addTranslation("ru", "Ambiguous import: \"%s\" and and \"%s\".", "Непонятный импорт: \"%s\" и еще \"%s\".");
addTranslation("ru", "Function importPackage must be called with a package; had \"%s\" instead.", "Функция importPackage должна быть вызвана на пакете; вместо этого \"%s\".");
addTranslation("ru", "Function importClass must be called with a class; had \"%s\" instead.", "Функция importClass должна быть вызвана на классе; вместо этого \"%s\".");
addTranslation("ru", "\"%s\" is neither a class nor a package.", "\"%s\" не является ни классом, ни пакетом.");
addTranslation("ru", "Cannot import \"%s\" since a property by that name is already defined.", "Не удается импортировать \"%s\", так как свойство под этим именем уже объявлено.");
// JavaAdapter
addTranslation("ru", "JavaAdapter requires at least one argument.", "JavaAdapter требует по крайней мере один аргумент.");
addTranslation("ru", "Argument %s is not Java class: %s.", "Аргумент %s не является Java классом: %s.");
addTranslation("ru", "Only one class may be extended by a JavaAdapter. Had %s and %s.", "Только один класс может быть унаследован JavaAdapter'ом. Здесь же %s и %s.");
// Arrays
addTranslation("ru", "Inappropriate array length.", "Недопустимый размер массива.");
addTranslation("ru", "Array length %s exceeds supported capacity limit.", "Размер массива %s превышает максимально доступный лимит.");
addTranslation("ru", "Reduce of empty array with no initial value", "Уменьшается пустой массив без единого значения");
// URI
addTranslation("ru", "Malformed URI sequence.", "Неправильная последовательность URI.");
// Number
addTranslation("ru", "Precision %s out of range.", "Числительное %s выходит из границ.");
// NativeGenerator
addTranslation("ru", "Attempt to send value to newborn generator", "Попытка послать значение в созданный генератор");
addTranslation("ru", "Already executing generator", "Генератор уже выполняется");
addTranslation("ru", "StopIteration may not be changed to an arbitrary object.", "StopIteration не может быть заменен прочим объектом.");
// Interpreter
addTranslation("ru", "Yield from closing generator", "Задержка с закрывающей конструкции");
addTranslation("ru", "%s.prototype.%s method called on null or undefined", "%s.prototype.%s метод вызван на null или undefined");
addTranslation("ru", "First argument to %s.prototype.%s must not be a regular expression", "Первый аргумент для %s.prototype.%s не должен быть обычным выражением.");
/**
 * Fetches error message and represent it
 * into localized string without source.
 * @param {Error|string} error to localize
 * @returns {string} represented stroke
 */
localizeError = function (error) {
    var message = fetchErrorMessage(error);
    if (error instanceof java.lang.Object) {
        MCSystem.throwException("Stacktrace: unsupported localize error type: " + error);
    }
    else if (error && typeof error == "object") {
        var retraced = retraceToArray(error.stack)[0];
        error = sliceMessageWithoutTrace(message, retraced);
    }
    return translateMessage(error);
};
/**
 * Reports catched modification errors,
 * may used in [[catch]]-block when any throw
 * code occurs. Stacktrace will be displayed
 * on display with sources hieracly.
 * @param {Error|any} value to report
 */
reportTrace = function (error) {
    if (error === undefined) {
        return;
    }
    if (error instanceof java.lang.Object) {
        MCSystem.throwException("" + error);
    }
    if (reportTrace.isReporting) {
        if (!Array.isArray(reportTrace.handled)) {
            reportTrace.handled = [];
        }
        reportTrace.handled.push(error);
        if (reportTrace.handled.length > 8) {
            reportTrace.handled.shift();
        }
        return;
    }
    var date = reportTrace.fetchTime();
    reportTrace.isReporting = true;
    UI.getContext().runOnUiThread(function () {
        var builder = new android.app.AlertDialog.Builder(UI.getContext(), android.R.style.Theme_DeviceDefault_DialogWhenLarge);
        builder.setTitle(fetchErrorName(error));
        builder.setCancelable(false);
        builder.setMessage(Translation.translate("Preparing report"));
        builder.setPositiveButton(Translation.translate("Understand"), null);
        builder.setNeutralButton(Translation.translate("Leave"), function () {
            delete reportTrace.handled;
        });
        var code = reportTrace.toCode(error);
        builder.setNegativeButton(code, function () {
            posted.export = true;
            new java.lang.Thread(function () {
                while (posted.inProcess()) {
                    java.lang.Thread.yield();
                }
                saveOrRewrite(code, posted.toResult());
            }).start();
        });
        var dialog = builder.create();
        dialog.setOnDismissListener(function () {
            delete reportTrace.isReporting;
            var next = reportTrace.findNextTrace();
            next !== null && reportTrace(next);
            !posted.export && posted.cancel();
        });
        var popup = dialog.getWindow();
        popup.setLayout(UI.getContext().getWindowManager().getDefaultDisplay().getWidth() / 1.35, android.view.ViewGroup.LayoutParams.WRAP_CONTENT);
        popup.clearFlags(android.view.WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS);
        var posted = reportTrace.postUpdate(dialog, error, date);
        dialog.show();
        var view = popup.findViewById(android.R.id.message);
        if (view != null) {
            view.setTextIsSelectable(true);
            view.setTextSize(view.getTextSize() * 0.475);
        }
    });
};
reportTrace.handled = [];
reportTrace.postUpdate = function (dialog, error, date) {
    var handler = android.os.Handler.createAsync(dialog.getContext().getMainLooper(), new android.os.Handler.Callback({
        handleMessage: function (message) {
            return false;
        }
    })), completed = false, formatted, update;
    new java.lang.Thread(function () {
        var message = fetchErrorMessage(error), retraced = retraceToArray(error ? error.stack : null);
        retraced.length > 0 && retraced.pop();
        var sliced = sliceMessageWithoutTrace(message, retraced[0]), localized = translateMessage(sliced);
        update = new java.lang.Runnable(function () {
            var additional = [];
            if (message != null) {
                var entry = "<font color=\"#CCCC33\">";
                if (localized != sliced) {
                    entry += localized + "<br/>";
                }
                entry += sliced + "</font>";
                additional.push(entry);
            }
            for (var i = 0; i < retraced.length; i++) {
                var element = requested.formatted[i];
                if (element !== undefined) {
                    additional.push(element);
                    continue;
                }
                if (additional.length < 2) {
                    additional.push("");
                }
                additional.push(retraced[i]);
            }
            var attached = [];
            if (additional.length > 0) {
                attached.push(additional.join("<br/>"));
            }
            var marked = "";
            marked += new Date(launchTime).toString();
            if (date > 0) {
                marked += "<br/>" + new Date(launchTime + date).toString();
                marked += "<br/>" + Translation.translate("Milliseconds estimated after launch") + ": " + date;
            }
            attached.push(marked);
            if (requested.error) {
                attached.push("<font color=\"#DD3333\">" + Translation.translate("Wouldn't fetch modification sources") +
                    ": " + localizeError(requested.error) + "</font>");
            }
            formatted = android.text.Html.fromHtml(attached.join("<br/><br/>"));
            dialog.setMessage(formatted);
            if (requested.completed) {
                completed = true;
            }
        });
        var requested = reportTrace.handleRequest(handler, update, retraced);
        handler.post(update);
    }).start();
    return {
        inProcess: function () {
            return !completed;
        },
        toResult: function () {
            return formatted !== undefined ? formatted.toString() : "";
        },
        cancel: function () {
            if (update !== undefined) {
                handler.removeCallbacks(update);
            }
        }
    };
};
reportTrace.processFile = function (file, where) {
    if (typeof where != "number" || where === NaN) {
        return null;
    }
    var strokes = [];
    if (!isValidFile(file)) {
        return strokes;
    }
    var scanner = new java.io.FileReader(file), reader = java.io.BufferedReader(scanner), wasErrorLines = false, encounted = 0, hieracly = 0, count = 0, included, another, line;
    // Up to 3 lines before and 4 after throw place
    while (count < where + 3 && (line = reader.readLine())) {
        count++;
        encounted++;
        line = "" + line;
        if (line.startsWith("// file: ")) {
            included = line.substring(9);
            encounted = -1;
        }
        if (count > where - 3) {
            if (count == where) {
                wasErrorLines = true;
                another = encounted;
            }
            else if (/\}|\]/.test(line)) {
                // Simple construction detection
                if (hieracly > 0) {
                    hieracly--;
                }
                else if (wasErrorLines) {
                    wasErrorLines = false;
                }
            }
            if (count >= where && /\{|\[/.test(line)) {
                hieracly++;
            }
            strokes.push("<font face=\"monospace\"><small>" + count + "</small> " +
                (wasErrorLines ? "<font color=\"#DD3333\">" + line + "</font>" : line) + "</font>");
        }
    }
    if (strokes.length >= 3) {
        if (included !== undefined) {
            strokes.push("<i>" + Translation.translate("Defined at") + " " + included + ":" + another + "</i>");
        }
        return strokes;
    }
    // No exception found here
    return [];
};
reportTrace.processSources = function (related, resolved, where) {
    if (typeof where != "number" || where === NaN) {
        return null;
    }
    var strokes = [];
    if (related == null || typeof related != "object") {
        return strokes;
    }
    for (var mod in related) {
        var sources = related[mod], directory = setupLoadedSources.sources[mod].dir;
        for (var i = 0; i < sources.length; i++) {
            var file = new java.io.File(directory, sources[i]), result = reportTrace.processFile(file, where);
            if (result && result.length > 0) {
                strokes = strokes.concat(result);
                break;
            }
        }
        if (strokes.length > 0) {
            if (!(getModName(mod) == resolved.source || setupLoadedSources.sources[mod].dir.endsWith("/" + resolved.source + "/"))) {
                strokes.push("<small><font color=\"#CCCC33\">" + Translation.translate("Source may be incorrectly") + "</font></small>");
            }
            break;
        }
    }
    return strokes;
};
reportTrace.processStack = function (resolved) {
    var strokes = [], where = parseInt(resolved.line) + 1;
    strokes.push((resolved.source ? resolved.source + " " + Translation.translate("from") + " " : "") + resolved.file +
        (resolved.where ? " (" + resolved.where + ")" : "") + " " + Translation.translate("at line") + " " + where);
    var sources = findRelatedSources(resolved.source, resolved.file), processed = reportTrace.processSources(sources, resolved, where);
    if (processed != null && processed.length > 0) {
        strokes[0] = "<br/>" + strokes[0];
        strokes = strokes.concat(processed);
    }
    return strokes.join("<br/>");
};
reportTrace.handleRequest = function (handler, update, trace) {
    var requested = {};
    requested.formatted = [];
    new java.lang.Thread(function () {
        try {
            for (var i = 0; i < trace.length; i++) {
                var resolved = resolveTraceSource(trace[i]);
                if (resolved === null)
                    continue;
                var processed = reportTrace.processStack(resolved);
                requested.formatted.push(processed);
                handler.post(update);
            }
        }
        catch (e) {
            requested.error = e;
            try {
                handler.post(update);
            }
            catch (e) {
                print(e.message);
            }
        }
        requested.completed = true;
    }).start();
    return requested;
};
reportTrace.findNextTrace = function () {
    var handled = this.handled;
    if (!Array.isArray(handled)) {
        return null;
    }
    if (handled.length > 0) {
        return handled.shift();
    }
    return null;
};
reportTrace.fetchTime = function () {
    return Date.now() - launchTime;
};
reportTrace.toCode = function (error) {
    var message = "" + error;
    if (error && typeof error == "object") {
        var fetched = fetchErrorMessage(error.message);
        fetched !== null && (message = fetched);
        if (error.stack !== undefined) {
            message += "\n" + error.stack;
        }
    }
    var encoded = new java.lang.String(message);
    return "NE-" + Math.abs(encoded.hashCode());
};
reportTrace.setupPrint = function (action) {
    if (typeof action != "function") {
        return delete print;
    }
    return !!(print = action);
};
reportTrace.reloadModifications = function () {
    setupLoadedSources(getLoadedModList());
};
EXPORT("localizeError", localizeError);
Callback.addCallback("PreBlocksDefined", function () {
    reportTrace.reloadModifications();
});
Callback.addCallback("CorePreconfigured", function () {
    reportTrace.reloadModifications();
});
if (this.isInstant !== undefined) {
    reportTrace.reloadModifications();
}
EXPORT("reportTrace", reportTrace);
