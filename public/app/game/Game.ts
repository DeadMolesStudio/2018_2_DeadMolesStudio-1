import GAME_MODES from './GameModes';
import OfflineGame from './Core/Offline';
import MultiPlayerGame from './Core/MultiPlayer';
import GameScene from './GameScene/GameScene';
import GameController from './GameController';

export default class Game {

    gameScene;
    gameController;
    gameCore;

    constructor(mode, canvas) {
        // console.log('Game()');
        let GameConstructor = null;
        switch (mode) {
        case GAME_MODES.ONLINE_MULTI:
            GameConstructor = MultiPlayerGame;
            break;
        case GAME_MODES.ONLINE_SINGLE:
        case GAME_MODES.OFFLINE:
            GameConstructor = OfflineGame;
            break;
        default:
            // console.log(mode, ' NOT FOUND');
        }


        this.gameScene = new GameScene(canvas);
        this.gameController = new GameController(canvas);
        this.gameCore = new GameConstructor(this.gameController, this.gameScene);
    }

    start() {
        this.gameCore.start();
    }

    destroy() {
        this.gameCore.destroy();
    }
}
