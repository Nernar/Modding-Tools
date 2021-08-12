/*

   Copyright 2021 Nernar (github.com/nernar)

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
	shared: true,
	api: "AdaptedScript"
});

let launchTime = Date.now();
let isHorizon = (function() {
	let version = MCSystem.getInnerCoreVersion();
	return parseInt(version.toString()[0]) >= 2;
})();

Object.defineProperty(this, "context", {
	get: function() {
		return UI.getContext();
	},
	enumerable: true,
	configurable: false
});

Object.defineProperty(this, "display", {
	get: function() {
		return context.getWindowManager().getDefaultDisplay();
	},
	enumerable: true,
	configurable: false
});

let findCorePackage = function() {
	return isHorizon ? Packages.com.zhekasmirnov.innercore : Packages.zhekasmirnov.launcher;
};

let findModLoader = function() {
	return findCorePackage().mod.build.ModLoader;
};

let getLoadedModList = function() {
	return findModLoader().instance.modsList;
};

let fetchScriptSources = function(mod) {
	let founded = new Object(),
		buildConfig = mod.buildConfig,
		sources = buildConfig.sourcesToCompile;
	for (let i = 0; i < sources.size(); i++) {
		let source = sources.get(i);
		founded[source.path] = source.sourceName;
	}
	let directory = buildConfig.defaultConfig.libDir;
	if (directory != null) {
		let folder = new java.io.File(mod.dir, directory);
		if (folder.exists() && folder.isDirectory()) {
			let libraries = folder.listFiles();
			for (let i = 0; i < libraries.length; i++) {
				let library = libraries[i].getName();
				founded[directory + library] = library;
			}
		}
	}
	return founded;
};

let Mods = new Object();
let Sources = new Object();

let setupLoadedSources = function(mods) {
	if (mods === null || mods === undefined) {
		MCSystem.throwException("Something went wrong when fetch modifications list");
	}
	for (let i = 0; i < mods.size(); i++) {
		let source = mods.get(i);
		Mods[source] = fetchScriptSources(source);
		Sources[source] = source;
	}
};

let getModName = function(id) {
	if (Sources.hasOwnProperty(id)) {
		let source = Sources[id];
		if (source) return String(source.getName());
	}
	return new String();
};

let findAvailabledMods = function(name) {
	let array = new Array();
	for (let element in Mods) {
		let mod = getModName(element);
		if (mod == name) {
			array.unshift(element);
		} else if (!name || mod.startsWith(name)) {
			array.push(element);
		}
	}
	return array;
};

let findRelatedSources = function(name, file) {
	let sources = findAvailabledMods(name);
	if (sources.length == 0) return new Array();
	let related = new Object();
	for (let i = 0; i < sources.length; i++) {
		let mod = sources[i],
			source = Mods[mod];
		for (let path in source) {
			let name = source[path];
			if (name == file) {
				if (!related.hasOwnProperty(mod)) {
					related[mod] = new Array();
				}
				related[mod].unshift(path);
			} else if (name.endsWith(file)) {
				if (!related.hasOwnProperty(mod)) {
					related[mod] = new Array();
				}
				related[mod].push(path);
			}
		}
	}
	return related;
};

Callback.addCallback("ModsLoaded", function() {
	let loaded = getLoadedModList();
	setupLoadedSources(loaded);
});

let Messages = {
	// Codegen
	"Duplicate parameter name \"%s\".": "Дублируется название параметра \"%s\".",
	"Program too complex: too big jump offset.": "Программа слишком большая: слишком большое расстояние между кодом.",
	"Program too complex: internal index exceeds 64K limit.": "Программа слишком большая: количество методов превышает 64К.",
	"Encountered code generation error while compiling function \"%s\": %s": "Произошла ошибка во время компиляции функции \"%s\": %s",
	"Encountered code generation error while compiling script: %s": "Произошла ошибка во время компиляции кода: %s",
	// Context
	"Constructor for \"%s\" not found.": "Конструктор для \"%s\" не найден.",
	"\"%s\" is not a constructor.": "\"%s\" не является конструктором.",
	// FunctionObject
	"Method or constructor \"%s\" must be static with the signature \"(Context cx, Object[] args, Function ctorObj, boolean inNewExpr)\" to define a variable arguments constructor.": "Метод или конструктор \"%s\" должен быть создан по принципу \"(Context кс, Object[] аргы, Function кторОбк, boolean вНовомВыр)\" для объявления переменной аргументов конструктора.",
	"Method \"%s\" must be static with the signature \"(Context cx, Scriptable thisObj, Object[] args, Function funObj)\" to define a variable arguments constructor.": "Метод \"%s\" должен быть создан по принципу \"(Context кс, Scriptable местоОбк, Object[] аргы, Function фунОбк)\" для объявления переменной аргументов конструктора.",
	"Method \"%s\" called on incompatible object.": "Метод \"%s\" вызван на неподдерживаемом объекте.",
	"Unsupported parameter type \"%s\" in method \"%s\".": "Неподдерживаемый тип для параметра \"%s\" в методе \"%s\".",
	"Unsupported return type \"%s\" in method \"%s\".": "Неподдерживаемый тип результата \"%s\" в методе \"%s\".",
	"Construction of objects of type \"%s\" is not supported.": "Создание объектов для типа \"%s\" не поддерживается.",
	"Method \"%s\" occurs multiple times in class \"%s\".": "Метод \"%s\" выполнился слишком много раз в классе \"%s\".",
	"Method \"%s\" not found in \"%s\".": "Метод \"%s\" не найден в \"%s\".",
	// IRFactory
	"Invalid left-hand side of for..in loop.": "Некорректная левая часть в for..in цикле.",
	"Only one variable allowed in for..in loop.": "Только одна переменная разрешена в for..in цикле.",
	"Left hand side of for..in loop must be an array of length 2 to accept key/value pair.": "Левая часть for..in цикла должна быть массивом с длиной 2, чтобы принять пару ключ/значение.",
	"Can't convert to type \"%s\".": "Невозможно привести к типу \"%s\".",
	"Invalid assignment left-hand side.": "Некорректная левая часть обращения.",
	"Invalid decrement operand.": "Некорректный операнд вычитания.",
	"Invalid increment operand.": "Некорректный операнд сложения.",
	"yield must be in a function.": "yield должен быть функцией.",
	"yield expression must be parenthesized.": "yield выражение должно быть направлено на родителя.",
	// NativeGlobal
	"Function \"%s\" must be called directly, and not by way of a function of another name.": "Функция \"%s\" должна быть вызвана напрямую, а также не с помощью функции по другому ключу.",
	"Calling eval() with anything other than a primitive string value will simply return the value. Is this what you intended?": "Вызов eval() на чем угодно кроме примитива строки просто вернет значение. Это то, чего вы ожидали?",
	"Calling eval() with anything other than a primitive string value is not allowed in strict mode.": "Вызов eval() на чем угодно кроме примитива строки запрещен в строгом режиме.",
	"Invalid destructuring assignment operator": "Некорректное обращение к оператору уничтожения",
	// NativeCall
	"\"%s\" may only be invoked from a \"new\" expression.": "\"%s\" может быть вызван только с помощью выражения \"new\".",
	"The \"%s\" constructor is deprecated.": "\"%s\" конструктор устарел.",
	// NativeFunction
	"no source found to decompile function reference %s": "не найден исходник для декомпиляции источника функции %s",
	"second argument to Function.prototype.apply must be an array": "второй аргумент для Function.prototype.apply должен быть массивом",
	// NativeGlobal
	"invalid string escape mask": "некорректная маска конца строки",
	// NativeJavaClass
	"error instantiating (%s): class %s is interface or abstract": "ошибка наследования (%s): класс %s является абстрактным, либо интерфейсом",
	"Found constructor with wrong signature: %s calling %s with signature %s": "Найден конструктор с неправильным принципом: %s вызывает %s по принципу %s",
	"Expected argument to getClass() to be a Java object.": "Упущен аргумент для getClass() в виде Java объекта.",
	"Java constructor for \"%s\" with arguments \"%s\" not found.": "Java конструктор для \"%s\" с аргументами \"%s\" не найден.",
	// NativeJavaMethod
	"The choice of Java method %s.%s matching JavaScript argument types (%s) is ambiguous; candidate methods are: %s": "Выбранный Java метод %s.%s, совпадающий с JavaScript аргументами (%s) не возможен; доступные методы: %s",
	"The choice of Java constructor %s matching JavaScript argument types (%s) is ambiguous; candidate constructors are: %s": "Выбранный Java конструктор %s, совпадающий с JavaScript аргументами (%s) не возможен; доступные конструкторы: %s",
	// NativeJavaObject
	"Cannot convert function to interface %s with no methods": "Нельзя преобразовать функцию в интерфейс %s без методов",
	"Cannot convert function to interface %s since it contains methods with different names": "Нельзя преобразовать функцию в интерфейс %s, так как тот содержит методы с различными именами",
	"Cannot convert %s to %s": "Нельзя преобразовать %s в %s",
	"Property \"%s\" is not defined in interface adapter": "Свойство \"%s\" не объявлено в адаптере интерфейса",
	"Property \"%s\" is not a function in interface adapter": "Свойство \"%s\" не является функцией в адаптере интерфейса",
	// NativeJavaPackage
	"Constructor for \"Packages\" expects argument of type java.lang.Classloader": "Конструктор для \"Packages\" упущен без аргумента java.lang.Classloader",
	// NativeRegExp
	"Invalid quantifier %s": "Некорректный дескриптор %s",
	"Overly large back reference %s": "Слишком большая обратная ссылка %s",
	"Overly large minimum %s": "Слишком большой минимум %s",
	"Overly large maximum %s": "Слишком большой максимум %s",
	"Zero quantifier %s": "Нулевой дескриптор %s",
	"Maximum %s less than minimum": "Максимум %s меньше чем минимум",
	"Unterminated quantifier %s": "Незавершенный дескриптор %s",
	"Unterminated parenthetical %s": "Незавершенная иерархия %s",
	"Unterminated character class %s": "Незавершенный символьный лист %s",
	"Invalid range in character class.": "Некорректная часть в символьном листе.",
	"Trailing \\ in regular expression.": "Использована \\ в обычном выражении.",
	"unmatched ) in regular expression.": "несовпадающая ) в регулярном выражении.",
	"Regular expressions are not available.": "Регулярные выражения не доступны.",
	"back-reference exceeds number of capturing parentheses.": "обратная ссылка превысила максимальное количество захваченных родителей.",
	"Only one argument may be specified if the first argument to RegExp.prototype.compile is a RegExp object.": "Только один аргумент может быть использован, если первый аргумент в RegExp.prototype.compile является RegExp.",
	"Expected argument of type object, but instead had type %s": "Упущен аргумент в виде объекта, вместо этого имеющий тип %s",
	// NativeDate
	"Date is invalid.": "Некорректная дата.",
	"toISOString must return a primitive value, but instead returned \"%s\"": "toISOString должно вернуть примитив, но вместо этого вернуло \"%s\"",
	// Parser
	"Compilation produced %s syntax errors.": "Компиляция выявила %s синтаксических ошибок.",
	"TypeError: redeclaration of var %s.": "TypeError: редекларация значения %s.",
	"TypeError: redeclaration of const %s.": "TypeError: редекларация константы %s.",
	"TypeError: redeclaration of variable %s.": "TypeError: редекларация переменной %s.",
	"TypeError: redeclaration of formal parameter %s.": "TypeError: редекларация обязательного параметра %s.",
	"TypeError: redeclaration of function %s.": "TypeError: редекларация функции %s.",
	"SyntaxError: let declaration not directly within block": "SyntaxError: декларация let находится вне конструкции",
	"SyntaxError: invalid object initializer": "SyntaxError: некорректный инициализатор объекта",
	// NodeTransformer
	"duplicated label": "повторяющаяся ссылка",
	"undefined label": "пустая ссылка",
	"unlabelled break must be inside loop or switch": "break без ссылок должен быть внутри цикла или switch",
	"continue must be inside loop": "continue должен быть внутри цикла",
	"continue can only use labeles of iteration statements": "continue может использовать только ссылки перечисляемых конструкций",
	"Line terminator is not allowed between the throw keyword and throw expression.": "Разделитель строки не может быть использован между throw и его выражением.",
	"missing ( before function parameters.": "пропущена ( после параметров функции.",
	"missing formal parameter": "пропущен обязательный параметр",
	"missing ) after formal parameters": "пропущена ) после обязательных параметров",
	"missing '{' before function body": "пропущена '{' перед конструкцией функции",
	"missing } after function body": "пропущена } после конструкции функции",
	"missing ( before condition": "пропущена ( перед условием",
	"missing ) after condition": "пропущена ) после условия",
	"missing ; before statement": "пропущена ; перед выражением",
	"missing ; after statement": "пропущена ; после выражения",
	"missing name after . operator": "пропущено имя после . оператора",
	"missing name after :: operator": "пропущено имя после :: оператора",
	"missing name after .. operator": "пропущено имя после .. оператора",
	"missing name after .@": "пропущено имя после .@",
	"missing ] in index expression": "пропущена ] в обозначении индекса",
	"missing ( before switch expression": "пропущена ( перед конструкцией switch",
	"missing ) after switch expression": "пропущена ) после конструкции switch",
	"missing '{' before switch body": "пропущена '{' перед телом switch",
	"invalid switch statement": "некорректное switch выражение",
	"missing : after case expression": "пропущено : после case выражения",
	"double default label in the switch statement": "дублируется default ссылка в switch выражении",
	"missing while after do-loop body": "пропущено while после структуры do",
	"missing ( after for": "пропущена ( после for",
	"missing ; after for-loop initializer": "пропущена ; после инициализатора цикла for",
	"missing ; after for-loop condition": "пропущена ; после условия цикла for",
	"missing in after for": "пропущено in после for",
	"missing ) after for-loop control": "пропущена ) после обозначения цикла for",
	"missing ( before with-statement object": "пропущена ( перед объектом конструкции with",
	"missing ) after with-statement object": "пропущена ) после объекта конструкции with",
	"with statements not allowed in strict mode": "использование with запрещено в строгом режиме",
	"missing ( after let": "пропущена ( после let",
	"missing ) after variable list": "пропущена ) после списка переменных",
	"missing } after let statement": "пропущена } после выражения let",
	"invalid return": "некорректный return",
	"missing } in compound statement": "пропущена } в корневом выражении",
	"invalid label": "некорректная ссылка",
	"missing variable name": "пропущено имя переменной",
	"invalid variable initialization": "некорректное создание переменной",
	"missing : in conditional expression": "пропущено : в условном выражении",
	"missing ) after argument list": "пропущена ) после списка аргументов",
	"missing ] after element list": "пропущена ] после списка элементов",
	"invalid property id": "некорректный идентификатор свойства",
	"missing : after property id": "пропущено : после идентификатора свойства",
	"missing } after property list": "пропущена } после списка свойств",
	"missing ) in parenthetical": "пропущена ) в иерархии",
	"identifier is a reserved word": "идентификатор является зарезервированным словом",
	"missing ( before catch-block condition": "пропущена ( перед условием структуры catch",
	"invalid catch block condition": "некорректное условие конструктора catch",
	"any catch clauses following an unqualified catch are unreachable": "любой catch делает предшествующие catch недоступными",
	"missing '{' before try block": "пропущена '{' перед try конструкцией",
	"missing '{' before catch-block body": "пропущена '{' перед catch конструкцией",
	"'try' without 'catch' or 'finally'": "'try' без 'catch' или 'finally'",
	"function %s does not always return a value": "функция %s не всегда возвращает значение",
	"anonymous function does not always return a value": "анонимная функция не всегда возвращает значение",
	"return statement is inconsistent with previous usage": "объявление return не поддерживается предыдущим использованием",
	"TypeError: generator function %s returns a value": "TypeError: функция генератора %s вернула значение",
	"TypeError: anonymous generator function returns a value": "TypeError: анонимная функция генератора вернула значение",
	"syntax error": "синтаксическая ошибка",
	"Unexpected end of file": "Неожиданный конец файла",
	"illegally formed XML syntax": "недопустимо составленный XML синтаксис",
	"XML runtime not available": "Среда XML не доступна",
	"Too deep recursion while parsing": "Слишком глубокая рекурсия для отработки",
	"Too many constructor arguments": "Слишком много аргументов конструктора",
	"Too many function arguments": "Слишком много аргументов функции",
	"Code has no side effects": "Код не имеет сторонних эффектов",
	"Extraneous trailing semicolon": "Перебор точек с запятой",
	"Trailing comma is not legal in an ECMA-262 object initializer": "Использование запятых не допускается в ECMA-262 объявлении объекта",
	"Trailing comma in array literal has different cross-browser behavior": "Использование запятых в массиве имеет различное поведение в браузерах",
	"Test for equality (==) mistyped as assignment (=)?": "Тест на сравнение (==) перепутан с приравниванием (=)?",
	"Variable %s hides argument": "Переменная %s скрывает аргумент",
	"Missing = in destructuring declaration": "Пропущено = в разрушающемся объявлении",
	"Octal numbers prohibited in strict mode.": "Двухбитные числа запрещены в строгом режиме.",
	"Property \"%s\" already defined in this object literal": "Свойство \"%s\" уже создано в этом объекте.",
	"Parameter \"%s\" already declared in this function.": "Параметр \"%s\" уже объявлен в этой функции.",
	"\"%s\" is not a valid identifier for this use in strict mode.": "\"%s\" не является правильным идентификатором для использования в строгом режиме.",
	// ScriptRuntime
	"This operation is not allowed.": "Эта операция запрещена.",
	"%s has no properties.": "%s не имеет свойств.",
	"Invalid iterator value": "Некорректное перечисляемое значение",
	"__iterator__ returned a primitive value": "__iterator__ вернул примитивное значение",
	"Assignment to undeclared variable %s": "Обращение к необъявленной переменной %s",
	"Reference to undefined property \"%s\"": "Ссылка на пустое свойство \"%s\"",
	"Property %s not found.": "Свойство %s не найдено.",
	"Cannot set property %s that has only a getter.": "Нельзя изменить свойство %s, имеющее только getter.",
	"Invalid JavaScript value of type %s": "Некорректное JavaScript значение типа %s",
	"Primitive type expected (had %s instead)": "Примитив упущен (использован %s вместо этого)",
	"Namespace object expected to left of :: (found %s instead)": "Пространство имен упущено слева от :: (найдено %s вместо этого)",
	"Cannot convert null to an object.": "Невозможно преобразовать null в объект.",
	"Cannot convert undefined to an object.": "Невозможно преобразовать undefined в объект.",
	"Cyclic %s value not allowed.": "Цикличное значение %s запрещено.",
	"\"%s\" is not defined.": "\"%s\" не объявлено.",
	"Cannot read property \"%s\" from %s": "Не удается прочитать свойство \"%s\" из %s",
	"Cannot set property \"%s\" of %s to \"%s\"": "Не удается изменить свойство \"%s\" из %s на \"%s\"",
	"Cannot delete property \"%s\" of %s": "Не удается удалить свойство \"%s\" из %s",
	"Cannot call method \"%s\" of %s": "Не удается вызвать метод \"%s\" из %s",
	"Cannot apply \"with\" to %s": "Не удается применить \"with\" к %s",
	"%s is not a function, it is %s.": "%s не функция, это %s.",
	"Cannot call property %s in object %s. It is not a function, it is \"%s\".": "Не удается выполнить свойство %s в объекте %s. Это не функция, это \"%s\".",
	"Cannot find function %s in object %s.": "Не удается найти функцию %s в объекте %s.",
	"Cannot find function %s.": "Не удается найти функцию %s.",
	"%s is not an xml object.": "%s не является xml объектом.",
	"%s is not a reference to read reference value.": "%s не является данными, чтобы прочитать их значение.",
	"%s is not a reference to set reference value to %s.": "%s не является данными, чтобы установить им значение на %s.",
	"Function %s can not be used as the left-hand side of assignment or as an operand of ++ or -- operator.": "Функция %s не может быть использована по левую часть выражения или в виде операндов с ++ и -- операторами.",
	"Object's getDefaultValue() method returned an object.": "Метод getDefaultValue() объекта вернул объект.",
	"Can't use 'instanceof' on a non-object.": "Нельзя использовать 'instanceof' на не-объекте.",
	"'prototype' property of %s is not an object.": "'prototype' свойство %s не является объектом.",
	"Can't use 'in' on a non-object.": "Нельзя использовать 'in' на не-объекте.",
	"illegal radix %s.": "недопустимое окончание %s",
	// ScriptableObject
	"Cannot find default value for object.": "Не удается найти определенное значение для объекта.",
	"Cannot load class \"%s\" which has no zero-parameter constructor.": "Нельзя загрузить класс \"%s\", не имеющего конструктор с пустыми аргументами.",
	"Invalid method \"%s\": name \"%s\" is already in use.": "Некорректный метод \"%s\": имя \"%s\" уже задействовано.",
	"Can't define constructor or class %s since more than one constructor has multiple parameters.": "Не удается объявить конструктор или класс %s, так как несколько конструкторов имеют несколько параметров.",
	"%s must extend ScriptableObject in order to define property %s.": "%s должен быть унаследован от ScriptableObject, чтобы объявить свойство %s.",
	"In order to define a property, getter %s must have zero parameters or a single ScriptableObject parameter.": "Чтобы объявить свойство, getter %s должен не иметь параметров или один ScriptableObject параметром.",
	"Expected static or delegated getter %s to take a ScriptableObject parameter.": "Упущен статичный или объявленный getter %s для получения ScriptableObject параметром.",
	"Getter and setter must both be static or neither be static.": "Getter и setter должны быть оба статичными.",
	"Setter must have void return type: %s": "Setter не должен ничего возвращать: %s",
	"Two-parameter setter must take a ScriptableObject as its first parameter.": "Двух-параметрный setter должен принимать ScriptableObject первым параметром.",
	"Expected single parameter setter for %s": "Упущен единственный параметр setter'а для %s",
	"Expected static or delegated setter %s to take two parameters.": "Упущен статичный или объявленный setter %s, чтобы принять два параметра.",
	"Expected either one or two parameters for setter.": "Упущен по крайней мере один или два параметра для setter'а.",
	"Unsupported parameter type \"%s\" in setter \"%s\".": "Неподдерживаемый тип параметра \"%s\" в setter'е \"%s\".",
	"Cannot add a property to a sealed object: %s.": "Не удается добавить свойство в замороженный объект: %s.",
	"Cannot remove a property from a sealed object: %s.": "Не удается удалить свойство из замороженного объекта: %s.",
	"Cannot modify a property of a sealed object: %s.": "Не удается изменить свойство в замороженном объекте: %s.",
	"Cannot modify readonly property: %s.": "Нельзя изменить свойство, открытое только для чтения: %s.",
	"Cannot be both a data and an accessor descriptor.": "Не удается использовать и данные, и открытый дескриптор.",
	"Cannot change the configurable attribute of \"%s\" from false to true.": "Не удается изменить настраиваемый атрибут из \"%s\" с false на true.",
	"Cannot change the enumerable attribute of \"%s\" because configurable is false.": "Не удается изменить перечисляемый атрибут из \"%s\", поскольку configurable отключено.",
	"Cannot change the writable attribute of \"%s\" from false to true because configurable is false.": "Не удается изменить перезаписываемый атрибут из \"%s\" с false на true, поскольку configurable отключено.",
	"Cannot change the value of attribute \"%s\" because writable is false.": "Не удается изменить значение атрибута из \"%s\", поскольку writable отключено.",
	"Cannot change the get attribute of \"%s\" because configurable is false.": "Не удается изменить атрибут get из \"%s\", поскольку configurable отключено.",
	"Cannot change the set attribute of \"%s\" because configurable is false.": "Не удается изменить атрибут set из \"%s\", поскольку configurable отключено.",
	"Cannot change \"%s\" from a data property to an accessor property because configurable is false.": "Не удается изменить \"%s\" из источника данных к самому свойству, поскольку configurable отключено.",
	"Cannot change \"%s\" from an accessor property to a data property because configurable is false.": "Не удается изменить \"%s\" из самого свойства к источнику данных, поскольку configurable отключено.",
	"Cannot add properties to this object because extensible is false.": "Не удается добавить свойства к this, поскольку extensible отключено.",
	// TokenStream
	"missing exponent": "упущен экспонент",
	"number format error": "проблема в формате числа",
	"unterminated string literal": "незавершенная строка",
	"unterminated comment": "незавершенный комментарий",
	"unterminated regular expression literal": "незавершенное регулярное выражение",
	"invalid flag after regular expression": "некорректный флаг после регулярного выражения",
	"no input for %s": "нет входной части для %s",
	"illegal character": "недопустимый символ",
	"invalid Unicode escape sequence": "некорректная Unicode завершающая цепочка",
	"not a valid default namespace statement. Syntax is: default xml namespace = EXPRESSION;": "неправильное стандартное пространство имен. Синтакс таков: default xml namespace = ВЫРАЖЕНИЕ;",
	// TokensStream warnings
	"illegal octal literal digit %s; interpreting it as a decimal digit": "недопустимое двухбитное число %s; интерпретация в виде десятичного",
	"illegal usage of future reserved keyword %s; interpreting it as ordinary identifier": "недопустимое использование зарезервированного в будущем слова %s; интерпретация в виде обычного идентификатора",
	// LiveConnect errors
	"Internal error: type conversion of %s to assign to %s on %s failed.": "Внутренняя ошибка: попытка преобразования %s в %s из %s прошла неудачно.",
	"Can't find converter method \"%s\" on class %s.": "Не удается найти метод преобразования \"%s\" в классе %s.",
	"Java method \"%s\" cannot be assigned to.": "Java метод \"%s\" не может быть приведен.",
	"Internal error: attempt to access private/protected field \"%s\".": "Внутренняя ошибка: не удалось получить доступ к приватному/защищенному полю \"%s\".",
	"Can't find method %s.": "Не удалось найти метод %s.",
	"Script objects are not constructors.": "Скриптовые объекты не являются конструкторами.",
	"Java method \"%s\" was invoked with %s as \"this\" value that can not be converted to Java type %s.": "Java метод \"%s\" был вызван с %s, где \"this\" не может быть приведен к Java типу %s.",
	"Java class \"%s\" has no public instance field or method named \"%s\".": "Java класс \"%s\" не имеет публичного значения или метода под названием \"%s\".",
	"Array index %s is out of bounds [0..%s].": "Индекс массива %s выходит за рамки [0..%s].",
	"Java arrays have no public instance fields or methods named \"%s\".": "Java массивы не имеют публичного значения или метода под названием \"%s\".",
	"Java package names may not be numbers.": "Имена Java пакетов не могут быть числами.",
	"Access to Java class \"%s\" is prohibited.": "Доступ к Java классу \"%s\" запрещен.",
	// ImporterTopLevel
	"Ambiguous import: \"%s\" and and \"%s\".": "Непонятный импорт: \"%s\" и еще \"%s\".",
	"Function importPackage must be called with a package; had \"%s\" instead.": "Функция importPackage должна быть вызвана на пакете; вместо этого \"%s\".",
	"Function importClass must be called with a class; had \"%s\" instead.": "Функция importClass должна быть вызвана на классе; вместо этого \"%s\".",
	"\"%s\" is neither a class nor a package.": "\"%s\" не является ни классом, ни пакетом.",
	"Cannot import \"%s\" since a property by that name is already defined.": "Не удается импортировать \"%s\", так как свойство под этим именем уже объявлено.",
	// JavaAdapter
	"JavaAdapter requires at least one argument.": "JavaAdapter требует по крайней мере один аргумент.",
	"Argument %s is not Java class: %s.": "Аргумент %s не является Java классом: %s.",
	"Only one class may be extended by a JavaAdapter. Had %s and %s.": "Только один класс может быть унаследован JavaAdapter'ом. Здесь же %s и %s.",
	// Arrays
	"Inappropriate array length.": "Недопустимый размер массива.",
	"Array length %s exceeds supported capacity limit.": "Размер массива %s превышает максимально доступный лимит.",
	"Reduce of empty array with no initial value": "Уменьшается пустой массив без единого значения",
	// URI
	"Malformed URI sequence.": "Неправильная последовательность URI.",
	// Number
	"Precision %s out of range.": "Числительное %s выходит из границ.",
	// NativeGenerator
	"Attempt to send value to newborn generator": "Попытка послать значение в созданный генератор",
	"Already executing generator": "Генератор уже выполняется",
	"StopIteration may not be changed to an arbitrary object.": "StopIteration не может быть заменен прочим объектом.",
	// Interpreter
	"Yield from closing generator": "Yield с закрывающей конструкции",
	"%s.prototype.%s method called on null or undefined": "%s.prototype.%s метод вызван на null или undefined",
	"First argument to %s.prototype.%s must not be a regular expression": "Первый аргумент для %s.prototype.%s не должен быть обычным выражением."
};

let reformatSpecial = function(element) {
	element = String(element);
	// Includes only Messages represent
	element = element.replace(/\+/g, "\\+");
	element = element.replace(/\(/g, "\\(");
	element = element.replace(/\)/g, "\\)");
	element = element.replace(/\[/g, "\\[");
	element = element.replace(/\]/g, "\\]");
	element = element.replace(/\{/g, "\\{");
	element = element.replace(/\}/g, "\\}");
	return element.replace(/\./g, "\\.");
};

let requireFormat = function(message) {
	for (let element in Messages) {
		let exp = reformatSpecial(element);
		exp = exp.replace(/%s/g, "(.*)");
		let regexp = new RegExp(exp, "m");
		if (regexp.test(message)) {
			return {
				message: String(element),
				exec: regexp.exec(message)
			};
		}
	}
	return {
		message: message
	};
};

let translateMessage = function(message) {
	if (typeof message != "string") {
		message = String(message);
	}
	if (isRussianLanguage()) {
		let format = requireFormat(message);
		if (Messages.hasOwnProperty(format.message)) {
			let exec = format.exec;
			message = Messages[format.message];
			if (exec && exec.length > 1) {
				exec.shift();
				try {
					return java.lang.String.format(message, exec);
				} catch (e) {
					exec.forEach(function(value) {
						message = message.replace("%s", value);
					});
				}
			}
		}
	}
	return message;
};

let resolveTraceSource = function(line) {
	if (typeof line != "string") {
		line = String(line);
	}
	let at = line.indexOf("at ");
	if (at == -1) {
		return null;
	}
	line = line.substring(at + 3);
	let resolved = new Object();
	resolved.trace = line;
	if (line.endsWith(")")) {
		let index = line.lastIndexOf("(");
		resolved.where = line.slice(index + 1, line.length - 1);
		line = line.substring(0, index - 1);
	}
	let semi = line.lastIndexOf(":");
	if (semi != -1) {
		resolved.line = line.slice(semi + 1, line.length);
		line = line.substring(0, semi);
	}
	let name = line.indexOf("$");
	if (name != -1) {
		resolved.source = line.slice(0, name);
		line = line.substring(name + 1);
	}
	resolved.file = line;
	return resolved;
};

let sliceMessageWithoutTrace = function(message, line) {
	if (typeof message != "string") {
		message = String(message);
	}
	let trace = resolveTraceSource(line);
	if (trace === null) {
		return message;
	}
	trace = trace.trace.replace(":", "#");
	let index = message.lastIndexOf(trace);
	if (index != -1) {
		return message.slice(0, index - 2);
	}
	return message;
};

let retraceToArray = function(trace) {
	if (trace === null || trace === undefined) {
		return new Array();
	}
	if (typeof trace != "string") {
		trace = String(trace);
	}
	return trace.split("\n");
};

let fetchErrorMessage = function(error) {
	if (error === null) {
		return String(error);
	}
	if (typeof error == "object") {
		if (error.hasOwnProperty("message")) {
			return String(error.message);
		}
		return null;
	}
	return String(error);
};

/**
 * Fetches error message and represent it
 * into localized string without source.
 * @param {Error|string} error to localize
 * @returns {string} represented stroke
 */
let localizeError = function(error) {
	let message = fetchErrorMessage(error);
	if (error instanceof java.lang.Object) {
		MCSystem.throwException("Unsupported localize error type: " + error);
	} else if (error && typeof error == "object") {
		let retraced = retraceToArray(error.stack)[0];
		error = sliceMessageWithoutTrace(message, retraced);
	}
	return translateMessage(error);
};

EXPORT("localizeError", localizeError);

let fetchErrorName = function(error) {
	if (error && typeof error == "object") {
		if (error.name !== undefined) {
			return String(error.name);
		}
	}
	return Translation.translate("Oh nose everything broke");
};

let saveOrRewrite = function(path, text) {
	text = new java.lang.String(text);
	let file = new java.io.File(__dir__ + ".logging", path + ".trace");
	file.getParentFile().mkdirs();
	if (!file.isDirectory()) {
		file.createNewFile();
		let stream = new java.io.FileOutputStream(file);
		stream.write(text.getBytes());
		stream.close();
		print(Translation.translate("Saved as") + " " + path);
		return;
	}
	print(Translation.translate("Couldn't save trace"));
};

/**
 * Reports catched modification errors,
 * may used in [[catch]]-block when any throw
 * code occurs. Stacktrace will be displayed
 * on display with sources hieracly.
 * @param {Error|any} value to report
 */
let reportTrace = function(error) {
	if (error === undefined) {
		return;
	}
	if (error instanceof java.lang.Object) {
		MCSystem.throwException("Unsupported report trace type: " + error);
	}
	if (reportTrace.isReporting) {
		if (!Array.isArray(reportTrace.handled)) {
			reportTrace.handled = new Array();
		}
		reportTrace.handled.push(error);
		if (reportTrace.handled.length > 8) {
			reportTrace.handled.shift();
		}
		return;
	}
	let date = reportTrace.fetchTime();
	reportTrace.isReporting = true;
	context.runOnUiThread(function() {
		let builder = new android.app.AlertDialog.Builder(context,
			android.R.style.Theme_DeviceDefault_DialogWhenLarge);
		builder.setTitle(fetchErrorName(error));
		builder.setCancelable(false);
		builder.setMessage(Translation.translate("Preparing report"));
		builder.setPositiveButton(Translation.translate("Understand"), null);
		builder.setNeutralButton(Translation.translate("Leave"), function() {
			delete reportTrace.handled;
		});
		let code = reportTrace.toCode(error);
		builder.setNegativeButton(code, function() {
			posted.export = true;
			new java.lang.Thread(function() {
				while (posted.inProcess()) {
					java.lang.Thread.yield();
				}
				saveOrRewrite(code, posted.toResult());
			}).start();
		});
		let dialog = builder.create();
		dialog.setOnDismissListener(function() {
			delete reportTrace.isReporting;
			let next = reportTrace.findNextTrace();
			if (next !== null) reportTrace(next);
			if (!posted.export) posted.cancel();
		});
		let popup = dialog.getWindow();
		popup.setLayout(display.getWidth() / 1.4, display.getHeight() / 1.2);
		let posted = reportTrace.postUpdate(dialog, error, date);
		dialog.show();
		let view = popup.findViewById(android.R.id.message);
		if (view != null) {
			view.setTextIsSelectable(true);
			view.setTextSize(view.getTextSize() * 0.475);
		}
	});
};

reportTrace.handled = new Array();

reportTrace.postUpdate = function(dialog, error, date) {
	let handler = new android.os.Handler(),
		completed = false,
		formatted,
		update;
	new java.lang.Thread(function() {
		let message = fetchErrorMessage(error),
			retraced = retraceToArray(error ? error.stack : null);
		if (retraced.length > 0) retraced.pop();
		let sliced = sliceMessageWithoutTrace(message, retraced[0]),
			localized = translateMessage(sliced);
		update = new java.lang.Runnable(function() {
			let attached = new Array();
			if (message != null) {
				let entry = "<font color=\"#CCCC33\">";
				if (localized != sliced) {
					entry += localized + "<br/>";
				}
				entry += sliced + "</font>";
				attached.push(entry);
			}
			let additional = new Array();
			for (let i = 0; i < retraced.length; i++) {
				if (requested && requested.formatted) {
					let element = requested.formatted[i];
					if (element !== undefined) {
						attached.push(element);
						continue;
					}
				}
				additional.push(retraced[i]);
			}
			if (additional.length > 0) {
				attached.push(additional.join("<br/>"));
			}
			let marked = new String();
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
		let requested = reportTrace.handleRequest(handler, update, retraced);
		handler.post(update);
	}).start();
	return {
		inProcess: function() {
			return !completed;
		},
		toResult: function() {
			return formatted !== undefined ? formatted.toString() : new String();
		},
		cancel: function() {
			if (update !== undefined) {
				handler.removeCallbacks(update);
			}
		}
	};
};

let isValidFile = function(file) {
	if (file instanceof java.io.File) {
		return file.isFile();
	}
	return false;
};

reportTrace.processFile = function(file, where) {
	if (typeof where != "number" || where === NaN) {
		return null;
	}
	let strokes = new Array();
	if (isValidFile(file)) {
		let scanner = new java.io.FileReader(file),
			reader = java.io.BufferedReader(scanner),
			wasErrorLines = false,
			encounted = 0,
			hieracly = 0,
			count = 0,
			included,
			another,
			line;
		while (count < where + 3 && (line = reader.readLine())) {
			count++;
			encounted++;
			line = String(line);
			if (line.startsWith("// file: ")) {
				included = line.substring(9);
				encounted = -1;
			}
			if (count > where - 3) {
				if (count == where) {
					wasErrorLines = true;
					another = encounted;
				} else if (/\}|\]/.test(line)) {
					if (hieracly > 0) {
						hieracly--;
					} else if (wasErrorLines) {
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
		strokes = new Array();
	}
	return strokes;
};

reportTrace.processSources = function(related, resolved, where) {
	if (typeof where != "number" || where === NaN) {
		return null;
	}
	let strokes = new Array();
	if (related && typeof related == "object") {
		for (let mod in related) {
			let sources = related[mod],
				directory = Sources[mod].dir;
			for (let i = 0; i < sources.length; i++) {
				let file = new java.io.File(directory, sources[i]),
					result = reportTrace.processFile(file, where);
				if (result && result.length > 0) {
					strokes = strokes.concat(result);
					break;
				}
			}
			if (strokes.length > 0) {
				if (getModName(mod) != resolved.source) {
					strokes.push("<small><font color=\"#CCCC33\">" + Translation.translate("Source mayn't be incorrectly") + "</font></small>");
				}
				break;
			}
		}
	}
	return strokes;
};

reportTrace.processStack = function(resolved) {
	let strokes = new Array(),
		where = Number(resolved.line) + 1;
	strokes.push((resolved.source ? resolved.source + " " + Translation.translate("from") + " " : new String()) + resolved.file +
		(resolved.where ? " (" + resolved.where + ")" : new String()) + " " + Translation.translate("at line") + " " + where);
	let sources = findRelatedSources(resolved.source, resolved.file),
		processed = reportTrace.processSources(sources, resolved, where);
	if (processed !== null) strokes = strokes.concat(processed);
	return strokes.join("<br/>");
};

reportTrace.handleRequest = function(handler, update, trace) {
	let requested = new Object();
	requested.formatted = new Array();
	new java.lang.Thread(function() {
		try {
			for (let i = 0; i < trace.length; i++) {
				let resolved = resolveTraceSource(trace[i]);
				if (resolved === null) continue;
				let processed = reportTrace.processStack(resolved);
				requested.formatted.push(processed);
				handler.post(update);
			}
		} catch (e) {
			requested.error = e;
			try {
				handler.post(update);
			} catch (e) {
				print(e.message);
			}
		}
		requested.completed = true;
	}).start();
	return requested;
};

reportTrace.findNextTrace = function() {
	let handled = this.handled;
	if (!Array.isArray(handled)) {
		return null;
	}
	if (handled.length > 0) {
		return handled.shift();
	}
	return null;
};

reportTrace.fetchTime = function() {
	return Date.now() - launchTime;
};

reportTrace.toCode = function(error) {
	let message = String(error);
	if (error && typeof error == "object") {
		let fetched = fetchErrorMessage(error.message);
		if (fetched !== null) {
			message = fetched;
		}
		if (error.stack !== undefined) {
			message += "\n" + error.stack;
		}
	}
	let encoded = new java.lang.String(message);
	return "NE-" + Math.abs(encoded.hashCode());
};

reportTrace.setupPrint = function(action) {
	if (typeof action != "function") {
		return delete print;
	}
	return Boolean(print = action);
};

EXPORT("reportTrace", reportTrace);

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
Translation.addTranslation("Source mayn't be incorrectly", {
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

let isRussianLanguage = function() {
	// Required, because Translation.getLanguage() returns device language
	return Translation.translate("Preparing report") == "Подготовка отчета";
};
