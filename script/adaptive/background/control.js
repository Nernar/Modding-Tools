let tool = new ControlTool({
	controlDescriptor: {
		logotype: "world"
	},
	menuDescriptor: {
		elements: function() {
			let array = [];
			header = array[array.push({
				type: "projectHeader",
				categories: []
			}) - 1];
			let registered = AdditionalMessageFactory.getRegistered();
			for (let i = 0; i < 2; i++) {
				let item = header.categories[header.categories.push({
					title: registered[random(0, random.length - 1)].getMessage(),
					items: []
				}) - 1];
				for (let m = 0; m < registered.length; m++) {
					let next = registered[m];
					item.items.push({
						description: next.getMessage(),
						title: next.getImage(),
						icon: next.getImage()
					});
				}
			}
			for (let i = 0; i < registered.length; i++) {
				let message = registered[i];
				array.push({
					type: "message",
					message: message.getMessage(),
					icon: message.getImage()
				});
			}
			for (let i = 0; i < registered.length; i++) {
				let message = registered[i],
					item = array[array.push({
						type: "category",
						title: message.getMessage(),
						items: []
					}) - 1];
				for (let m = 0; m < registered.length; m++) {
					let next = registered[m];
					item.items.push({
						title: next.getImage(),
						icon: next.getImage()
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
