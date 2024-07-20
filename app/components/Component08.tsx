"use client";

import React, { useMemo, useRef, LegacyRef } from "react";
import dynamic from "next/dynamic";
import type ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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
      class ImgBlot extends BlockEmbed {
        // ここにblotの作成処理を記述
      }
      Quill.register(ImgBlot, true);

      return <RQ ref={forwardedRef} {...props} />;
    }
    return QuillJS;
  },
  {
    ssr: false,
  }
);

const Component08: React.FC = () => {
  const quillRef = useRef<ReactQuill>(null);

  // modules --------------------------------
  const modules = useMemo(() => {
    return {
      toolbar: {
        handlers: {},
      },
    };
  }, []);

  // ReactQuillコンポーネント ----------------
  return (
    <ReactQuillBase
      forwardedRef={quillRef}
      modules={modules}
      placeholder="ここにテキストを入力..."
    />
  );
};
export default Component08;
