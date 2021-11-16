'use strict';

const cache = {};

/**
 * 插件定义的方法
 * Methods defined by plug-ins
 * 可以在 package.json 里的 contributions 里定义 messages 触发这里的方法
 * And of course, messages can be defined in the contributions section in package.JSON to trigger the method here
 */
exports.methods = {
    openPanel (){
        console.log('receive message');
        Editor.Panel.open('replace-material.list');
    },
    async replace(mat){
        const type = Editor.Selection.getLastSelectedType();
        if(type !== 'node'){
            return;
        }

        const uuid = Editor.Selection.getLastSelected(type);
        const node = await Editor.Message.request('scene', 'query-node', uuid);
        const comps = node.__comps__;
        for (let i = 0; i < comps.length; i++) {
            const comp = comps[i];
            if (comp.type === 'cc.MeshRenderer'){
                // const oldUUID = comp.value.sharedMaterials.value[0].value.uuid;
                Editor.Message.send('scene', 'set-property', {
                    "dump": {
                        "type": "cc.Material",
                        "value": {
                            "uuid": mat
                        }
                    },
                    "path": `__comps__.${i}.sharedMaterials.0`,
                    "uuid": uuid
                });
            }
        }
    },
    async saveData(key, value) {
        cache[key] = value;
    },
    async getData(key) {
        if(cache[key]){
            const v = cache[key];
            delete cache[key];
            return v;
        }
    }
};

/**
 * 启动的时候执行的初始化方法
 * Initialization method performed at startup
 */
exports.load = function() {};

/**
 * 插件被关闭的时候执行的卸载方法
 * Uninstall method performed when the plug-in is closed
 */
exports.unload = function() {};
