"use client";

import ReactQuill from "react-quill";
import React, { useEffect, useRef } from "react";
import "quill-mention";

import "react-quill/dist/quill.snow.css"; // Add css for snow theme
// import '../scss/modules/_editor.scss';

const atValues = [
  { id: 1, value: "Fredrik Sundqvist" },
  { id: 2, value: "Patrik Sjölin" },
];
const hashValues = [
  { id: 3, value: "Fredrik Sundqvist 2" },
  { id: 4, value: "Patrik Sjölin 2" },
];

export default function Component05({
  onChange,
  defaultValue,
  placeholder,
  className,
  theme,
}: {
  onChange: (value: { html: string; delta: any }) => void;
  defaultValue?: string;
  theme: string;
  placeholder?: string;
  className?: string;
}): JSX.Element {
  const editor = useRef<any>();

  const modules = {
    toolbar: [["bold", "italic", "underline"], ["clean"]],
    mention: {
      // メンションで許可される文字の正規表現パターン
      allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      // メンションを示す文字
      mentionDenotationChars: ["@", "#"],
      // メンション候補を提案する関数
      source: function (searchTerm: any, renderList: any, mentionChar: any) {
        let values;

        // メンション文字が@の場合はatValuesを、それ以外の場合はhashValuesを使用
        if (mentionChar === "@") {
          values = atValues;
        } else {
          values = hashValues;
        }

        // 検索語が空の場合は全ての候補を��示
        if (searchTerm.length === 0) {
          renderList(values, searchTerm);
        } else {
          const matches = [];
          // 検索語に一致する候補を抽出
          for (let i = 0; i < values.length; i++)
            if (
              ~values[i].value.toLowerCase().indexOf(searchTerm.toLowerCase())
            )
              matches.push(values[i]);
          renderList(matches, searchTerm);
        }
      },
    },
  };

  return (
    <div className={`w-100 h-full ${className}`}>
      <ReactQuill
        ref={editor as unknown as any}
        theme={theme}
        modules={{ ...modules }}
        placeholder={placeholder}
      />
    </div>
  );
}
