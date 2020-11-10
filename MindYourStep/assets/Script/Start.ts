import { Component, director, loader, sys, view, _decorator } from "cc";
const { ccclass, property } = _decorator;
@ccclass("Start")
export class Start extends Component {
    start() {
        //微信环境分包下载
        if (sys.isMobile) {
            loader.downloader.loadSubpackage('cocos', function (err) {
                if (err) {
                    return console.error(err);
                }
                console.log('load subpackage successfully.');
                view.enableRetina(true);
                director.loadScene('game');
            })
        } else {
            director.loadScene("game");
        }
    }
}