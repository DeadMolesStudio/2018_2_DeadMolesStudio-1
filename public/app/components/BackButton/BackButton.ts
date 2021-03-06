import {noop} from 'modules/Utils';

export default class BackButtonComponent {
    _el;
    _href;
    _innerElem;

    constructor({el = document.body, href = '/'} = {}) {
        this._el = el;
        this._href = href;
        this._innerElem = null;
    }

    render() {
        this._el.insertAdjacentHTML('beforeend',`
        <a href="${this._href}" class="svg-link app-router-use">
            <svg aria-hidden="true" data-prefix="fas" data-icon="chevron-circle-left" class="svg-inline--fa app-router-use fa-chevron-circle-left fa-w-16 svg" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 524 524">
                <path class="app-router-use svg_theme_back" d="M256 504C119 504 8 393 8 256S119 8 256 8s248 111 248 248-111 248-248 248zM142.1 273l135.5 135.5c9.4 9.4 24.6 9.4 33.9 0l17-17c9.4-9.4 9.4-24.6 0-33.9L226.9 256l101.6-101.6c9.4-9.4 9.4-24.6 0-33.9l-17-17c-9.4-9.4-24.6-9.4-33.9 0L142.1 239c-9.4 9.4-9.4 24.6 0 34z">
                </path>
            </svg>
        </a>
        `);
        this._innerElem = this._el.querySelector('.svg-link');
    }

    on({ event = 'click', callback, capture = false }) {
        if (!callback) {
            callback = noop;
        }
        if (this._innerElem !== null) {
            this._innerElem.addEventListener(event, callback, capture);
        }
    }

    off({ event = 'click', callback = noop, capture = false }) {
        if (this._innerElem !== null) {
            this._innerElem.removeEventListener(event, callback, capture);
        }
    }
}