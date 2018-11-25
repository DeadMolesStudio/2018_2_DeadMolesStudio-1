import backDomain from '../projectSettings.js';
import AjaxFetchModule from '../modules/AjaxFetch.mjs';
import userState from '../modules/User.mjs';

export default class UserService {
    static FetchUser() {
        return AjaxFetchModule
            .doGet({
                path: '/profile',
                domain: backDomain,
            });
    }

    static FetchSignUpUser(req = {}) {
        return AjaxFetchModule
            .doPost({
                path: '/profile',
                domain: backDomain,
                body: req,
            });
    }

    static FetchUpdateUpUser(req = {}) {
        return AjaxFetchModule
            .doPut({
                path: '/profile',
                domain: backDomain,
                body: req,
            });
    }

    /**
     Получить данные пользователя для модуля User
     * @return user
     */
    static async getUserState() {
        const response = await this.FetchUser();

        if (response.status !== 200) {
            return null;
        }

        const user = await response.json();
        return user;
    }

    /**
     Получить данные о пользователе
     * @return Object data
     */
    static async getUser() {
        const data = {
            user: null,
            err: {
                status: 200,
                text: null,
            },
            ok: false,
        };

        if (userState.isAuth() ) {
            console.log('юзер есть', userState);
            data.user = userState.getUser();
            data.ok = true;
            return data;
        }

        const response = await this.FetchUser();

        if (response.status === 401) {
            data.err.status = 401;
            data.err.text = 'Надо авторизоваться!';
            return data;
        }

        if (response.status !== 200) {
            data.err.status = response.status;
            data.err.text = 'Что-то пошло не так!';
            return data;
        }

        data.user = await response.json();
        data.ok = true;

        userState.setUser(data.user);

        return data;
    }

    /**
     Зарегестрировать нового пользователя
     * @param formData
     * @return Object data
     */
    static async signup(formData) {
        const data = {
            err: {
                status: 200,
                errors: [],
            },
            ok: false,
        };

        const email = formData.email.value;
        const nickname = formData.nickname.value;
        const password = formData.password.value;
        const passwordRepeat = formData.password_repeat.value;

        if (password !== passwordRepeat) {
            data.err.errors.push({
                text: 'Пароли не совпадают',
            });
            return data;
        }

        if (!(email && password && passwordRepeat && nickname) ) {
            data.err.errors.push({
                text: 'Заполните все поля!',
            });
            return data;
        }

        const req = {
            email: email,
            nickname: nickname,
            password: password,
        };

        const response = await this.FetchSignUpUser(req);

        if (response.status === 403) {
            const body = await response.json();
            data.err.errors = body.error;
            return data;
        }

        if (response.status !== 200) {
            data.err.status = response.status;
            data.err.errors.push({
                text: 'Что-то пошло не так!',
            });
            return data;
        }

        data.ok = true;
        return data;
    }

    /**
     Обновить данные о пользователе
     * @param formData, user
     * @return Object data
     */
    static async update(formData, user) {
        const data = {
            err: {
                mainErr: null,
                errors: [],
            },
            ok: false,
        };

        const email = formData.email.value;
        const nickname = formData.nickname.value;
        const password = formData.password.value;
        const passwordRepeat = formData.password_repeat.value;

        const req = {};

        if (email !== user.email && email) {
            req.email = email;
        }

        if (nickname !== user.nickname && nickname) {
            req.nickname = nickname;
        }

        if (password) {
            if (password !== passwordRepeat) {
                data.err.errors.push({
                    text: 'Пароли не совпадают',
                });
                return data;
            }
            req.password = password;
        }

        if (Object.keys(req).length === 0) {
            return data;
        }

        const response = await this.FetchUpdateUpUser(req);

        if (response.status === 403) {
            const body = await response.json();
            data.err.errors = body.error;
            return data;
        }

        if (response.status === 401) {
            data.err.mainErr = 'Надо авторизоваться!';
            console.log(data);
            return data;
        }

        if (response.status !== 200) {
            data.err.mainErr = 'Что-то пошло не так!';
            return data;
        }

        userState.deleteUser();
        data.ok = true;
        return data;
    }
}
