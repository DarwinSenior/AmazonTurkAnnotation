/// <reference path="../../bower_components/polymer-ts/polymer-ts.d.ts"/>

@component('x-result-tab')
class XResult extends polymer.Base {
    @property({ type: Boolean, value: false })
    finished: boolean;

    @property({ type: Array, value: [], notify: true })
    checkList: Array<boolean>;

    @observe("checkList")
    checkListChanged(checklist: Array<boolean>) {
        this.finished = checklist.every(i => i);
    }

    @property({ type: Boolean, value: false })
    submitted: boolean;

    @computed()
    buttonText(finished, submitted) {
        if (submitted) {
            return "submitting";
        } else if (finished) {
            return "submit";
        }
        return "continue finish task";
    }

    checkIcon(item: boolean): string {
        return item ? "icons:check" : "icons:check-box-outline-blank";
    }

    direct(evt: Event) {
        this.fire('redirect', { tab: 'annotation', page: evt.currentTarget['targetId'] });
    }

    submit() {
        if (this.finished && !this.submitted) {
            this.fire('submit');
            this.submitted = true;
        } else if (!this.finished) {
            this.fire('redirect', { tab: 'annotation', page: this.checkList.indexOf(false) });
        }
    }
    done() {
        this.submitted = false;
    }
}
XResult.register();
