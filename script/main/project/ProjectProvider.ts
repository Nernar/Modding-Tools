/**
 * DEPRECATED SECTION
 * All this will be removed as soon as possible.
 */
namespace ProjectProvider {
	export let thread: Nullable<java.lang.Thread>; 
	export let opened: Nullable<Project>;
	export function getProject() {
		return ProjectProvider.opened || null;
	}
	export function getEditorById(index: number) {
		let project = ProjectProvider.getProject();
		if (!project) return null;
		let obj = project.getAll();
		return obj[index] || null;
	}
	export function isInitialized() {
		return ProjectProvider.getProject() != null;
	}
	export function create() {
		let opened = ProjectProvider.opened = new Project();
		return (opened.time = Date.now(), opened);
	}
	export function addWorker(worker: Worker) {
		ProjectProvider.setupEditor(ProjectProvider.opened.object.push(worker.getProject()) - 1, worker);
		return worker;
	}
	export function isOpened() {
		let project = ProjectProvider.getProject();
		if (!project) return false;
		return project.isOpened;
	}
	export function getCount() {
		let project = ProjectProvider.getProject();
		if (!project) return 0;
		return project.getCount();
	}
	export function setOpenedState(state: boolean) {
		let project = ProjectProvider.getProject();
		if (!project) return;
		project.isOpened = !!state;
	}
	export function getCurrentType() {
		let project = ProjectProvider.getProject();
		if (!project || !project.isOpened) {
			return "none";
		}
		return project.getCurrentType();
	}
	export function initializeAutosave() {
		let project = ProjectProvider.getProject();
		if (project.isAutosaving) return;
		if (!autosave || ProjectProvider.thread || autosavePeriod <= 0) {
			project.updateCurrentWorker();
			return;
		}
		ProjectProvider.thread = handleThread(function() {
			do {
				java.lang.Thread.sleep(autosavePeriod * 1000);
				project.callAutosave();
				while (project.isAutosaving) {
					java.lang.Thread.sleep(1);
				}
			} while (project.isOpened);
			delete ProjectProvider.thread;
		});
	}
	export function indexOf(obj: Scriptable) {
		let project = ProjectProvider.getProject();
		if (!project) return -1;
		return project.getAll().indexOf(obj);
	}
	export function setupEditor(id: number, worker: Worker) {
		let project = ProjectProvider.getProject();
		if (!project) return;
		project.setCurrentlyId(id);
		project.switchToWorker(worker);
	}
}
