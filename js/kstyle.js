'use strict';
/**
 * Dancing☆Onigiri カスタム用jsファイル
 * [for Kirizma]
 * 
 * Created: 2022/09/17
 * Revised: 2025/02/03
 * Source Version: Ver 2.1.0
 * 
 * https://github.com/cwtickle/kirizma-cw
 */
const g_kirizmaVersion = `Ver 2.1.0`;

// 初期設定定義
g_lblNameObj.dancing = `KIRI`;
g_lblNameObj.star = ``;
g_lblNameObj.onigiri = `ZMA`;

g_rootObj.specialUse = `true,OFF`;
g_rootObj.imgType = `kirizma,svg,true,0`;
g_rootObj.arrowJdgY = -10;
g_rootObj.frzJdgY = -50;

// キリズマ用文字定義
const g_kirizmaChars = {
	romaji: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
	romajiEx: 'ちこそしいはきくにまのりもみらせたすとかなひてさんつ'.split(''),

	romaji_num: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 '.split(''),
	romaji_numEx: 'ちこそしいはきくにまのりもみらせたすとかなひてさんつわぬふあうえおやゆよ　'.split(''),

	kana: 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん'.split(''),
	kanaEx: '3E456TGH:BXDRPCQAZWSUI1<KFV2^-JN]?M789OL>+_00Y'.split(''),

	kana_num: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 '.split(''),
	kana_numEx: '3E456TGH:BXDRPCQAZWSUI1<KFV2^-JN]?M789OL>+_00Yわぬふあうえおやゆよ '.split(''),

	kana_alphabet: 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんABCDEFGHIJKLMNOPQRSTUVWXYZ　'.split(''),
	kana_alphabetEx: '3E456TGH:BXDRPCQAZWSUI1<KFV2^-JN]?M789OL>+_00Yちこそしいはきくにまのりもみらせたすとかなひてさんつ '.split(''),

	kana_alphabet_num: 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789　'.split(''),
	kana_alphabet_numEx: '3E456TGH:BXDRPCQAZWSUI1<KFV2^-JN]?M789OL>+_00Yちこそしいはきくにまのりもみらせたすとかなひてさんつわぬふあうえおやゆよ '.split(''),
};

const crType = {
	k26: { char: g_kirizmaChars.romaji, exchar: g_kirizmaChars.romajiEx },
	k36: { char: g_kirizmaChars.romaji_num, exchar: g_kirizmaChars.romaji_numEx },
	k46: { char: g_kirizmaChars.kana, exchar: g_kirizmaChars.kanaEx },
	k56: { char: g_kirizmaChars.kana_num, exchar: g_kirizmaChars.kana_numEx },
	k72: { char: g_kirizmaChars.kana_alphabet, exchar: g_kirizmaChars.kana_alphabetEx },
	k82: { char: g_kirizmaChars.kana_alphabet_num, exchar: g_kirizmaChars.kana_alphabet_numEx },
};

// キリズマの移動量設定（変更不可）
const DIST_KIRIZMA = 650;

// キリズマ用キーコンバート　初期設定
g_stateObj.JtoZ = C_FLG_OFF;
g_stateObj.CtoT = C_FLG_OFF;
g_stateObj.FtoH = C_FLG_OFF;
g_stateObj.RtoL = C_FLG_OFF;
g_stateObj.NtoX = C_FLG_OFF;  // 未対応

// ダンおにが利用するレーン設定
g_stateObj._danoniDfLayer = 4;
g_stateObj._danoniRvLayer = 5;

/**
 * タイトル画面前の割込み処理（初回譜面読込後）
 * 
 * - 埋め込み譜面はリロードしないため、キリズマ(ローマ字モード)の一部データを退避
 *   このタイミング以後だと譜面を元に戻せないため、このタイミングで行う必要がある
 * - 移動量をキリズマ側に合わせる（スクロール見切れ対策）
 */
function kstylePreTitleInit() {

	// キリズマ譜面一部退避処理
	const queryDos = getQueryParamVal(`dos`) !== null ?
		`dos/${getQueryParamVal('dos')}.txt` : encodeURI(document.querySelector(`#externalDos`)?.value ?? ``);
	g_workObj.dosInternal = (queryDos === ``);

	const keepList = [`keyJ`, `keyZ`, `keyC`, `keyT`, `keyF`, `keyH`, `keyR`, `keyL`];
	for (let j = 0; j < g_detailObj.arrowCnt.length; j++) {
		const scoreIdH = setScoreIdHeader(j);
		keepList.forEach(val => g_rootObj[`${val}${scoreIdH}b_data`] = g_rootObj[`${val}${scoreIdH}_data`] || ``);
	}

	// 移動量をキリズマ側に合わせる（スクロール見切れ対策）
	g_posObj.distY = DIST_KIRIZMA - C_STEP_Y + g_posObj.stepYR;
	g_posObj.reverseStepY = g_posObj.distY - g_posObj.stepY - g_posObj.stepDiffY - C_ARW_WIDTH;
	g_posObj.arrowHeight = DIST_KIRIZMA + g_posObj.stepYR - g_posObj.stepDiffY * 2;

	// キリズマで扱えない機能を無効化
	g_headerObj.camoufrageUse = false;
	g_headerObj.swappingUse = false;

	// ショートカット
	g_shortcutObj.settingsDisplay.KeyJ = { id: `lnkJtoZ` };
	g_shortcutObj.settingsDisplay.KeyC = { id: `lnkCtoT` };
	g_shortcutObj.settingsDisplay.KeyF = { id: `lnkFtoH` };
	g_shortcutObj.settingsDisplay.KeyR = { id: `lnkRtoL` };
}
g_customJsObj.preTitle.push(kstylePreTitleInit);

/**
 * タイトル画面の割込み処理
 */
function kstyleTitleInit() {

	// キリズマ拡張クレジット
	multiAppend(divRoot,
		createCss2Button(`lnkCreditK`, `Kirizma(cw) ${g_kirizmaVersion}`, _ => openLink(`https://github.com/cwtickle/kirizma-cw`), {
			x: g_sWidth - 175, y: 0, w: 175, h: 20, siz: 12, align: C_ALIGN_RIGHT,
		}, g_cssObj.button_Back),
	);
}
g_customJsObj.title.push(kstyleTitleInit);

/**
 * ディスプレイ設定画面の割込み処理
 * 
 * - キリズマ(ローマ字モード)用にヘボン式の記法を他の記法に変換する設定を追加する（ディスプレイ切替ボタンを参考）
 */
function kstyleSettingsDisplayInit() {
	const keyCtrlPtn = `${g_keyObj.currentKey}_${g_keyObj.currentPtn}`;
	if (g_keyObj.currentKey.endsWith(`k`) && g_keyObj[`color${keyCtrlPtn}`].length < 47) {

		/**
		 * 汎用ボタン作成
		 * @param {string} _name 
		 * @param {number} _widthPos 
		 * @param {number} _heightPos 
		 */
		const makeLocalButton = (_name, _widthPos, _heightPos = 0) => {
			const flg = g_stateObj[_name];
			const list = [C_FLG_OFF, C_FLG_ON];

			// ボタンのON/OFF処理
			const switchDisplay = evt => {
				const displayFlg = g_stateObj[_name];
				const displayNum = list.findIndex(flg => flg === displayFlg);
				const nextDisplayFlg = list[(displayNum + 1) % list.length];
				g_stateObj[_name] = nextDisplayFlg;
				evt.target.classList.replace(g_cssObj[`button_${displayFlg}`], g_cssObj[`button_${nextDisplayFlg}`]);
			}

			// ボタンとして追加 (makeSettingLblCssButtonを流用)
			optionsprite.appendChild(
				makeSettingLblCssButton(`lnk${_name}`, _name.replace(`to`, ` -> `), _heightPos, evt => switchDisplay(evt), {
					x: 50 + 75 * _widthPos, w: 70, y: 290,
					title: ``, borderStyle: `solid`,
					cxtFunc: evt => switchDisplay(evt),
				}, `button_${flg}`)
			);
		};

		if (g_rootObj.kirizmaCc !== `none`) {

			// ラベルの追加
			optionsprite.appendChild(
				createDivCss2Label(`lblChar`, `Character Convert (Romaji Only)`, { x: 20, y: 275, siz: 12 })
			);

			// Character Convert ボタンのリスト（ここに設定した数だけ、kstylePreloading で設定が必要）
			// ※変換元が無ければボタン表示をしない方法に変更したため、checkKey と buttonList の配列数と順序は同じにする必要あり
			const id = setScoreIdHeader(g_stateObj.scoreId);
			const checkKey = [`keyJ`, `keyC`, `keyF`, `keyR`];
			const buttonList = [`JtoZ`, `CtoT`, `FtoH`, `RtoL`].filter((val, j) => hasVal(g_rootObj[`${checkKey[j]}${id}b_data`]) || g_stateObj.scoreLockFlg);
			buttonList.forEach((val, j) => makeLocalButton(val, j));
		}
	}
}
g_customJsObj.settingsDisplay.push(kstyleSettingsDisplayInit);


/**
 * 譜面データを分解する前の割込み処理
 * 
 * - キリズマ用にヘボン式の記法を他の記法に変換する設定をここで適用する(シャッフル時無効)
 * - g_rootObjを直接変更できる箇所はここで実施する必要がある
 */
function kstylePreloading() {
	const keyCtrlPtn = `${g_keyObj.currentKey}_${g_keyObj.currentPtn}`;

	if (g_keyObj.currentKey.endsWith(`k`) && g_keyObj[`color${keyCtrlPtn}`].length < 47 &&
		g_stateObj.shuffle === C_FLG_OFF) {

		const scoreIdH = setScoreIdHeader(g_stateObj.scoreId, g_stateObj.scoreLockFlg);
		const targetPairs = [];

		if (g_stateObj.JtoZ === C_FLG_ON) {
			targetPairs.push([`keyJ`, `keyZ`]);
		}
		if (g_stateObj.CtoT === C_FLG_ON) {
			targetPairs.push([`keyC`, `keyT`]);
		}
		if (g_stateObj.FtoH === C_FLG_ON) {
			targetPairs.push([`keyF`, `keyH`]);
		}
		if (g_stateObj.RtoL === C_FLG_ON) {
			targetPairs.push([`keyR`, `keyL`]);
		}

		// 譜面埋め込みの場合は譜面データを一度リセット
		const fromBk = g_workObj.dosInternal ? `b` : ``;
		if (g_workObj.dosInternal) {
			const keepList = [`keyJ`, `keyZ`, `keyC`, `keyT`, `keyF`, `keyH`, `keyR`, `keyL`];
			keepList.forEach(val => g_rootObj[`${val}${scoreIdH}_data`] = g_rootObj[`${val}${scoreIdH}${fromBk}_data`] || ``);
		}

		// 指定した文字に対して譜面元データを書き換え
		targetPairs.forEach(list => {
			if (!hasVal(g_rootObj[`${list[1]}${scoreIdH}${fromBk}_data`])) {
				g_rootObj[`${list[1]}${scoreIdH}_data`] = g_rootObj[`${list[0]}${scoreIdH}${fromBk}_data`] || ``;
			} else {
				g_rootObj[`${list[1]}${scoreIdH}_data`] = [(g_rootObj[`${list[1]}${scoreIdH}${fromBk}_data`] || ``), (g_rootObj[`${list[0]}${scoreIdH}${fromBk}_data`] || ``)].join(`,`);
			}
			g_rootObj[`${list[0]}${scoreIdH}_data`] = ``;
		});
	}
}
g_customJsObj.preloading.push(kstylePreloading);

/**
 * プレイ開始前の割り込み処理
 * - キリズマ以外のデータが存在する場合の振り分け処理
 */
function kstyleLoading() {

	// 全てのレーン数 ＞ キリズマ側のレーン数なら矢印があると見做す
	const keyNumMax = g_workObj.stepRtn.filter(val => val === `c`).length;
	if (g_workObj.stepRtn.length > keyNumMax) {

		// 矢印側はdividePosを4以上に設定する
		// StepArea: X-FlowerがdividePosが3以下を利用するため、0～3はキリズマレーンとする
		g_stateObj.layerNum = 6;
		g_workObj.stepRtn.forEach((val, j) => {
			if (val !== `c`) {
				g_workObj.dividePos[j] = (g_workObj.scrollDir[j] === 1 ?
					g_stateObj._danoniDfLayer : g_stateObj._danoniRvLayer);
			}
		})
	}
}
g_customJsObj.loading.push(kstyleLoading);

/**
 * プレイ画面初期化部分の割込み処理
 * 
 * - キリズマ譜面は矢印描画エリア(mainSprite, stepRoot)を-90度回転させる
 * - キリズマ部分はX-Y座標が反転しているため、変更する際は注意
 */
function kstyleMainInit() {

	// キリズマのステップゾーンを移動する (キー数の末尾が'k'ならキリズマ系統と見做す)
	if (g_keyObj.currentKey.endsWith(`k`)) {

		// キリズマ側のステップゾーン位置
		const pos = {
			'1': { x: 75, y: 350 },
			'-1': { x: 530, y: 230 },
		};

		const keyCtrlPtn = `${g_keyObj.currentKey}_${g_keyObj.currentPtn}`;
		const kirizmaNum = g_keyObj[`color${keyCtrlPtn}_0d`].filter(val => val === 0).length;
		g_workObj.charFlg = `k${kirizmaNum}`;

		// mainSpriteを90度回転させて移動方向を変更
		for (let j = 0; j < Math.min(g_stateObj.layerNum, 4); j++) {
			addTransform(`mainSprite${j}`, `kirizma`, `rotate(-90deg)`);
			$id(`mainSprite${j}`).left = `0px`;
			$id(`mainSprite${j}`).top = `-180px`;
		}
		// キリズマは通常より長いスクロール長のため、
		// ダンおにが使うReverseに合わせて位置を調整
		if (g_stateObj.layerNum > 4) {
			$id(`mainSprite${g_stateObj._danoniRvLayer}`).top = `${g_headerObj.playingHeight - DIST_KIRIZMA}px`;
		}

		// キリズマ側のレーンのみ初期位置を変更
		const keyNumMax = g_workObj.stepRtn.filter(val => val === `c`).length;
		for (let i = 0; i < keyNumMax; i++) {
			if (document.getElementById(`stepRoot${i}`)) {
				document.getElementById(`stepRoot${i}`).style.left = `${pos[g_workObj.scrollDir[i]].y}px`;
				document.getElementById(`stepRoot${i}`).style.top = `${pos[g_workObj.scrollDir[i]].x}px`;

				document.getElementById(`frzHit${i}`).style.left = `${pos[g_workObj.scrollDir[i]].y}px`;
				document.getElementById(`frzHit${i}`).style.top = `${pos[g_workObj.scrollDir[i]].x}px`;
			}
			g_workObj.stepX[i] = pos[g_workObj.scrollDir[i]].y;
		}
	}
}
g_customJsObj.main.push(kstyleMainInit);

/**
 * プレイ画面・フレーム毎処理の割込み
 * - キリズマの文字表示部分を定義 (Source by SKB)
 * @param {number} _j 
 * @param {string} _name 
 */
const __setKirizmaChara = (_j, _name) => {
	if (_j >= crType[g_workObj.charFlg].char.length) {
		return;
	}

	const targetId = document.getElementById(_name);
	if (g_stateObj.d_special === C_FLG_OFF) {
		// 補助表示OFF時
		const kirizmaChara = document.createElement('div');
		kirizmaChara.className = 'kirizma_chara';
		kirizmaChara.innerText = crType[g_workObj.charFlg].char[_j] ?? ``;
		targetId.appendChild(kirizmaChara);
	} else {
		// 補助表示ON時のメイン文字
		const kirizmaChara = document.createElement('div');
		kirizmaChara.className = 'kirizma_assist_chara';
		kirizmaChara.innerText = crType[g_workObj.charFlg].char[_j] ?? ``;
		targetId.appendChild(kirizmaChara);

		// 補助表示ON時の追加文字
		const kirizmaExChara = document.createElement('div');
		kirizmaExChara.className = 'kirizma_assist_exchara';
		kirizmaExChara.innerText = crType[g_workObj.charFlg].exchar[_j] ?? ``;
		targetId.appendChild(kirizmaExChara);
	}
};

g_customJsObj.makeArrow.push((_attrs, _arrowName, _name, _arrowCnt) =>
	__setKirizmaChara(_attrs.pos, _arrowName));
g_customJsObj.makeFrzArrow.push((_attrs, _arrowName, _name, _arrowCnt) =>
	__setKirizmaChara(_attrs.pos, `${_name}Top${_attrs.pos}_${_arrowCnt}`));

/**
 * キーコンフィグ画面の割込み処理
 * 
 * - キーコンフィグ画面上のキリズマ用文字表示 (Source by SKB, suzme)
 */
function kstyleKeyConfigInit() {
	if (g_keyObj.currentKey.endsWith(`k`)) {
		const keyCtrlPtn = `${g_keyObj.currentKey}_${g_keyObj.currentPtn}`;
		const kirizmaNum = g_keyObj[`color${keyCtrlPtn}_0d`].filter(val => val === 0).length;
		g_workObj.charFlg = `k${kirizmaNum}`;

		crType[g_workObj.charFlg].char.forEach((c, i) => {
			const kirizmaChara = document.createElement('div');
			kirizmaChara.className = 'kirizma_chara_key';
			kirizmaChara.innerText = c;
			document.getElementById('arrow' + i).appendChild(kirizmaChara);
		});

		// 標準の画像セットの選択を不許可
		if (!g_isFile) {
			g_keycons.imgTypes = g_keycons.imgTypes.filter(val => val !== `Original`);
		}
	}
}
g_customJsObj.keyconfig.push(kstyleKeyConfigInit);

// カスタムキー定義
g_presetObj.keysDataLib.push(`

|chara27k=keyA,keyB,keyC,keyD,keyE,keyF,keyG,keyH,keyI,keyJ,keyK,keyL,keyM,keyN,keyO,keyP,keyQ,keyR,keyS,keyT,keyU,keyV,keyW,keyX,keyY,keyZ,space|
|color27k=0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1|
|shuffle27k=0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1|
|stepRtn27k=c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c|
|pos27k=0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26|
|keyCtrl27k=65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,32|
|div27k=27|
|scale27k=0.95|
|scroll27k=Split::1,1,1,1,1,1,1,1,-1,-1,-1,-1,-1,-1,-1,-1,1,1,1,1,-1,1,1,1,-1,1,-1|
|minWidth27k=750|

|keyName37k=27k|
|chara37k=keyA,keyB,keyC,keyD,keyE,keyF,keyG,keyH,keyI,keyJ,keyK,keyL,keyM,keyN,keyO,keyP,keyQ,keyR,keyS,keyT,keyU,keyV,keyW,keyX,keyY,keyZ,keyOne,keyTwo,keyThree,keyFour,keyFive,keySix,keySeven,keyEight,keyNine,keyZero,space|
|color37k=0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1|
|shuffle37k=0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,2|
|stepRtn37k=c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c|
|keyCtrl37k=65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,49/97,50/98,51/99,52/100,53/101,54/102,55/103,56/104,57/105,48/96,32|
|div37k=37|
|scale37k=0.95|
|scroll37k=Split::1,1,1,1,1,1,1,1,-1,-1,-1,-1,-1,-1,-1,-1,1,1,1,1,-1,1,1,1,-1,1,1,1,1,1,1,-1,-1,-1,-1,-1,-1|
|minWidth37k=750|

|chara47k=keyA,keyI,keyU,keyE,keyO,keyKA,keyKI,keyKU,keyKE,keyKO,keySA,keySI,keySU,keySE,keySO,keyTA,keyTI,keyTU,keyTE,keyTO,keyNA,keyNI,keyNU,keyNE,keyNO,keyHA,keyHI,keyHU,keyHE,keyHO,keyMA,keyMI,keyMU,keyME,keyMO,keyYA,keyYU,keyYO,keyRA,keyRI,keyRU,keyRE,keyRO,keyWA,keyWO,keyNN,space|
|color47k=0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1|
|shuffle47k=0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1|
|stepRtn47k=c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c|
|pos47k=0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46|
|keyCtrl47k=51,69,52,53,54,84,71,72,186,66,88,68,82,80,67,81,65,90,87,83,85,73,49,188,75,70,86,50,222,189,74,78,221,191,77,55,56,57,79,76,190,187,226,48,48,89,32|
|div47k=47|
|scale47k=0.95|
|scroll47k=Split::1,1,1,1,1,1,1,-1,-1,1,1,1,1,-1,1,1,1,1,1,1,-1,-1,1,-1,-1,1,1,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1|
|minWidth47k=750|

|keyName57k=47k|
|chara57k=keyA,keyI,keyU,keyE,keyO,keyKA,keyKI,keyKU,keyKE,keyKO,keySA,keySI,keySU,keySE,keySO,keyTA,keyTI,keyTU,keyTE,keyTO,keyNA,keyNI,keyNU,keyNE,keyNO,keyHA,keyHI,keyHU,keyHE,keyHO,keyMA,keyMI,keyMU,keyME,keyMO,keyYA,keyYU,keyYO,keyRA,keyRI,keyRU,keyRE,keyRO,keyWA,keyWO,keyNN,keyZERO,keyONE,keyTWO,keyTHREE,keyFOUR,keyFIVE,keySIX,keySEVEN,keyEIGHT,keyNINE,space|
|color57k=0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1|
|shuffle57k=0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,2|
|stepRtn57k=c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c|
|pos57k=0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56|
|keyCtrl57k=51,69,52,53,54,84,71,72,186,66,88,68,82,80,67,81,65,90,87,83,85,73,49,188,75,70,86,50,222,189,74,78,221,191,77,55,56,57,79,76,190,187,226,48,48,89,48/96,49/97,50/98,51/99,52/100,53/101,54/102,55/103,56/104,57/105,32|
|div57k=57|
|scale57k=0.95|
|scroll57k=Split::1,1,1,1,1,1,1,-1,-1,1,1,1,1,-1,1,1,1,1,1,1,-1,-1,1,-1,-1,1,1,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,1,1,1,1,-1,-1,-1,-1,-1|
|minWidth57k=750|

|keyName73k=47k|
|chara73k=keyAA,keyII,keyUU,keyEE,keyOO,keyKA,keyKI,keyKU,keyKE,keyKO,keySA,keySI,keySU,keySE,keySO,keyTA,keyTI,keyTU,keyTE,keyTO,keyNA,keyNI,keyNU,keyNE,keyNO,keyHA,keyHI,keyHU,keyHE,keyHO,keyMA,keyMI,keyMU,keyME,keyMO,keyYA,keyYU,keyYO,keyRA,keyRI,keyRU,keyRE,keyRO,keyWA,keyWO,keyNN,keyA,keyB,keyC,keyD,keyE,keyF,keyG,keyH,keyI,keyJ,keyK,keyL,keyM,keyN,keyO,keyP,keyQ,keyR,keyS,keyT,keyU,keyV,keyW,keyX,keyY,keyZ,space|
|color73k=0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1|
|shuffle73k=0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2|
|stepRtn73k=c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c|
|pos73k=0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72|
|keyCtrl73k=51,69,52,53,54,84,71,72,186,66,88,68,82,80,67,81,65,90,87,83,85,73,49,188,75,70,86,50,222,189,74,78,221,191,77,55,56,57,79,76,190,187,226,48,48,89,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,32|
|div73k=73|
|scale73k=0.95|
|minWidth73k=750|

|keyName83k=47k|
|chara83k=keyAA,keyII,keyUU,keyEE,keyOO,keyKA,keyKI,keyKU,keyKE,keyKO,keySA,keySI,keySU,keySE,keySO,keyTA,keyTI,keyTU,keyTE,keyTO,keyNA,keyNI,keyNU,keyNE,keyNO,keyHA,keyHI,keyHU,keyHE,keyHO,keyMA,keyMI,keyMU,keyME,keyMO,keyYA,keyYU,keyYO,keyRA,keyRI,keyRU,keyRE,keyRO,keyWA,keyWO,keyNN,keyA,keyB,keyC,keyD,keyE,keyF,keyG,keyH,keyI,keyJ,keyK,keyL,keyM,keyN,keyO,keyP,keyQ,keyR,keyS,keyT,keyU,keyV,keyW,keyX,keyY,keyZ,keyZERO,keyONE,keyTWO,keyTHREE,keyFOUR,keyFIVE,keySIX,keySEVEN,keyEIGHT,keyNINE,space|
|color83k=0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1|
|shuffle83k=0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,3|
|stepRtn83k=c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c|
|pos83k=0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82|
|keyCtrl83k=51,69,52,53,54,84,71,72,186,66,88,68,82,80,67,81,65,90,87,83,85,73,49,188,75,70,86,50,222,189,74,78,221,191,77,55,56,57,79,76,190,187,226,48,48,89,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,48/96,49/97,50/98,51/99,52/100,53/101,54/102,55/103,56/104,57/105,32|
|div83k=83|
|scale83k=0.95|
|minWidth83k=750|

|chara31k=keyA,keyB,keyC,keyD,keyE,keyF,keyG,keyH,keyI,keyJ,keyK,keyL,keyM,keyN,keyO,keyP,keyQ,keyR,keyS,keyT,keyU,keyV,keyW,keyX,keyY,keyZ,left,down,up,right,space$keyA,keyB,keyC,keyD,keyE,keyF,keyG,keyH,keyI,keyJ,keyK,keyL,keyM,keyN,keyO,keyP,keyQ,keyR,keyS,keyT,keyU,keyV,keyW,keyX,keyY,keyZ,space,left,down,up,right|
|color31k=0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,3$0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,2,2,2,2|
|shuffle31k=0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,3$0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,2,2,2,2|
|stepRtn31k=c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,0,-90,90,180,onigiri$c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,onigiri,0,-90,90,180|
|pos31k=0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30$0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30|
|keyCtrl31k=65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,37,40,38,39,32$65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,32,37,40,38,39|
|div31k=26$26|
|scale31k=0.9$0.9|
|scroll31k=Split::1,1,1,1,1,1,1,1,-1,-1,-1,-1,-1,-1,-1,-1,1,1,1,1,-1,1,1,1,-1,1,-1,-1,1,1,1$Split::1,1,1,1,1,1,1,1,-1,-1,-1,-1,-1,-1,-1,-1,1,1,1,1,-1,1,1,1,-1,1,-1,-1,-1,1,1|
|minWidth31k=750|

|keyName41k=31k|
|chara41k=keyA,keyB,keyC,keyD,keyE,keyF,keyG,keyH,keyI,keyJ,keyK,keyL,keyM,keyN,keyO,keyP,keyQ,keyR,keyS,keyT,keyU,keyV,keyW,keyX,keyY,keyZ,keyZERO,keyONE,keyTWO,keyTHREE,keyFOUR,keyFIVE,keySIX,keySEVEN,keyEIGHT,keyNINE,left,down,up,right,space$keyA,keyB,keyC,keyD,keyE,keyF,keyG,keyH,keyI,keyJ,keyK,keyL,keyM,keyN,keyO,keyP,keyQ,keyR,keyS,keyT,keyU,keyV,keyW,keyX,keyY,keyZ,keyZERO,keyONE,keyTWO,keyTHREE,keyFOUR,keyFIVE,keySIX,keySEVEN,keyEIGHT,keyNINE,space,left,down,up,right|
|color41k=0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,3$0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,2,2,2,2|
|shuffle41k=0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,2,2,2,2,3$0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,3,2,2,2,2|
|stepRtn41k=c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,0,-90,90,180,onigiri$c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,onigiri,0,-90,90,180|
|pos41k=0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40$0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40|
|keyCtrl41k=65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,48/96,49/97,50/98,51/99,52/100,53/101,54/102,55/103,56/104,57/105,37,40,38,39,32$65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,48/96,49/97,50/98,51/99,52/100,53/101,54/102,55/103,56/104,57/105,32,37,40,38,39|
|div41k=36$36|
|scale41k=0.9$0.9|
|scroll41k=Split::1,1,1,1,1,1,1,1,-1,-1,-1,-1,-1,-1,-1,-1,1,1,1,1,-1,1,1,1,-1,1,1,1,1,1,1,-1,-1,-1,-1,-1,-1,-1,-1,1,1,1$Split::1,1,1,1,1,1,1,1,-1,-1,-1,-1,-1,-1,-1,-1,1,1,1,1,-1,1,1,1,-1,1,1,1,1,1,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,1|
|minWidth41k=750|

|chara51k=keyA,keyI,keyU,keyE,keyO,keyKA,keyKI,keyKU,keyKE,keyKO,keySA,keySI,keySU,keySE,keySO,keyTA,keyTI,keyTU,keyTE,keyTO,keyNA,keyNI,keyNU,keyNE,keyNO,keyHA,keyHI,keyHU,keyHE,keyHO,keyMA,keyMI,keyMU,keyME,keyMO,keyYA,keyYU,keyYO,keyRA,keyRI,keyRU,keyRE,keyRO,keyWA,keyWO,keyNN,left,down,up,right,space$keyA,keyI,keyU,keyE,keyO,keyKA,keyKI,keyKU,keyKE,keyKO,keySA,keySI,keySU,keySE,keySO,keyTA,keyTI,keyTU,keyTE,keyTO,keyNA,keyNI,keyNU,keyNE,keyNO,keyHA,keyHI,keyHU,keyHE,keyHO,keyMA,keyMI,keyMU,keyME,keyMO,keyYA,keyYU,keyYO,keyRA,keyRI,keyRU,keyRE,keyRO,keyWA,keyWO,keyNN,space,left,down,up,right|
|color51k=0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,3$0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,2,2,2,2|
|shuffle51k=0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,3$0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,2,2,2,2|
|stepRtn51k=c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,0,-90,90,180,onigiri$c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,onigiri,0,-90,90,180|
|pos51k=0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50$0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50|
|keyCtrl51k=51,69,52,53,54,84,71,72,186,66,88,68,82,80,67,81,65,90,87,83,85,73,49,188,75,70,86,50,222,189,74,78,221,191,77,55,56,57,79,76,190,187,226,48,48,89,37,40,38,39,32$51,69,52,53,54,84,71,72,186,66,88,68,82,80,67,81,65,90,87,83,85,73,49,188,75,70,86,50,222,189,74,78,221,191,77,55,56,57,79,76,190,187,226,48,48,89,32,37,40,38,39|
|div51k=46$46|
|scale51k=0.9$0.9|
|scroll51k=Split::1,1,1,1,1,1,1,-1,-1,1,1,1,1,-1,1,1,1,1,1,1,-1,-1,1,-1,-1,1,1,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,1,1$Split::1,1,1,1,1,1,1,-1,-1,1,1,1,1,-1,1,1,1,1,1,1,-1,-1,1,-1,-1,1,1,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,1|
|minWidth51k=750|

|keyName61k=51k|
|chara61k=keyA,keyI,keyU,keyE,keyO,keyKA,keyKI,keyKU,keyKE,keyKO,keySA,keySI,keySU,keySE,keySO,keyTA,keyTI,keyTU,keyTE,keyTO,keyNA,keyNI,keyNU,keyNE,keyNO,keyHA,keyHI,keyHU,keyHE,keyHO,keyMA,keyMI,keyMU,keyME,keyMO,keyYA,keyYU,keyYO,keyRA,keyRI,keyRU,keyRE,keyRO,keyWA,keyWO,keyNN,keyZERO,keyONE,keyTWO,keyTHREE,keyFOUR,keyFIVE,keySIX,keySEVEN,keyEIGHT,keyNINE,left,down,up,right,space$keyA,keyI,keyU,keyE,keyO,keyKA,keyKI,keyKU,keyKE,keyKO,keySA,keySI,keySU,keySE,keySO,keyTA,keyTI,keyTU,keyTE,keyTO,keyNA,keyNI,keyNU,keyNE,keyNO,keyHA,keyHI,keyHU,keyHE,keyHO,keyMA,keyMI,keyMU,keyME,keyMO,keyYA,keyYU,keyYO,keyRA,keyRI,keyRU,keyRE,keyRO,keyWA,keyWO,keyNN,keyZERO,keyONE,keyTWO,keyTHREE,keyFOUR,keyFIVE,keySIX,keySEVEN,keyEIGHT,keyNINE,space,left,down,up,right|
|color61k=0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,3$0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,2,2,2,2|
|shuffle61k=0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,2,2,2,2,3$0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,3,2,2,2,2|
|stepRtn61k=c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,0,-90,90,180,onigiri$c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,c,onigiri,0,-90,90,180|
|pos61k=0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60$0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,6|
|keyCtrl61k=51,69,52,53,54,84,71,72,186,66,88,68,82,80,67,81,65,90,87,83,85,73,49,188,75,70,86,50,222,189,74,78,221,191,77,55,56,57,79,76,190,187,226,48,48,89,48/96,49/97,50/98,51/99,52/100,53/101,54/102,55/103,56/104,57/105,37,40,38,39,32$51,69,52,53,54,84,71,72,186,66,88,68,82,80,67,81,65,90,87,83,85,73,49,188,75,70,86,50,222,189,74,78,221,191,77,55,56,57,79,76,190,187,226,48,48,89,48/96,49/97,50/98,51/99,52/100,53/101,54/102,55/103,56/104,57/105,32,37,40,38,39|
|div61k=56$56|
|scale61k=0.9$0.9|
|scroll61k=Split::1,1,1,1,1,1,1,-1,-1,1,1,1,1,-1,1,1,1,1,1,1,-1,-1,1,-1,-1,1,1,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,1,1,1,1,-1,-1,-1,-1,-1,-1,-1,1,1,1$Split::1,1,1,1,1,1,1,-1,-1,1,1,1,1,-1,1,1,1,1,1,1,-1,-1,1,-1,-1,1,1,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,1,1,1,1,1,-1,-1,-1,-1,-1,-1,-1,-1,1,1|
|minWidth61k=750|

`);