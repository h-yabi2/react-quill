import { Quill } from "react-quill";
import "quill-emoji";
import data from "@emoji-mart/data/sets/14/google.json";
import { init } from "emoji-mart";
import EmojMartOptions from "../consts/picker-options";
import { isEmptyValue } from "@/utils/common";

init({ data });

// quill-emojiをインポートしたときに、強制的に'formats/emoji'でblotが登録されるので、そこから呼び出す
const EmojiFormat = Quill.import("formats/emoji");

export class CustomEmojiBlot extends EmojiFormat {
  static create(value) {
    if (value.isOriginal === undefined || !value.isOriginal) {
      // 旧絵文字(quill-emoji)の場合、そのまま返す
      const node = super.create(value);
      return node;
    }
    const node = super.create();
    node.classList.add("nodo-emoji");
    CustomEmojiBlot.buildSpan(value, node);
    return node;
  }

  static value(node) {
    if (node.classList.contains("nodo-emoji")) {
      // 新しくカスタムした絵文字の場合
      return {
        ...node.dataset,
        isOriginal: true,
      };
    } else {
      // 旧絵文字(quill-emoji)の場合
      return node.dataset.name;
    }
  }

  static buildSpan(value, node) {
    if (!value.id || value.id === "") {
      // idが無い場合、何も入れない
      return;
    }
    node.setAttribute("data-id", value.id);
    if (value.skin !== undefined) {
      node.setAttribute("data-skin", value.skin);
    }
    const emojiComponent = buildEmojiCpmonent(value);
    node.appendChild(emojiComponent);
  }

  static parseUnicode(string) {
    return string.split("-").map((str) => parseInt(str, 16));
  }
}

export const buildEmojiCpmonent = (value) => {
  const emojiComponent = document.createElement("em-emoji");
  emojiComponent.setAttribute("id", value.id);
  if (!isEmptyValue(EmojMartOptions.set)) {
    emojiComponent.setAttribute("set", EmojMartOptions.set);
  }
  if (value.skin !== undefined) {
    emojiComponent.setAttribute("skin", value.skin);
  }
  emojiComponent.setAttribute("size", "100%");
  return emojiComponent;
};

CustomEmojiBlot.blotName = "emoji";
CustomEmojiBlot.className = "ql-emojiblot";
CustomEmojiBlot.tagName = "span";
CustomEmojiBlot.emojiClass = "ap";
CustomEmojiBlot.emojiPrefix = "ap-";
Quill.register("formats/emoji", CustomEmojiBlot);

export default CustomEmojiBlot;
