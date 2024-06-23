"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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
        // handlers: {
        //   bold: () => {
        //     console.log("bold");
        //   },
        // },
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

  useEffect(() => {
    if (quillRef.current && quillRef.current.editor) {
      const content = quillRef.current.editor.getContents();
      console.log(content);
      const convertedData = { ops: content.ops }; // Convert DeltaStatic to match deltaData structure
      // setData(convertedData);
    }
  }, [quillRef]);

  return (
    <div>
      <div id="toolbar">
        <button className="ql-bold">Bold</button>
      </div>
      <ReactQuill
        ref={quillRef}
        modules={modules}
        readOnly={true}
        theme="snow"
        onChange={(content, delta, source, editor) => {
          console.log(content);
          console.log(delta);
          // console.log(source);
          // console.log(editor);
        }}
      />
      {JSON.stringify(data)}
    </div>
  );
};

export default Component03;
