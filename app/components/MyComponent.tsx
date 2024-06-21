"use client";

import React, { useState, useMemo, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const MyComponent: React.FC = () => {
  const [selectedText, setSelectedText] = useState<string>("");
  const quillRef = useRef<ReactQuill | null>(null);
  // modules --------------------------------
  // MEMO:useMemoで制御しないと、エディターが表示されなくなります
  const modules = useMemo(() => {
    return {
      toolbar: {
        container: "#toolbar", // id="toorbar"のHTMLエレメントにツールバーを入れる
        handlers: {
          // ここに、オリジナルの機能で使う処理を追加します。
          test: (): void => {
            // ReactQuillコンポーネントのrefからquillの中身を抽出
            const quill = quillRef.current?.editor;
            if (quill !== undefined && quill !== undefined && quill !== null) {
              // 現在選択されているテキストの範囲
              const selection = quill?.getSelection(true);
              // 現在選択されているテキストを取得
              const text = quill.getText(selection.index, selection.length);
              // selectedText に値をセット
              setSelectedText(text);
            }
          },
          delete: (): void => {
            // ReactQuillコンポーネントのrefからquillの中身を抽出
            const quill = quillRef.current?.editor;
            if (quill !== undefined && quill !== undefined && quill !== null) {
              // 現在選択されているテキストの範囲
              const selection = quill?.getSelection(true);
              // 現在選択されているテキストを削除
              quill.deleteText(selection.index, selection.length);
            }
          },
        },
      },
    };
  }, []);

  // ReactQuillコンポーネント ----------------
  return (
    <>
      <div id="toolbar">
        <button type="button" className="ql-bold">
          Bold
        </button>
        <button type="button" className="ql-italic">
          Italic
        </button>
        <button type="button" className="ql-underline">
          Underline
        </button>
        <span className="ql-format-group">
          <select className="ql-align" defaultValue="">
            <option value=""></option>
            <option value="center"></option>
            <option value="right"></option>
            <option value="justify"></option>
          </select>
          <select className="ql-header" defaultValue="">
            <option value="1">見出し（大）</option>
            <option value="2">見出し（中）</option>
            <option value="3">見出し（小）</option>
          </select>
        </span>
        <button className="ql-test cursor-pointer">選択</button>
        <button className="ql-delete cursor-pointer">削除</button>
      </div>
      <ReactQuill ref={quillRef} modules={modules} />
      <div>{selectedText}</div>
    </>
  );
};
export default MyComponent;
