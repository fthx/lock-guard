//    Lock Guard
//    GNOME Shell extension
//    @fthx 2026

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as MessageTray from 'resource:///org/gnome/shell/ui/messageTray.js';

const MAX_FAILED_ATTEMPTS = 999; // avoid overflow
const FAILED_ATTEMPTS_TRESHOLD = 3;

export default class LockGuardExtension {
    _addFailedAttempt() {
        if (this._failedAttempts < MAX_FAILED_ATTEMPTS)
            this._failedAttempts++;
    }

    _notifyFailedAttempts() {
        if (this._failedAttempts < FAILED_ATTEMPTS_TRESHOLD)
            return;

        const source = new MessageTray.Source({
            title: 'Lock Guard extension',
            iconName: 'security-high-symbolic',
        });
        Main.messageTray.add(source);

        const notification = new MessageTray.Notification({
            source,
            title: 'SECURITY WARNING',
            body: `${this._failedAttempts} failed login attempts`,
            urgency: MessageTray.Urgency.CRITICAL,
        });

        source.addNotification(notification);
    }

    enable() {
        this._originalKeybindings = { ...Main.wm._allowedKeybindings };
        Main.wm._allowedKeybindings = {};

        Main.panel.statusArea.dateMenu?.hide();
        Main.panel.statusArea.quickSettings?.hide();

        this._failedAttempts = 0;
        this._originalEnsureAuthPrompt = Main.screenShield._dialog._ensureAuthPrompt;
        Main.screenShield._dialog._ensureAuthPrompt = (...args) => {
            this._originalEnsureAuthPrompt.call(Main.screenShield._dialog, ...args);
            Main.screenShield._dialog._authPrompt._userVerifier.connectObject(
                'verification-failed',
                () => this._addFailedAttempt(),
                this);
        };
    }

    // Needs unlock-dialog: managing items on lock screen
    disable() {
        Main.wm._allowedKeybindings = this._originalKeybindings;
        this._originalKeybindings = null;

        Main.panel.statusArea.dateMenu?.show();
        Main.panel.statusArea.quickSettings?.show();

        if (this._originalEnsureAuthPrompt) {
            Main.screenShield._dialog._ensureAuthPrompt = this._originalEnsureAuthPrompt;
            this._originalEnsureAuthPrompt = null;
        }
        Main.screenShield._dialog._authPrompt?._userVerifier?.disconnectObject(this);
        this._notifyFailedAttempts();
        this._failedAttempts = null;
    }
}
