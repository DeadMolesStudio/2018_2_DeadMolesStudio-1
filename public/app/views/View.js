/*
* @class View - каркас для создания любой view
* @module modules
*/
export default class View {
    constructor(el) {
        this._el = el;
        this._created = false;

        this._el.dataset.view = this.constructor.name;
        this._el.hidden = true;
    }

    get isActive() {
        return !this._el.hidden;
    }

    hide() {
        this._el.hidden = true;
    }

    show() {
        // this._el.hidden = false;
        // if (!this._created) {
        //     this._created = true;
        //     this.render();
        // }
        this._el.hidden = false;
        this.render();
    }

    render() {}
}