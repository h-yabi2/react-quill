"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import "@/utils/quill/emoji/custom-emoji";
import "./Component07.modules.scss";

// ReactQuill の icon をインポート
import qlBold from "@/public/img/ql-bold.svg";
import qlEmoji from "@/public/img/ql-emoji.svg";

// 絵文字
// import data from "@emoji-mart/data";
// import data from "@emoji-mart/data/sets/13.1/native.json";
// twitter の絵文字
import data from "@emoji-mart/data/sets/14/twitter.json";
import Picker from "@emoji-mart/react";
import i18n from "@emoji-mart/data/i18n/ja.json";

// delta/collectionDetail.ts から取得したデータ
import { collectionDetail } from "@/delta/collectionDetail";

const Component03: React.FC = () => {
  const quillRef = useRef<ReactQuill>(null);
  const [quillData, setData] = useState(collectionDetail.body);

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
          popup: () => {},
          emoji: () => {},
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

  // 見出しの矢印を非表示
  useEffect(() => {
    const header = document.querySelector(".ql-size");
    if (header) {
      const svg = header.querySelector("svg");
      if (svg) {
        svg.style.display = "none";
      }
    }
  }, []);

  const handlePopup = (e: React.MouseEvent<HTMLImageElement>) => {
    const popup = (e.target as Element)?.closest(".ql-popup");
    if (!popup) return;
    const popupInner = popup.querySelector(".ql-popup-inner");
    if (!popupInner) return;
    const isActive = popupInner.classList.contains("active");

    // すべての .ql-popup-inner の active クラスを削除
    document.querySelectorAll(".ql-popup-inner").forEach((inner) => {
      inner.classList.remove("active");
    });

    // クリックされたボタンの .ql-popup-inner に active クラスをトグル
    if (!isActive) {
      popupInner.classList.add("active");
    }

    // クリック対象以外をクリックしたら .ql-popup-inner の active クラスを削除
    const handleClickOutside = (event: MouseEvent) => {
      if (!popup.contains(event.target as Node)) {
        popupInner.classList.remove("active");
        document.removeEventListener("click", handleClickOutside);
      }
    };

    document.addEventListener("click", handleClickOutside);
  };

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

  return (
    <div>
      <div
        id="toolbar"
        className="fixed bottom-[100px] left-0 w-full bg-white z-20"
      >
        <div className="emoji-picker">
          <Picker
            data={data}
            onEmojiSelect={console.log}
            i18n={i18n}
            set="twitter"
          />
        </div>

        <span className="ql-formats ql-popup relative">
          <img src={qlBold.src} alt="" onClick={handlePopup} />
          <div className="ql-popup-inner absolute z-10 top-[100%] bg-white border border-gray-300 hidden">
            <button className="ql-bold">Bold</button>
            <button className="ql-italic">Italic</button>
            <button className="ql-underline">Underline</button>
          </div>
        </span>

        <span className="ql-formats">
          <button className="ql-emoji">
            <img src={qlEmoji.src} alt="" />
          </button>
        </span>
      </div>

      <ReactQuill
        ref={quillRef}
        modules={modules}
        readOnly={true}
        theme="snow"
        onChange={handleOnChange}
        scrollingContainer="html"
      />
      {/* 整形データ */}
      <div>
        <pre>{JSON.stringify(quillData, null, 2)}</pre>
      </div>
    </div>
  );
};

export default Component03;
