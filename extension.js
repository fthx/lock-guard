//    Lock Guard
//    GNOME Shell extension
//    @fthx 2026


import * as Main from 'resource:///org/gnome/shell/ui/main.js';


export default class LockGuardExtension {
    enable() {
        this._originalKeybindings = { ...Main.wm._allowedKeybindings };
        Main.wm._allowedKeybindings = {};

        Main.panel.statusArea.dateMenu?.hide();
        Main.panel.statusArea.quickSettings?.hide();
    }

    // Needs unlock-dialog: hiding/locking items on lock screen
    disable() {
        Main.wm._allowedKeybindings = this._originalKeybindings;
        this._originalKeybindings = null;

        Main.panel.statusArea.dateMenu?.show();
        Main.panel.statusArea.quickSettings?.show();
    }
}
