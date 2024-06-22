"use client";

import React, { useMemo, useRef } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";

const Component02: React.FC = () => {
  // コンポーネントのref ------------------------
  // ReactQuillコンポーネントのref
  const quillRef = useRef<ReactQuill>(null);
  // ↑ 普通のJavaScriptでいう、new Quill() のようなものです。
  // ReactQuillコンポーネントから、quillを引っ張り出して参照して使います。

  // カスタムBlotの作成 ------------------------
  // blots/embed をインポートして定数に代入
  const BlockEmbed = Quill.import("blots/embed");
  // ImgBlotに渡すデータの型定義
  interface FileBlotProps {
    src: string;
    name: string;
  }
  // BlockEmbedを継承して、画像のブロックを作成
  class ImgBlot extends BlockEmbed {
    // 出力したいHTMLエレメントの生成
    static create(data: FileBlotProps): any {
      const node = super.create();
      node.setAttribute("data-name", data.name); // ↓のvalueと対応している
      node.src = data.src; // ↓のvalueと対応している
      node.alt = "画像";
      console.log(node);
      return node;
    }

    // 渡すデータの定義(HTML属性から抽出)
    static value(domNode: HTMLIFrameElement): any {
      return {
        // ここで定義したデータは、↑のcreateで、必ず同じAttributeにセットするようにしてください。
        name: domNode.getAttribute("data-name"),
        src: domNode.getAttribute("src"),
      };
    }
  }
  // Quillに入るタグを定義します。今回はimgタグを入れます。場合によってはdivなど使います。
  ImgBlot.tagName = "img";
  // 作成したBlotの登録
  ImgBlot.blotName = "img_blot"; // blotの名前≒IDです。既存のBlot(Quill標準のもの＋先にカスタムで作ったもの)と重複しないように命名します。
  ImgBlot.className = "nodoCollectionImg"; // 出力されるHTMLタグにつけるクラス名です。「このHTMLタグはどのblotなのか」を判別するのにも利用されるので、他と重複しないクラス名をつけます。
  Quill.register(ImgBlot, true); // Quillに登録します。これをやっておかないと、QuillがImgBlotを認識してくれません。

  // 画像の選択肢 ----------------
  const imgSelectList = useMemo(() => {
    return [
      {
        id: "idea",
        name: "アイディア",
      },
      {
        id: "project",
        name: "プロジェクト",
      },
      {
        id: "knowledge",
        name: "ナレッジ",
      },
      {
        id: "news",
        name: "ニュース",
      },
    ];
  }, []);

  // modules --------------------------------
  // MEMO:useMemoで制御しないと、エディターが表示されなくなります
  const modules = useMemo(() => {
    return {
      toolbar: {
        container: "#toolbar-blot", // id="toorbar"のHTMLエレメントにツールバーを入れる
        handlers: {
          // ここに、オリジナルの機能で使う処理を追加します。
          image: (selectedImg: string): void => {
            console.log(selectedImg);
            // 現在選択中の画像についての情報
            const selectedDataIndex = imgSelectList.findIndex(
              (p) => p.id === selectedImg
            );
            const insImgData = imgSelectList[selectedDataIndex];
            console.log(insImgData);
            // ReactQuillコンポーネントのrefからquillの中身を抽出
            const quill = quillRef.current?.editor;
            if (
              quill !== undefined &&
              quill !== undefined &&
              quill !== null &&
              insImgData !== undefined
            ) {
              // 現在のQuillエディタ内のカーソル位置を取得
              const selection = quill?.getSelection(true);
              const cursorIndex =
                selection !== undefined && selection !== null
                  ? selection.index
                  : 1;
              quill.insertText(cursorIndex, "\n");
              // img_blotをQillエディタ内に入れる
              quill.insertEmbed(
                cursorIndex, // 現在のカーソル位置
                "img_blot", // img_blotを入れる
                {
                  name: insImgData.name,
                  src: `/img/${insImgData.id}.webp`,
                }, // ImgBlotのcreateに渡すvalue
                "api" // 入力タイプ(ここでは気にせずただ「api」と入れてください)
              );
            }
          },
        },
      },
    };
  }, []);

  // ReactQuillコンポーネント ----------------
  return (
    <div>
      <sub>
        ※画像ボタンは、押すとそれぞれアイディア、プロジェクト、ナレッジ、ニュース
        のサムネイルが入ります
      </sub>
      <div id="toolbar-blot">
        <button type="button" className="ql-bold">
          Bold
        </button>
        <button type="button" className="ql-italic">
          Italic
        </button>
        <button type="button" className="ql-image" value="idea">
          アイディア
        </button>
        <button type="button" className="ql-image" value="project">
          プロジェクト
        </button>
        <button type="button" className="ql-image" value="knowledge">
          ナレッジ
        </button>
        <button type="button" className="ql-image" value="news">
          ニュース
        </button>
      </div>
      <ReactQuill
        ref={quillRef} // ReactQuillコンポーネントのrefをセット
        modules={modules}
        placeholder="ここにテキストを入力..."
      />
    </div>
  );
};
export default Component02;
