<template>
  <div v-bind="setId" class="editor" v-if="editor">
    <menu-bar class="editor__header" :editor="editor"></menu-bar>
    <editor-content class="editor__content" :editor="editor" />
    <div class="editor__footer">
      <small>{{ wordsCount }} words</small>
    </div>
  </div>
</template>

<script>
import { Editor, EditorContent } from "@tiptap/vue-2";
import { debounce } from "lodash";
import MenuBar from "./MenuBar";

// Starterkit extensions
import Blockquote from "@tiptap/extension-blockquote";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import Document from "@tiptap/extension-document";
import Dropcursor from "@tiptap/extension-dropcursor";
import Gapcursor from "@tiptap/extension-gapcursor";
import HardBreak from "@tiptap/extension-hard-break";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import History from "@tiptap/extension-history";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Italic from "@tiptap/extension-italic";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Strike from "@tiptap/extension-strike";
import Text from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import CharacterCount from "@tiptap/extension-character-count";

// Table extensions
//import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";

// Custom or extended Extensions
import CustomTable from "./extensions/CustomTable";
import CustomImage from "./extensions/CustomImage";
import ExternalVideoExtension from "./extensions/ExternalVideoExtension";
import ExternalIframeExtension from "./extensions/ExternalIframeExtension";
import DivExtension from "./extensions/DivExtension";
import HeadingsId from "./extensions/HeadingsId";
import GlobalClass from "./extensions/GlobalClass";

const CustomBulletList = BulletList.extend({
  addCommands() {
    return {
      ...this.parent?.(),
      toggleBulletClass: (className) => ({ commands }) => {
        return commands.updateAttributes("bulletList", { class: className });
      },
    };
  },
});

const CustomHorizontalRule = HorizontalRule.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
    };
  },
});

const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      colwidth: {
        default: null,
        parseHTML: (element) => {
          const colwidth = element.getAttribute("colwidth");
          const value = colwidth ? [parseInt(colwidth, 10)] : null;
          return value;
        },
        renderHTML: (attributes) => {
          return {
            colwidth: attributes.colwidth,
            style: attributes.colwidth
              ? `width: ${attributes.colwidth}px`
              : null,
          };
        },
      },
    };
  },
});

const CustomTableHeader = TableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      colwidth: {
        default: null,
        parseHTML: (element) => {
          const colwidth = element.getAttribute("colwidth");
          const value = colwidth ? [parseInt(colwidth, 10)] : null;
          return value;
        },
        renderHTML: (attributes) => {
          return {
            colwidth: attributes.colwidth,
            style: attributes.colwidth
              ? `width: ${attributes.colwidth}px`
              : null,
          };
        },
      },
    };
  },
});

const CustomLink = Link.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      rel: {
        default: null,
      },
    };
  },
});

export default {
  components: {
    EditorContent,
    MenuBar,
  },
  props: {
    id: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      editor: null,
      wordsCount: 0,
      scrollY: null,
    };
  },
  computed: {
    setId() {
      if (this.id) {
        return { id: this.id };
      }
      return {};
    },
  },
  methods: {
    getWordsCount() {
      return this.editor.storage.characterCount.words();
    },
  },
  watch: {
    value(value) {
      // HTML
      const isSame = this.editor.getHTML() === value;

      if (isSame) {
        return;
      }

      this.editor.commands.setContent(this.value, false);
    },
  },
  created() {
    window.addEventListener("scroll", () => {
      this.scrollY = window.scrollY;
    });
    window.addEventListener("keydown", this.toggleFullScren);

    this.debounceInput = debounce(() => {
      this.$emit("input", this.editor.getHTML());
    }, 500);
    this.debounceGetWordsCount = debounce(() => {
      this.wordsCount = this.getWordsCount();
    }, 500);
  },
  mounted() {
    this.editor = new Editor({
      extensions: [
        Blockquote,
        Bold,
        CustomBulletList,
        Code,
        CodeBlock,
        Document,
        Dropcursor,
        Gapcursor,
        HardBreak,
        Heading,
        Highlight,
        History,
        CustomHorizontalRule,
        Italic,
        ListItem,
        OrderedList,
        Paragraph,
        Strike,
        Text,
        TextAlign.configure({
          types: ["heading", "paragraph", "image"],
        }),
        CharacterCount,
        CustomTable.configure({
          cellMinWidth: 100,
          resizable: true,
        }),
        TableRow,
        CustomTableHeader,
        CustomTableCell,
        CustomLink.configure({
          HTMLAttributes: {
            target: null,
            rel: null,
          },
          openOnClick: false,
        }),
        CustomImage.configure({
          inline: true,
        }),
        ExternalVideoExtension,
        ExternalIframeExtension,
        DivExtension,
        HeadingsId,
        GlobalClass,
      ],
      content: this.value,
      /*editorProps: {
        attributes: {
          spellcheck: "true",
        },
      },*/
      onUpdate: () => {
        // pushing scrollbar to the bottom, if we are scrolled to the bottom
        const proseMirror = this.$el.getElementsByClassName("ProseMirror");
        const isScrolledToBottom =
          proseMirror[0].scrollHeight - proseMirror[0].clientHeight <
          Math.floor(proseMirror[0].scrollTop) + 41;
        if (isScrolledToBottom) {
          proseMirror[0].scrollTop = proseMirror[0].scrollHeight;
        }
        this.debounceInput();
        this.debounceGetWordsCount();
      },
    });

    this.wordsCount = this.getWordsCount();
  },
  beforeDestroy() {
    this.editor.destroy();
  },
  destroyed() {
    window.removeEventListener("keydown", this.toggleFullScren);
  },
};
</script>

<style lang="scss">
@import "../assets/editor.css";
</style>