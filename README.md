# Kirizma (CW Edition)
- ⌨Kirizma - Typing rhythm game based on Dancing Onigiri "CW Edition"

キリズマは、[D4U](http://noia.g3.xrea.com/)さんが考案したブラウザで動作するタイピングゲーム風の音楽ゲームです。  
Kirizma (CW Edition)では、[Dancing☆Onigiri (CW Edition)](https://github.com/cwtickle/danoniplus)の基盤を利用してキリズマを再現しています。  
[SKB](https://github.com/superkuppabros)さん・[すずめ](https://github.com/suzme)さんが作成したカスタムjs/cssをベースに、機能追加を行ったものを公開しています。

## Specification / 特記事項
- ローマ字モードに限り、Displayオプションで文字の一部切替が可能です。  
※あらかじめ、ヘボン式風の譜面（「J」「C」「F」「R」を使う）として作成する必要があります）
- kstyle.jsでは、キリズマ用のキーとして末尾に「k」が入っているものを拾います。
- 特に27k(31k), 47k(51k)といった区別はしていません。
- キー数が47より小さい場合はローマ字モード、47以上の場合はかな文字モードと見做して処理します。
- ダンおに混在（27k, 47k以外）の場合、デフォルトのスクロール方向をReverse側に設定する必要があります。
（スクロールのデフォルト側のみを90度回転しているため）  
⇒使い方によっては、下段を5key以外にすることも可能です。

## Usage / 使い方
- Dancing☆Onigiri (CW Edition)のフォルダ階層に、リポジトリにあるファイルを上書きして使います。
   - kstyle.js  をjs フォルダへ
   - kstyle.css をcssフォルダへ
   - img/kirizma フォルダ一式をimgフォルダへ
   - danoni_setting.js の g_presetObj.keysData へキリズマ用のキー定義を追加 (v1のみ、v2以降は不要)
```javascript
g_presetObj.keysData=`

|keyExtraList=27k,47k,31k,51k|  <- すでに追加しているカスタムキーがあればそれも足します
(カスタムキー定義の内容をコピー)

`;
```

### 譜面ファイル側で設定する譜面ヘッダー（一例）
```
|customjs=kstyle.js|  <- 他のカスタムjsと併用可能です。
|customcss=kstyle.css|
|hashTag=#kirizma|
```

## Related Tools Repository / 関連リポジトリ・ツール
- [キリズマ譜面データ変換機](https://github.com/suzme/kirizma-converter) @suzme
- [キリズマ歌詞表示作成ツール](https://github.com/prlg25/kirizma_lyric) @prlg25
- [キリズマ難易度表](https://github.com/suzme/kirizma) @suzme
