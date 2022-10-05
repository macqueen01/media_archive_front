import { Node, mergeAttributes, nodeInputRule } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-2";
import CustomExternalIframeComponent from "../components/CustomExternalIframeComponent";

const Iframe = Node.create({
  name: "external-iframe",
  addOptions() {
    return {
      inline: false,
      HTMLAttributes: {
        "data-type": "external-iframe"
      }
    };
  },
  inline() {
    return this.options.inline;
  },
  group() {
    return this.options.inline ? "inline" : "block";
  },
  addAttributes() {
    return {
      src: {
        default: null
      },
      width: {
        default: null
      },
      height: {
        default: null
      },
      onload: {
        default: null
      },
      scrolling: {
        default: null
      },
      style: {
        default: null
      },
      frameborder: {
        default: null
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: 'iframe[data-type="external-iframe"]'
      }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    //return ['div', {class: 'resp-container'}, ['iframe', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]]
    return [
      "iframe",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)
    ];
  },
  addNodeView() {
    return VueNodeViewRenderer(CustomExternalIframeComponent);
  },
  addCommands() {
    return {
      setExternalIframe: (string) => ({ tr, dispatch, editor, commands }) => {
        let doc = new DOMParser().parseFromString(string, "text/html");
        let iframe = doc.querySelector("iframe");

        // only if we found an iframe with attributes, we add it to the editor
        if (iframe && iframe.hasAttributes()) {
          let attrs = iframe.attributes;
          let attributes = {};
          for (let i = attrs.length - 1; i >= 0; i--) {
            attributes[attrs[i].name] = attrs[i].value;
          }

          const node = editor.schema.nodeFromJSON({
            type: "div",
            attrs: { class: "resp-container" },
            content: [
              {
                type: this.name,
                attrs: attributes
              }
            ]
          });

          if (dispatch) {
            tr.replaceSelectionWith(node).scrollIntoView();
          }
          return true;
          /*return commands.insertContent([
                  {
                    type: 'div',
                    attrs: { class: 'resp-container' },
                    content: [{
                      type: this.name,
                      attrs: attributes
                    }]
                  }
                ]);*/
        }
      }
    };
  }
  /*onUpdate() {
      const transaction = this.editor.state.tr

      this.editor.state.doc.descendants((node, pos) => {
        if (node.type.name === 'div' && node.attrs.class == 'resp-container') {

          if (node.firstChild !== null && node.firstChild.type.name == 'paragraph') {
            transaction.replaceWith(pos, pos + node.nodeSize, node.content)
            this.editor.view.dispatch(transaction)
            return true
          }

          if (node.childCount == 0) {
            transaction.deleteRange(pos - 1, pos + 1)
            this.editor.view.dispatch(transaction)
            return true
          }

          return false
        }
      })
    }*/
});

export default Iframe;
export { Iframe };
//# sourceMappingURL=tiptap-extension-image.esm.js.map
