'use strict';
const fs = require('fs');
const path = require('path');

// html text
exports.template = fs.readFileSync(path.join(__dirname, 'panel.html'), 'utf8');
// style text
exports.style = `
ui-asset { margin: 15px 5% 5px; width: 90% }
ui-button { margin: 5px 5%; }
`;
// html selector after rendering
exports.$ = {
    material: '.mat',
    btn: 'ui-button',
};
// method on the panel
exports.methods = {};
// event triggered on the panel
exports.listeners = {};

let change = '';

// Triggered when the panel is rendered successfully
exports.ready = async function () {
    this.$.btn.addEventListener('confirm', ()=>{
        const mat = this.$.material.value;
        if(mat && mat.length > 0){
            Editor.Message.send('replace-material', 'replace', mat);
        }
    });

    const data = await Editor.Profile.getConfig('replace-material', 'mat');
    change = data || '';
    // const data = await Editor.Message.request('replace-material', 'get-data', 'panel-mat');
    if(data && data.length > 0){
        this.$.material.value = data;
    }
};
// Triggered when trying to close the panel
exports.beforeClose = async function () {
    const uuid = this.$.material.value;
    console.log(`save mat: ${uuid}`);
    if (uuid !== change){
        // Editor.Message.send('replace-material', 'save-data', 'panel-mat', uuid);
        Editor.Profile.getConfig('replace-material', 'mat', uuid);
    }
 };
// Triggered when the panel is actually closed
exports.close = async function () { };
