import { Node, mergeAttributes } from "@tiptap/core";

const Div = Node.create({
  name: "div",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  content: "block*",
  group: "block",
  defining: true,
  parseHTML() {
    return [{ tag: "div" }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0
    ];
  },
  addCommands() {
    return {
      setDiv: (attributes) => ({ commands }) => {
        return commands.wrapIn("div", attributes);
      },
      toggleDiv: (attributes) => ({ commands }) => {
        return commands.toggleWrap("div", attributes);
      },
      unsetDiv: (attributes) => ({ commands }) => {
        return commands.lift("div");
      }
    };
  },
  onUpdate() {
    const classes = [
      "table-responsive",
      "aspect-w-16 aspect-h-9",
      "resp-container"
    ];
    const transaction = this.editor.state.tr;
    let needsToWrapTables = false;

    this.editor.state.doc.descendants((node, pos) => {
      if (node.type.name === "div" && node.firstChild !== null) {
        if (node.firstChild.type.name !== "table") return;
        if (node.attrs.class == null) {
          needsToWrapTables = true;
          transaction.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            class: "table-responsive"
          });
          return true;
        }
      }
      return false;
    });

    if (needsToWrapTables) {
      transaction.setMeta("preventUpdate", true);
      this.editor.view.dispatch(transaction);
      transaction.setMeta("preventUpdate", false);
    }

    this.editor.state.doc.descendants((node, pos) => {
      if (node.type.name === "div" && classes.includes(node.attrs.class)) {
        if (
          node.firstChild !== null &&
          node.content.lastChild.type.name == "paragraph"
        ) {
          transaction.replaceWith(
            pos,
            pos + node.nodeSize,
            node.content.lastChild
          );
          this.editor.view.dispatch(transaction);
          return true;
        }

        if (
          node.firstChild !== null &&
          node.firstChild.type.name == "paragraph"
        ) {
          transaction.replaceWith(pos, pos + node.nodeSize, node.content);
          this.editor.view.dispatch(transaction);
          return true;
        }

        if (node.childCount == 0) {
          transaction.deleteRange(pos, pos + node.nodeSize);
          this.editor.view.dispatch(transaction);
          return true;
        }
        return false;
      }
    });
  }
});

export default Div;
export { Div };
