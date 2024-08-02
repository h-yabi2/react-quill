"use client";

import React, { useMemo, useRef, LegacyRef } from "react";
import dynamic from "next/dynamic";
import type ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import data from "@emoji-mart/data/sets/14/google.json";
import Picker from "@emoji-mart/react";
import i18n from "@emoji-mart/data/i18n/ja.json";

interface IWrappedComponent extends React.ComponentProps<typeof ReactQuill> {
  forwardedRef: LegacyRef<ReactQuill>;
}

const ReactQuillBase = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");

    function QuillJS({ forwardedRef, ...props }: IWrappedComponent) {
      const Quill = RQ.Quill;

      const BlockEmbed = Quill.import("blots/embed");

      // Define the EmojiBlot
      class EmojiBlot extends BlockEmbed {
        static create(value: any) {
          let node = super.create(value);
          node.setAttribute("data-id", value.id);
          node.innerHTML = value.native;
          return node;
        }

        static value(node: any) {
          return {
            id: node.getAttribute("data-id"),
            native: node.innerHTML,
          };
        }
      }
      EmojiBlot.blotName = "emoji";
      EmojiBlot.tagName = "span";
      Quill.register(EmojiBlot, true);

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

  const handleEmojiSelect = (emoji: any) => {
    console.log(emoji);
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection();
      const cursorPosition = range?.index ?? 0;
      quill.insertEmbed(cursorPosition, "emoji", {
        id: emoji.id,
        isOriginal: true,
        native: emoji.native,
      });
      // カーソルを絵文字の後ろに移動
      quill.setSelection({ index: cursorPosition + 1, length: 0 });
    }
  };

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
    <>
      <ReactQuillBase
        forwardedRef={quillRef}
        modules={modules}
        placeholder="ここにテキストを入力..."
      />
      <Picker
        data={data}
        onEmojiSelect={handleEmojiSelect}
        i18n={i18n}
        set="google"
      />
    </>
  );
};
export default Component08;
