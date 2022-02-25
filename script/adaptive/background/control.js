let tool = new ControlTool({
	controlDescriptor: {
		logotype: "world"
	},
	menuDescriptor: {
		elements: function() {
			let array = new Array();
			header = array[array.push({
				type: "projectHeader",
				categories: new Array()
			}) - 1];
			let registered = AdditionalMessageFactory.getRegistered();
			for (let i = 0; i < 2; i++) {
				let item = header.categories[header.categories.push({
					title: registered[random(0, random.length - 1)].getMessage(),
					items: new Array()
				}) - 1];
				for (let m = 0; m < registered.length; m++) {
					let next = registered[m];
					item.items.push({
						description: next.getMessage(),
						title: next.getIcon(),
						icon: next.getIcon()
					});
				}
			}
			for (let i = 0; i < registered.length; i++) {
				let message = registered[i];
				array.push({
					type: "message",
					message: message.getMessage(),
					icon: message.getIcon()
				});
			}
			for (let i = 0; i < registered.length; i++) {
				let message = registered[i],
					item = array[array.push({
						type: "category",
						title: message.getMessage(),
						items: new Array()
					}) - 1];
				for (let m = 0; m < registered.length; m++) {
					let next = registered[m];
					item.items.push({
						title: next.getIcon(),
						icon: next.getIcon()
					});
				}
			}
			return array;
		}
	},
	onControlClick: function(control) {
		showHint(translate("Not developed yet"));
	}
});

return function() {
	tool.attach();
	handle(function() {
		tool.control();
	}, 3000);
	tool.queue();
};