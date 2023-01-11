'use strict';
/**
 * Dancing☆Onigiri カスタム用jsファイル
 * [for Kirizma]
 * 
 * Created: 2022/09/17
 * Revised: 2023/01/11
 * Source Version: Ver 1.5.1
 * 
 * https://github.com/cwtickle/kirizma-cw
 */
const g_kirizmaVersion = `Ver 1.5.1`;

// 初期設定定義
g_lblNameObj.dancing = `KIRI`;
g_lblNameObj.star = ``;
g_lblNameObj.onigiri = `ZMA`;

g_rootObj.arrowEffectUse = `false,ON`;
g_rootObj.specialUse = `true,OFF`;
g_rootObj.imgType = `kirizma,svg,true,0`;
g_rootObj.arrowJdgY = -10;
g_rootObj.frzJdgY = -50;

// 矢印モーション初期定義
g_rootObj.arrowMotion_data = `
0,20,blocks,blocks
0,21,blocks,blocks
`;

g_rootObj.frzMotion_data = `
0,20,fblocks,fblocks
0,21,fblocks,fblocks
`;

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
 * プレイ画面初期化部分の割込み処理
 * 
 * - キリズマ譜面は矢印描画エリア(mainSprite, stepRoot)を-90度回転させる
 * - ダンおに譜面混載時は、ダンおに部分(arrowSprite, stepRoot)のみさらに90度回転させる
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
		mainSprite.style.transform = `rotate(-90deg)`;
		mainSprite.style.left = `-80px`;
		mainSprite.style.top = `-100px`;

		// 矢印部分（本体）に対してオブジェクト(arrowSprite)を再回転
		const rerotateFlow = _num => {
			const scdir = g_workObj.dividePos[_num];
			const id = document.getElementById(`arrowSprite${scdir}`);
			id.style.transform = `rotate(90deg)`;
			id.style.left = `${(scdir === 1 ? 0 : (g_sHeight - DIST_KIRIZMA)) - 10}px`;
			id.style.top = `0px`;
		};

		// 全てのレーン数 ＞ キリズマ側のレーン数なら矢印側のオブジェクトを回転
		const keyNumMax = g_workObj.stepRtn.filter(val => val === `c`).length;
		if (g_workObj.stepRtn.length > keyNumMax) {
			rerotateFlow(keyNumMax);
		}

		for (let i = 0; i < keyNumMax; i++) {
			if (document.getElementById(`stepRoot${i}`)) {
				document.getElementById(`stepRoot${i}`).style.left = `${pos[g_workObj.scrollDir[i]].y}px`;
				document.getElementById(`stepRoot${i}`).style.top = `${pos[g_workObj.scrollDir[i]].x}px`;

				document.getElementById(`frzHit${i}`).style.left = `${pos[g_workObj.scrollDir[i]].y}px`;
				document.getElementById(`frzHit${i}`).style.top = `${pos[g_workObj.scrollDir[i]].x}px`;
			}
			g_workObj.stepX[i] = pos[g_workObj.scrollDir[i]].y;
		}

		// 矢印部分（ステップゾーン）に対してオブジェクト(stepRoot)を再回転
		for (let i = keyNumMax; i < g_workObj.arrowRtn.length; i++) {
			const id = document.getElementById(`stepRoot${i}`);
			const scdir = g_workObj.dividePos[i];
			id.style.transform = `rotate(90deg)`;
			id.style.left = `${scdir === 1 ? 120 : g_sHeight - 85}px`;
			id.style.top = `${g_workObj.stepX[i] - C_ARW_WIDTH}px`;
		}
	}
}
g_customJsObj.main.push(kstyleMainInit);

/**
 * プレイ画面・フレーム毎処理の割込み
 * - キリズマの文字表示部分を定義 (Source by SKB)
 */
function kstyleMainEnterFrame() {

	const attributeName = 'overlay_character';
	const arrowPattern = /arrow(?<arrowNum>\d+)_(\d+)/;
	const frzPattern = /frz(?<arrowNum>\d+)_(\d+)/;

	const putCharOnBlock = (block, pattern, cType) => {
		if (!block.hasAttribute(attributeName)) {
			block.setAttribute(attributeName, true);
			const id = block.id;
			const arrowNum = pattern.exec(id).groups.arrowNum;
			const targetId = document.getElementById(`${cType}${pattern.exec(id)[1]}_${pattern.exec(id)[2]}`);

			if (g_stateObj.d_special === C_FLG_OFF) {
				// 補助表示OFF時
				const kirizmaChara = document.createElement('div');
				kirizmaChara.className = 'kirizma_chara';
				kirizmaChara.innerText = crType[g_workObj.charFlg].char[arrowNum] ?? ``;
				targetId.appendChild(kirizmaChara);
			} else {
				// 補助表示ON時のメイン文字
				const kirizmaChara = document.createElement('div');
				kirizmaChara.className = 'kirizma_assist_chara';
				kirizmaChara.innerText = crType[g_workObj.charFlg].char[arrowNum] ?? ``;
				targetId.appendChild(kirizmaChara);

				// 補助表示ON時の追加文字
				const kirizmaExChara = document.createElement('div');
				kirizmaExChara.className = 'kirizma_assist_exchara';
				kirizmaExChara.innerText = crType[g_workObj.charFlg].exchar[arrowNum] ?? ``;
				targetId.appendChild(kirizmaExChara);
			}
		}
	}

	Array.from(document.getElementsByClassName('blocks')).forEach(b => putCharOnBlock(b, arrowPattern, `arrow`));
	Array.from(document.getElementsByClassName('fblocks')).forEach(b => putCharOnBlock(b, frzPattern, `frzTop`));
}
g_customJsObj.mainEnterFrame.push(kstyleMainEnterFrame);

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
