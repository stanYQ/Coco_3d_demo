"use strict"

import Fs = require('fs');




// 面板的内容
export const template = Fs.readFileSync(__dirname + "/index.html", "utf-8");

// 面板上的样式
export const style = Fs.readFileSync(__dirname + "/style.css", "utf-8");;

export interface IColorInfo {
	describe: any,
	colorName: any,
	colorRGB: any,
	colorHex: any
}

export const $ = {
	app: "#app"
}

export const ready = function () {
	console.log("初始化")
	console.log(__dirname, Editor.Project.path)
	let vue = require('../../node_modules/vue/dist/vue.js')
	new vue({
		el: this.$.app,
		created: function () {
			console.log("Vue初始化成功")
			Fs.readFile(this.root, 'utf8', (err, data) => {
				if (err) {
					return;
				} else {
					// 停止执行代码直到操作结束
					let colorString = data.toString();
					this.colors = [];
					let stringArr = colorString.split('/**');
					for (let i = 1; i < stringArr.length; i++) {
						let colorInfo = stringArr[i].split("\n")[1];
						let color: IColorInfo = {
							describe: "",
							colorName: "",
							colorRGB: [],
							colorHex: ""

						};
						color.describe = stringArr[i].split("\n")[0].split('*/')[0];
						color.colorName = colorInfo.split(":")[0].replace(/\s*/g, "");
						color.colorRGB = colorInfo.split(":")[1].split("(")[1].split(")")[0].split(",");
						color.colorRGB[3] = color.colorRGB[3] ? Number(color.colorRGB[3]) / 255 : 1;
						color.colorRGB = `rgba(${color.colorRGB})`;
						color.colorHex = this.colorRGBtoHex(colorInfo.split(":")[1].split("(")[1].split(")")[0]);
						this.colors.push(color);
					}
					console.log(this.colors)
				}
			});
		},
		data: function () {
			return {
				root: Editor.Project.path + "/assets/Script/Game/Common/JXColor.ts",
				colors: [],
				addInfo: {
					describe: "",
					colorName: "",
					colorRGB: 'rgba(0, 0, 0,1)',
					colorHex: ""
				}
			}
		},
		methods: {
			onAddBtnClick() {
				this.checkInfo();
			},

			checkInfo() {
				let that = this as any;
				if (that.addInfo.colorRGB === undefined || that.addInfo.colorRGB === "") {
					that.addInfo.colorRGB = 'rgba(0, 0, 0,1)'
				}
				if (that.isChn(that.addInfo.colorName)) {
					alert("名称不允许存在中文！");
					return;
				}
				if (that.addInfo.describe === undefined || that.addInfo.colorName === undefined || that.addInfo.colorName === "" || that.addInfo.describe === "") {
					alert("请输入完整信息！");
					return;
				}
				for (let i = 0; i < that.colors.length; i++) {
					if (that.addInfo.colorName == that.colors[i].colorName) {
						alert("该颜色已被定义！");
						return;
					}
				}
				console.log(that.addInfo.colorRGB)
				that.addInfo.colorHex = that.colorRGBtoHex(that.addInfo.colorRGB.split("(")[1].split(')')[0]);
				that.colors.push(that.addInfo);
				that.addInfo = {
					describe: "",
					colorName: "",
					colorRGB: 'rgba(0, 0, 0,1)',
					colorHex: ""
				}
			},

			isChn(str: string) {
				if (/.*[\u4e00-\u9fa5]+.*$/.test(str)) {
					return true;
				}
				return false;
			},

			colorRGBtoHex(color: string) {
				console.log(color)
				var rgb = color.split(',');
				var r = parseInt(rgb[0]);
				var g = parseInt(rgb[1]);
				var b = parseInt(rgb[2]);
				var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
				return hex;
			},

			onDeriveBtnClick() {
				const startString = 'import { color } from "cc";\n export const JXColor = {\n'
				const endString = "\n}"
				let addString = '';
				let that = this as any;
				that.colors.forEach((color: any) => {
					let Rgb = "";
					console.log(color)
					if (typeof (color.colorRGB) === "string") {
						Rgb = color.colorRGB.split("(")[1].split(")")[0];
					} else {
						Rgb = color.colorRGB.join(',');
					}
					let RgbArr: any[] = Rgb.split(',');
					if (Number(RgbArr[3]) >= 0 && Number(RgbArr[3]) <= 1) {
						RgbArr[3] = Number(RgbArr[3]) * 255;
					}
					Rgb = RgbArr.join(',');
					addString += `
/**${color.describe}*/\n${color.colorName}: color(${Rgb}),`
				});
				const writeString = startString + addString + endString;
				Editor.Message.send('asset-db', 'create-asset', 'db://assets/Script/Game/Common/JXColor.ts', writeString)
			},

			onRemoveBtnClick(colorName: any) {
				let that = this as any;
				that.colors.splice(that.colors.findIndex((color: any) => color.colorName === colorName), 1);
			}
		}
	})

}

export const close = function () {
	var r = confirm("关闭前请确认数据是否保存！！！");
	return r;
}