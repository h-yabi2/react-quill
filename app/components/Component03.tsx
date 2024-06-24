"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// ReactQuill の icon をインポート
const icons = ReactQuill.Quill.import("ui/icons");
import qlColor from "@/public/img/ql-color.svg";
icons["color"] = '<img src="' + qlColor.src + '" alt="" />';

const deltaData = {
  ops: [
    { insert: "Hello " },
    { insert: "World!", attributes: { bold: true } },
    { insert: "\n" },
  ],
};

const Component03: React.FC = () => {
  const quillRef = useRef<ReactQuill>(null);
  const [data, setData] = useState(deltaData);

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: "#toolbar", // id="toorbar"のHTMLエレメントにツールバーを入れる
        handlers: {
          // bold: () => {
          //   if (quillRef.current && quillRef.current.editor) {
          //     const range = quillRef.current.editor.getSelection();
          //     console.log(range);
          //     if (range) {
          //       quillRef.current.editor.format("bold", true);
          //     }
          //   }
          // },
        },
      },
    };
  }, []);

  useEffect(() => {
    if (quillRef.current && quillRef.current.editor) {
      quillRef.current.setEditorContents(
        quillRef.current.editor,
        JSON.parse(JSON.stringify(deltaData))
      );
      quillRef.current.editor.enable();
    }
  }, []);

  const handleOnChange = (content: string) => {
    console.log(content);
    // html to delta
    const delta = quillRef.current?.editor?.clipboard.convert(content);
    console.log(delta);

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
      </div>
      <ReactQuill
        ref={quillRef}
        modules={modules}
        readOnly={true}
        theme="snow"
        onChange={handleOnChange}
      />
      {/* 整形データ */}
      <div>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
};

export default Component03;
