import { Node, mergeAttributes, nodeInputRule } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-2'
import CustomImageComponent from '../components/CustomImageComponent'

const inputRegex = /(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))/;
const Image = Node.create({
    name: 'image',
    addOptions() {
        return {
            inline: false,
            HTMLAttributes: {},
        };
    },
    inline() {
        return this.options.inline;
    },
    group() {
        return this.options.inline ? 'inline' : 'block';
    },
    draggable: true,
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
            alt: {
                default: null
            },
            title: {
                default: null
            },
            class: {
              default: null
            },
            srcset: {
              default: null
            },
            sizes: {
              default: null
            },
            loading: {
              default: null
            }
        };
    },
    parseHTML() {
        return [
            {
                tag: 'img[src]',
            },
        ];
    },
    renderHTML({ HTMLAttributes }) {
        return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
    },
    addNodeView() {
      return VueNodeViewRenderer(CustomImageComponent)
    },
    addCommands() {
        return {
            setImage: options => ({ commands }) => {
                return commands.insertContent({
                    type: this.name,
                    attrs: options,
                });
            },
        };
    },
    addInputRules() {
        return [
            nodeInputRule({
                find: inputRegex,
                type: this.type,
                getAttributes: match => {
                    const [, , alt, src, title] = match;
                    return { src, alt, title };
                },
            }),
        ];
    },
});

export { Image, Image as default, inputRegex };
//# sourceMappingURL=tiptap-extension-image.esm.js.map
