import { Extension } from "@tiptap/core";
import slugify from "slugify";

export default Extension.create({
  name: "headings-id",
  onCreate() {
    // The editor is ready.
  },
  onUpdate() {
    const transaction = this.editor.state.tr;

    this.editor.state.doc.descendants((node, pos) => {
      if (node.type.name === "heading") {
        const id = slugify(node.textContent, {
          replacement: "_",
          remove: undefined,
          lower: true,
          locale: "en"
        });

        if (node.attrs.id !== id) {
          transaction.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            id
          });
        }
      }
    });

    transaction.setMeta("preventUpdate", true);
    this.editor.view.dispatch(transaction);
  },
  onSelectionUpdate({ editor }) {
    // The selection has changed.
  },
  onTransaction({ transaction }) {
    // The editor state has changed.
  },
  onFocus({ event }) {
    // The editor is focused.
  },
  onBlur({ event }) {
    // The editor isn’t focused anymore.
  },
  onDestroy() {
    // The editor is being destroyed.
  },
  addGlobalAttributes() {
    return [
      {
        types: ["heading"],
        attributes: {
          id: {
            default: null
          }
        }
      }
    ];
  }
});
