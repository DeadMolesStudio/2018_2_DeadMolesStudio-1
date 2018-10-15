export class AjaxFetchModule {
    static _ajax ({method = "GET", path = "/", domain = '', body} = {}) {
        const url = domain + path;

        const options = {
            mode: 'cors',
            credentials: 'include',
            method: method
        };

        if ( body ) {
            options.headers = new Headers({'Content-Type': 'application/json; charset=utf-8'});
            options.body = JSON.stringify(body);
        }

        return fetch(url, options);
    }

    static doGet (params = {}) {
        return this._ajax({...params, method: "GET"});
    }

    static doPost (params = {}) {
        return this._ajax({...params, method: "POST"});
    }

    static doDelete (params = {}) {
        return this._ajax({...params, method: "DELETE"});
    }
}
