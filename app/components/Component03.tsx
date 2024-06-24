"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import "@/utils/quill/emoji/custom-emoji";

// ReactQuill の icon をインポート
const icons = ReactQuill.Quill.import("ui/icons");
import qlColor from "@/public/img/ql-color.svg";
import qlBackground from "@/public/img/ql-background.svg";
import qlEmoji from "@/public/img/ql-emoji.svg";

// デフォルトのアイコンを上書き
icons["color"] = '<img src="' + qlColor.src + '" alt="" />';
icons["background"] = '<img src="' + qlBackground.src + '" alt="" />';

// delta/collectionDetail.ts から取得したデータ
import { collectionDetail } from "@/delta/collectionDetail";

const Component03: React.FC = () => {
  const quillRef = useRef<ReactQuill>(null);
  const [data, setData] = useState(collectionDetail.body);

  const BlockEmbed = Quill.import("blots/embed");
  interface FileBlotProps {
    src: string;
    name: string;
    size?: string;
  }

  // 画像
  class ImgBlot extends BlockEmbed {
    static create(data: FileBlotProps): any {
      const node = super.create();
      node.setAttribute("data-extension", data.name);
      node.src = data.src;
      node.alt = "画像";
      return node;
    }

    static value(domNode: HTMLIFrameElement): any {
      return {
        name: domNode.getAttribute("data-extension"),
        src: domNode.getAttribute("src"),
      };
    }
  }

  // MEMO: 編集機能からアップされた画像かどうかを区別するため、img_blotとして別途登録
  ImgBlot.blotName = "img_blot";
  ImgBlot.tagName = "img";
  // MEMO:クラス名など、このサイト固有のものとわかる何かをセットしないとコピペの時にすべてのimgがツールバーから貼り付けたものと見なされてしまう。ここ変更かけると既存データの復元ができなくなる可能性があるので注意
  ImgBlot.className = "nodoCollectionImg";
  Quill.register(ImgBlot, true);

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: "#toolbar", // id="toorbar"のHTMLエレメントにツールバーを入れる
        handlers: {
          test: () => {
            // 画像を挿入
            if (quillRef.current && quillRef.current.editor) {
              const range = quillRef.current.editor.getSelection();
              if (range) {
                quillRef.current.editor.insertEmbed(
                  range.index,
                  "image",
                  "https://www.google.co.jp/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
                );
              }
            }
          },
          popup: () => {
            // ポップアップ
            const popup = document.querySelector(".ql-popup-content");
            if (popup) {
              if (popup.classList.contains("hidden")) {
                popup.classList.remove("hidden");
              } else {
                popup.classList.add("hidden");
              }
            }
            // クリック対象以外をクリックしたら、非表示にする
            document.addEventListener("click", (e) => {
              const target = e.target as HTMLElement;
              if (target && !target.closest(".ql-popup")) {
                if (popup) {
                  popup.classList.add("hidden");
                }
              }
            });
          },
        },
      },
      "custom-emoji": true,
    };
  }, []);

  useEffect(() => {
    if (quillRef.current && quillRef.current.editor) {
      quillRef.current.setEditorContents(
        quillRef.current.editor,
        JSON.parse(collectionDetail.body)
      );
      // 編集可能にする
      quillRef.current.editor.enable();
    }
  }, []);

  const handleOnChange = (content: string) => {
    // html to delta
    const delta = quillRef.current?.editor?.clipboard.convert(content);

    // setData データ時に { insert: "\n" } を末尾に追加
    // if (delta && delta.ops) {
    //   const lastData = delta.ops[delta.ops.length - 1] ?? { insert: "" };
    //   if (lastData.insert !== "\n") {
    //     delta.ops.push({ insert: "\n" });
    //   }
    // }

    // TODO: 型エラーが出るので、修正が必要
    setData(delta as any);

    // delta to json
    // const json = quillRef.current?.editor?.clipboard.convert(delta);
    // console.log(json);
  };

  const handleClick = () => {
    alert("ポップアップ");
  };

  return (
    <div>
      <div id="toolbar">
        {/* 見出し を選択 */}
        <select className="ql-header" defaultValue="">
          <option value="1"></option>
          <option value="2"></option>
          <option></option>
        </select>
        <button className="ql-bold">Bold</button>
        <select className="ql-color" defaultValue="">
          <option value="red"></option>
          <option value="green"></option>
          <option value="blue"></option>
          <option value="orange"></option>
          <option value="yellow"></option>
          <option></option>
        </select>
        <select className="ql-background" defaultValue="">
          <option value="red"></option>
          <option value="green"></option>
          <option value="blue"></option>
          <option value="orange"></option>
          <option value="yellow"></option>
          <option></option>
        </select>
        <button className="ql-image" value="idea"></button>
        <button className="ql-emoji">
          <img src={qlEmoji.src} alt="" />
        </button>
        <button className="ql-test">画像挿入</button>
        <button className="ql-popup relative">
          ポップアップ
          <div className="ql-popup-content hidden absolute z-20 top-[100%] left-0 bg-white border border-gray-300 shadow-lg">
            <div className="p-2 w-[200px] h-[200px]" onClick={handleClick}>
              ポップアップ
            </div>
          </div>
        </button>
      </div>
      <ReactQuill
        ref={quillRef}
        modules={modules}
        readOnly={true}
        theme="snow"
        onChange={handleOnChange}
      />
      {/* 整形データ */}
      {/* <div>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div> */}
    </div>
  );
};

export default Component03;
