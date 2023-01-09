# Kirizma (CW Edition)
- ⌨Kirizma - Typing game based on Dancing Onigiri "CW Edition"

キリズマは、[D4U](http://noia.g3.xrea.com/)さんが考案したブラウザで動作するタイピングゲーム風の音楽ゲームです。  
Kirizma (CW Edition)では、Dancing☆Onigiri (CW Edition)の基盤を利用してキリズマを再現しています。

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
- Dancing☆Onigiri (CW Edition)のフォルダ階層を基本に、リポジトリにあるファイルを上書きして使います。
   - kstyle.js  をjs フォルダへ
   - kstyle.css をcssフォルダへ
   - key_kirizma.txt の内容を danoni_setting.js の g_presetObj.keysData へ追加
```javascript
      g_presetObj.keysData=`

      |keyExtraList=27k,47k,31k,51k|  <- すでに追加しているカスタムキーがあればそれも足します
        (key_kirizma.txtの内容をコピー)

      `;
```

### 譜面ファイル側で設定する譜面ヘッダー（一例）
```
|customjs=kstyle.js|  <- 他のカスタムjsと併用可能です。
|customcss=kstyle.css|
```

## Related Tools Repository / 関連リポジトリ・ツール
- [キリズマ譜面データ変換機](https://github.com/suzme/kirizma-converter) @suzme
- [キリズマ歌詞表示作成ツール](https://github.com/prlg25/kirizma_lyric) @prlg25
- [キリズマ難易度表](https://github.com/suzme/kirizma) @suzme
