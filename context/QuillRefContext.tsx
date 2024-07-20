"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import ReactQuill from "react-quill";

// Contextの型定義
interface QuillRefContextType {
  ref: ReactQuill | null;
  setQuillRef: (ref: ReactQuill) => void;
}

// Contextの作成
const QuillRefContext = createContext<QuillRefContextType | undefined>(
  undefined
);

// Context Providerの作成
export const QuillRefProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [ref, setRef] = useState<ReactQuill | null>(null);

  const setQuillRef = useCallback((ref: ReactQuill) => {
    setRef(ref);
  }, []);

  return (
    <QuillRefContext.Provider value={{ ref, setQuillRef }}>
      {children}
    </QuillRefContext.Provider>
  );
};

// Contextを利用するためのカスタムフック
export const useQuillRef = (): QuillRefContextType => {
  const context = useContext(QuillRefContext);
  //   console.log("context:", context);
  if (!context) {
    throw new Error("useQuillRef must be used within a QuillRefProvider");
  }
  const quill = context.ref?.editor;
  useEffect(() => {
    if (quill) {
      const selection = quill.getSelection(true);
      const cursorIndex =
        selection !== undefined && selection !== null ? selection.index : 1;
      console.log("cursorIndex:", cursorIndex);

      // Hello World という文字列を挿入
      quill.insertText(cursorIndex, "Hello World");
    }
  }, [quill]);
  return context;
};
