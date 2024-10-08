const displayAdditionalMessages = function(attachToProjects) {
	let tool = new MenuTool({
		controlDescriptor: {
			logotype: "inspector"
		}
	});
	let registered = AdditionalMessageFactory.getRegistered();
	let array = tool.menuDescriptor.elements;
	let projects;
	if (attachToProjects) {
		let header = array[0];
		header.type = "projectHeader";
		header.categories = [];
		projects = header.categories[header.categories.push({
			title: translate("Tests"),
			items: []
		}) - 1];
	}
	array.push({
		type: "category",
		title: translate("Tests")
	});
	for (let i = 0, l = registered.length; i < l; i++) {
		let message = registered[i];
		if (attachToProjects) {
			projects.items.push({
				description: message.getMessage(),
				title: message.getImage(),
				icon: message.getImage()
			});
		}
		array.push({
			type: "message",
			message: message.getMessage(),
			icon: message.getImage()
		});
		if (message instanceof AdditionalClickableMessage) {
			if (attachToProjects) {
				projects.items[projects.items.length - 1].click = message.getAction();
			}
			array[array.length - 1].click = message.getAction();
		}
	}
	tool.attach();
	tool.describe();
	tool.menu();
};
