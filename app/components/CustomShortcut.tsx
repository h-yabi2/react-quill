"use client";

import React, { useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CustomShortCut = () => {
  const quillRef = useRef<ReactQuill>(null);
  const modules = {
    keyboard: {
      bindings: {
        customHeader1: {
          key: "1",
          shortKey: true,
          handler: function (range: any, context: any) {
            quillRef.current
              ?.getEditor()
              .formatLine(range.index, range.length, "header", 1);
          },
        },
        customHeader2: {
          key: "2",
          shortKey: true,
          handler: function (range: any, context: any) {
            quillRef.current
              ?.getEditor()
              .formatLine(range.index, range.length, "header", 2);
          },
        },
        customHeader3: {
          key: "3",
          shortKey: true,
          handler: function (range: any, context: any) {
            quillRef.current
              ?.getEditor()
              .formatLine(range.index, range.length, "header", 3);
          },
        },
        customText: {
          key: "4",
          shortKey: true,
          handler: function (range: any, context: any) {
            quillRef.current
              ?.getEditor()
              .formatLine(range.index, range.length, "header", false);
          },
        },
        customLink: {
          key: "k",
          shortKey: true,
          handler: function (range: any, context: any) {
            const value = prompt("リンク先URLを入力してください");
            if (value) {
              quillRef.current
                ?.getEditor()
                .formatText(range.index, range.length, "link", value);
            }
          },
        },
      },
    },
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-5">
      <h2 className="text-2xl font-bold mb-4">
        カスタムショートカット付きQuillエディタ
      </h2>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        modules={modules}
        placeholder="ここに入力してください..."
      />
      <div className="mt-4">
        <h3 className="text-lg font-semibold">カスタムショートカット:</h3>
        <ul className="list-disc list-inside">
          <li>Ctrl+1: 見出し1</li>
          <li>Ctrl+2: 見出し2</li>
          <li>Ctrl+3: 見出し3</li>
          <li>Ctrl+4: 通常テキスト</li>
          <li>Ctrl+k: リンク</li>
        </ul>
        <p className="mt-3">※ Macの場合は、Ctrlの代わりにCmdキーを使用</p>
      </div>
    </div>
  );
};

export default CustomShortCut;
