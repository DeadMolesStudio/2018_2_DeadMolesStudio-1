import LinkComponent from '../Link/Link.ts';
import formTmpl from './form.tmpl.pug';
import { noop } from '../../modules/Utils.js';

export default class FormComponent {
    // _el;
    // _name;
    // _header;
    // _inputs;
    // _innerElem;
    // _errorsList;
    // _multipart;

    constructor({
        el = document.body, name = '', header = '', inputs = [], multipart = false, btn,
    } = {}) {
        this._el = el;
        this._name = name;
        this._header = header;
        this._inputs = inputs;
        this._innerElem = null;
        this._errorsList = null;
        this._multipart = multipart;
        this._btn = btn;
    }

    render() {
        const submit = {
            name: 'submit',
            type: 'submit',
            className: 'basic-btn input-block__btn-submit',
            value: this._header,
        };

        // const btn = {
        //     href: '/signup',
        //     text: 'SignUp',
        // }; a.input-block__btn-extra SignUp

        const options = {
            name: this._name,
            header: this._header,
            inputs: this._inputs,
            submit: submit,
            btn: this._btn,
        };

        const form = formTmpl(options);

        this._el.insertAdjacentHTML('beforeend', form);
        this._innerElem = this._el.querySelector('form');
        if (this._multipart) {
            this._innerElem.setAttribute('enctype', 'multipart/form-data');
        }

        // const link = this._innerElem.querySelector('.find-link');
        // const signUpLink = new LinkComponent({
        //     el: link,
        //     text: 'SignUp',
        //     href: '/signup',
        //     className: 'basic-btn input-block__btn-extra',
        // });
        // signUpLink.render();

        // this._errorsList = document.createElement('ul');
        // const submitButton = this._innerElem.elements.submit;
        // this._innerElem.insertBefore(this._errorsList, submitButton);
    }

    on({ event = 'click', callback = noop, capture = false }) {
        if (this._innerElem !== null) {
            this._innerElem.addEventListener(event, callback, capture);
        } else {
            console.log('You cant add eventListener before render');
        }
    }

    off({ event = 'click', callback = noop, capture = false }) {
        this._innerElem.removeEventListener(event, callback, capture);
    }

    get innerElem() {
        return this._innerElem;
    }

    showErrors(errors = []) {
        errors.forEach( (item) => {
            this._errorsList.innerHTML += `<li>${item.text}</li>`;
        });
    }

    hideErrors() {
        this._errorsList.innerHTML = '';
    }
}
