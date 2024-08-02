"use client";

import React, { useMemo, useRef, useEffect, useState, LegacyRef } from "react";
import dynamic from "next/dynamic";
import type ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
// Removed import for custom-emoji.js
import "./Component07.modules.scss";

// ReactQuill の icon をインポート
import qlBold from "@/public/img/ql-bold.svg";
import qlEmoji from "@/public/img/ql-emoji.svg";

// 絵文字
import data from "@emoji-mart/data/sets/14/google.json";
import Picker from "@emoji-mart/react";
import i18n from "@emoji-mart/data/i18n/ja.json";

// 型定義
interface EmojiSkin {
  unified: string;
  native: string;
  x: number;
  y: number;
}

interface Emoji {
  id: string;
  name: string;
  keywords: string[];
  skins: EmojiSkin[];
  version: number;
}

interface EmojiData {
  emojis: { [key: string]: Emoji };
}

const emojiData: EmojiData = data as EmojiData;

// delta/collectionDetail.ts から取得したデータ
import { collectionDetail } from "@/delta/collectionDetail";

interface IWrappedComponent extends React.ComponentProps<typeof ReactQuill> {
  forwardedRef: LegacyRef<ReactQuill>;
}

const ReactQuillBase = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");

    function QuillJS({ forwardedRef, ...props }: IWrappedComponent) {
      const Quill = RQ.Quill;
      // ここで Quill のカスタムモジュールを定義
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

      // 絵文字
      class EmojiBlot extends BlockEmbed {
        static create(value: any) {
          const node = super.create();
          node.setAttribute("data-id", value.id);
          node.setAttribute("data-is-original", value.isOriginal);
          node.setAttribute("data-native", value.native); // Store the native emoji
          // 絵文字データを取得
          const emoji = emojiData.emojis[value.id];
          const nativeEmoji = emoji ? emoji.skins[0].native : value.id;

          node.setAttribute("data-native", nativeEmoji); // Store the native emoji
          node.innerText = nativeEmoji; // Display the native emoji
          return node;
        }

        static value(node: any) {
          return {
            id: node.getAttribute("data-id"),
            isOriginal: node.getAttribute("data-is-original") === "true",
            native: node.getAttribute("data-native"), // Retrieve the native emoji
          };
        }
      }

      EmojiBlot.blotName = "emoji";
      EmojiBlot.tagName = "span";
      EmojiBlot.className = "custom-emoji";
      Quill.register(EmojiBlot);

      return <RQ ref={forwardedRef} {...props} />;
    }
    return QuillJS;
  },
  {
    ssr: false,
  }
);

const Component07: React.FC = () => {
  const quillRef = useRef<ReactQuill>(null);
  const [quillData, setData] = useState(collectionDetail.body);

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: "#toolbar", // id="toorbar"のHTMLエレメントにツールバーを入れる
        handlers: {
          popup: () => {},
          emoji: () => {},
        },
      },
      // "custom-emoji": true,
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (quillRef.current && quillRef.current.editor) {
        quillRef.current.setEditorContents(
          quillRef.current.editor,
          JSON.parse(collectionDetail.body)
        );
        // 編集可能にする
        quillRef.current.editor.enable();
        clearInterval(interval);
      }
    }, 100); // 100msごとにチェック

    return () => clearInterval(interval); // クリーンアップ
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

  const handleEmojiSelect = (emoji: any) => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection();
      quill.insertEmbed(range?.index ?? 0, "emoji", {
        id: emoji.id,
        isOriginal: true,
        // native: emoji.native,
      });
    }
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
            onEmojiSelect={handleEmojiSelect}
            i18n={i18n}
            set="google"
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

      <ReactQuillBase
        forwardedRef={quillRef}
        modules={modules}
        readOnly={true}
        theme="snow"
        onChange={handleOnChange}
        scrollingContainer="html"
      />
      {/* 整形データ */}
      {/* <div>
        <pre>{JSON.stringify(quillData, null, 2)}</pre>
      </div> */}
    </div>
  );
};

export default Component07;
