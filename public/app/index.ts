import ButtonComponent from './components/Button/Button';
import ChatMiniComponent from './components/ChatMini/ChatMini';
import swInstall from '../sw-installer.js';
import Router from './modules/Router';
import bus from './modules/EventBus';
import ScoreboardService from './services/ScoreboardService';
import SessionService from './services/SessionService';
import UserService from './services/UserService';
import ScoreboardView from './views/Scoreboard';
import MenuView from './views/Menu';
import LoginView from './views/Login';
import LogoutView from './views/Logout';
import AboutView from './views/About';
import ProfileView from './views/Profile';
import EditProfileView from './views/EditProfile';
import SignUpView from './views/SignUp';
import GameView from './views/GameView';
import PreGameView from './views/PreGame';
import ChatView from './views/ChatView';
import preLoad from './modules/PreLoad';
import '../css/style.scss';
import MultiPlayerView from './views/MultiplayerView';

const renderChat = (parent) => {
    const chat = new ChatMiniComponent({ el: parent });
    chat.render();

    const chatButton = new ButtonComponent({
        el: parent,
        className: 'app-router-ignore chat-mini-bth',
        text: '\uD83D\uDCE9',
    });
    chatButton.on({
        event: 'click',
        callback: (event) => {
            event.preventDefault();
            chat.toggle();
        },
    });
    chatButton.render();
};

const startApp = () => {
    const rootElement = document.querySelector('#root');
    const router = new Router(rootElement);
    router
        .register('/', MenuView)
        .register('/login', LoginView)
        .register('/logout', LogoutView)
        .register('/about', AboutView)
        .register('/profile', ProfileView)
        .register('/profile/settings', EditProfileView)
        .register('/signup', SignUpView)
        .register('/scoreboard', ScoreboardView)
        .register('/play', GameView)
        .register('/screenchat', ChatView)
        .register('/pregame', PreGameView)
        .register('/multiplayer', MultiPlayerView);

    renderChat(rootElement);
    const iframe = document.querySelector('iframe');

    bus.on('preload:loaded', () => { console.log('all gameImages loaded'); });

    const gameResources = [
        'app/game/GameScene/img/ketnipz.png',
        'app/game/GameScene/img/ketnipz_jump.png',
        'app/game/GameScene/img/ketnipz_enemy.png',
        'app/game/GameScene/img/ketnipz_enemy_jump.png',
        'app/game/GameScene/img/magaz_blur_gray.png',
    ];
    preLoad(gameResources);

    bus.on('loggedout', () => {
        router.go('/login');
    });

    bus.on('tologin', () => {
        router.go('/login');
    });

    bus.on('chat', () => {
        router.go('/screenchat');
    });

    bus.on('tosignup', () => {
        router.go('/signup');
    });

    bus.on('showmenu', () => {
        router.go('/');
    });

    bus.on('editprofile', () => {
        router.go('/profile/settings');
    });

    bus.on('showprofile', () => {
        router.go('/profile');
    });

    // bus.on('fetch-user-state', async () => {
    //     const data = await UserService.getUserState();
    //     bus.emit('get-user-state', data);
    // });

    const getUser = async () => {
        const data = await UserService.getUserState();
        bus.emit('get-user-state', data);
    };

    getUser();


    bus.on('fetch-user', async () => {
        const data = await UserService.getUser();
        if (data.ok) {
            const mes = {
                type: 'set-user',
                userId: data.user.id,
                userNickName: data.user.nickname,
            };
            iframe.contentWindow.postMessage(JSON.stringify(mes), '*');
            bus.emit('user:get-profile', data.user);
        } else {
            bus.emit('user:get-profile-err', data.err);
        }
    });

    bus.on('fetch-logout', async () => {
        await SessionService.logout();
        bus.emit('loggedout');
    });

    bus.on('fetch-login', async (formData) => {
        const data = await SessionService.login(formData);
        if (data.ok) {
            bus.emit('showprofile');
        } else {
            bus.emit('session:login-err', data.err);
        }
    });

    bus.on('fetch-signup-user', async (formData) => {
        const data = await UserService.signup(formData);
        if (data.ok) {
            bus.emit('showprofile');
        } else {
            bus.emit('user:signup-err', data.err);
        }
    });

    bus.on('fetch-scoreboard', async () => {
        const data = await ScoreboardService.getScoreboard();
        if (data.ok) {
            bus.emit('scoreboard:get-data', data.scoreboard);
        } else {
            alert('Что-то пошло не так.');
            bus.emit('showmenu');
        }
    });

    bus.on('fetch-page-scoreboard', async ({ limit, page }) => {
        const data = await ScoreboardService.getScoreboard({ limit: limit, page: page });
        if (data.ok) {
            bus.emit('scoreboard:get-page', data.scoreboard);
        } else {
            alert('Что-то пошло не так.');
            bus.emit('showmenu');
        }
    });


    bus.on('fetch-update-user', async ({ formData, user }) => {
        const data = await UserService.update(formData, user);
        if (data.ok) {
            bus.emit('showprofile');
        } else {
            bus.emit('user:update-err', data.err);
        }
    });


    router.start();
    swInstall();
};

startApp();
