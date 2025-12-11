//    Lock Guard
//    GNOME Shell extension
//    @fthx 2025


import * as Main from 'resource:///org/gnome/shell/ui/main.js';


export default class LockGuardExtension {
    _toggleVisibility() {
        Main.panel.statusArea.dateMenu.visible = !Main.sessionMode.isLocked;
        Main.panel.statusArea.quickSettings.visible = !Main.sessionMode.isLocked;
    }

    enable() {
        this._toggleVisibility();
    }

    disable() {
        this._toggleVisibility();
    }
}
