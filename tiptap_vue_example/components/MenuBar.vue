<template>
  <div>
    <template v-for="(item, index) in items">
      <div
        class="divider"
        v-if="item.type === 'divider'"
        :key="`divider${index}`"
      />
      <menu-item :editor="editor" v-else :key="index" v-bind="item" />
    </template>
  </div>
</template>

<script>
import Vue from "vue";
import { isEmpty } from "lodash";
import MenuItem from "./MenuItem.vue";
import LinkWindow from "./windows/LinkWindow";
import ImageWindow from "./windows/ImageWindow";
import ExternalVideoWindow from "./windows/ExternalVideoWindow";
import ExternalIframeWindow from "./windows/ExternalIframeWindow";
import SourceWindow from "./windows/SourceWindow";

export default {
  components: {
    MenuItem,
  },
  props: {
    editor: {
      type: Object,
      required: true,
    },
  },
  /*data() {
      return {
        items: [
          {
            icon: 'bold',
            title: 'Bold',
            action: () => this.editor.chain().focus().toggleBold().run(),
            isActive: () => this.editor.isActive('bold'),
          },
          {
            icon: 'italic',
            title: 'Italic',
            action: () => this.editor.chain().focus().toggleItalic().run(),
            isActive: () => this.editor.isActive('italic'),
          },
          {
            icon: 'strikethrough',
            title: 'Strike',
            action: () => this.editor.chain().focus().toggleStrike().run(),
            isActive: () => this.editor.isActive('strike'),
          },
          {
            icon: 'code-view',
            title: 'Code',
            action: () => this.editor.chain().focus().toggleCode().run(),
            isActive: () => this.editor.isActive('code'),
          },
          {
            icon: 'mark-pen-line',
            title: 'Highlight',
            action: () => this.editor.chain().focus().toggleHighlight().run(),
            isActive: () => this.editor.isActive('highlight'),
          },
          {
            type: 'divider',
          },
          {
            icon: 'link',
            title: 'Link',
            action: () => this.openLinkWindow(),
            isActive: () => this.editor.isActive('link'),
          },
          {
            icon: 'image-line',
            title: 'Image',
            action: () => this.openImageWindow(),
            isActive: () => this.editor.isActive('image'),
          },
          {
            icon: 'movie-line',
            title: 'External Video',
            //action: () => this.editor.chain().focus().setExternalVideo({src: 'https://www.youtube.com/embed/iyd8dY8rRtA' }).run(),
            action: () => this.openExternalVideoWindow(),
            isActive: () => this.editor.isActive('external-video'),
          },
          {
            icon: 'window-line',
            title: 'External Iframe',
            //action: () => this.editor.chain().focus().setExternalIframe('<iframe onload="fa_iframeresize.do(this);" src="https://tools.financeads.net/depotrechner.php?tp=dif&wf=38409&ntpl=responsive&country=AT&h=1" scrolling="no" width="650" height="890" style="padding:0px; margin:0px; border-width:0px;" frameborder="0"></iframe>').run(),
            action: () => this.openExternalIframeWindow(),
            isActive: () => this.editor.isActive('external-iframe'),
          },
          {
            type: 'divider',
          },
          {
            icon: 'h-1',
            title: 'Heading 1',
            action: () => this.editor.chain().focus().toggleHeading({ level: 1 }).run(),
            isActive: () => this.editor.isActive('heading', { level: 1 }),
          },
          {
            icon: 'h-2',
            title: 'Heading 2',
            action: () => this.editor.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: () => this.editor.isActive('heading', { level: 2 }),
          },
          {
            icon: 'h-3',
            title: 'Heading 3',
            action: () => this.editor.chain().focus().toggleHeading({ level: 3 }).run(),
            isActive: () => this.editor.isActive('heading', { level: 3 }),
          },
          {
            icon: 'paragraph',
            title: 'Paragraph',
            action: () => this.editor.chain().focus().setParagraph().run(),
            isActive: () => this.editor.isActive('paragraph'),
          },
          {
            icon: 'list-unordered',
            title: 'Bullet List',
            action: () => this.editor.chain().focus().toggleBulletList().run(),
            isActive: () => this.editor.isActive('bulletList'),
          },
          {
            icon: 'list-ordered',
            title: 'Ordered List',
            action: () => this.editor.chain().focus().toggleOrderedList().run(),
            isActive: () => this.editor.isActive('orderedList'),
          },
          {
            icon: 'code-box-line',
            title: 'Code Block',
            action: () => this.editor.chain().focus().toggleCodeBlock().run(),
            isActive: () => this.editor.isActive('codeBlock'),
          },
          {
            type: 'divider',
          },
          {
            icon: 'add-box-line',
            title: 'Success Box',
            action: () => this.editor.chain().focus().toggleDiv({ class: 'alert-success' }).run(),
            isActive: () => this.editor.isActive('box', { class: 'alert-success'}),
          },
          {
            icon: 'checkbox-indeterminate-line',
            title: 'Danger Box',
            action: () => this.editor.chain().focus().toggleDiv({ class: 'alert-danger' }).run(),
            isActive: () => this.editor.isActive('box', { class: 'alert-danger'}),
          },
          {
            icon: 'information-line',
            title: 'Info Box',
            action: () => this.editor.chain().focus().toggleDiv({ class: 'alert-info' }).run(),
            isActive: () => this.editor.isActive('box', { class: 'alert-info'}),
          },
          {
            icon: 'product-hunt-line',
            title: 'Product Box',
            action: () => this.editor.chain().focus().toggleDiv({ class: 'product-info' }).run(),
            isActive: () => this.editor.isActive('box', { class: 'product-info'}),
          },
          {
            icon: 'checkbox-blank-line',
            title: 'Primary Box',
            action: () => this.editor.chain().focus().toggleDiv({ class: 'alert-primary' }).run(),
            isActive: () => this.editor.isActive('box', { class: 'alert-primary'}),
          },
          {
            icon: 'checkbox-multiple-blank-line',
            title: 'Secondary Box',
            action: () => this.editor.chain().focus().toggleDiv({ class: 'alert-secondary' }).run(),
            isActive: () => this.editor.isActive('box', { class: 'alert-secondary'}),
          },
          {
            type: 'divider',
          },
          {
            icon: 'double-quotes-l',
            title: 'Blockquote',
            action: () => this.editor.chain().focus().toggleBlockquote().run(),
            isActive: () => this.editor.isActive('blockquote'),
          },
          {
            icon: 'separator',
            title: 'Horizontal Rule',
            action: () => this.editor.chain().focus().setHorizontalRule().run(),
          },
          {
            type: 'divider',
          },
          {
            icon: 'text-wrap',
            title: 'Hard Break',
            action: () => this.editor.chain().focus().setHardBreak().run(),
          },
          {
            icon: 'format-clear',
            title: 'Clear Format',
            action: () => this.editor.chain()
              .focus()
              .clearNodes()
              .unsetAllMarks()
              .run(),
          },
          {
            type: 'divider',
          },
          {
            icon: 'check-line',
            title: 'Positive List',
            action: () => this.editor.chain().focus().toggleBulletClass('positive-list').run(),
            isActive: () => this.editor.isActive('bulletList', { class: 'positive-list'}),
            can: () => this.editor.isActive('bulletList')
          },
          {
            icon: 'close-line',
            title: 'Negative List',
            action: () => this.editor.chain().focus().toggleBulletClass('negative-list').run(),
            isActive: () => this.editor.isActive('bulletList', { class: 'negative-list'}),
            can: () => this.editor.isActive('bulletList')
          },
          {
            icon: 'checkbox-blank-circle-line',
            title: 'Neutral List',
            action: () => this.editor.chain().focus().toggleBulletClass(null).run(),
            isActive: () => this.editor.isActive('bulletList', { class: null}),
            can: () => this.editor.isActive('bulletList')
          },
          {
            icon: 'file-list-line',
            title: 'Lean Navigation',
            action: () => this.editor.chain().focus().toggleBulletClass('page-lean-navigation').run(),
            isActive: () => this.editor.isActive('bulletList', { class: 'page-lean-navigation'}),
            can: () => this.editor.isActive('bulletList')
          },
          {
            icon: 'file-list-fill',
            title: 'Page Navigation',
            action: () => this.editor.chain().focus().toggleBulletClass('page__navigation').run(),
            isActive: () => this.editor.isActive('bulletList', { class: 'page__navigation'}),
            can: () => this.editor.isActive('bulletList')
          },
          {
            type: 'divider',
          },
          {
            icon: 'table-line',
            title: 'Insert Table',
            action: () => this.editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
          },
          {
            icon: 'delete-bin-line',
            title: 'Delete Table',
            action: () => this.editor.chain().focus().deleteTable().run(),
            can: () => this.editor.can().deleteTable()
          },
          {
            icon: 'insert-column-left',
            title: 'Add Column Before',
            action: () => this.editor.chain().focus().addColumnBefore().run(),
            can: () => this.editor.can().addColumnBefore()
          },
          {
            icon: 'insert-column-right',
            title: 'Add Column After',
            action: () => this.editor.chain().focus().addColumnAfter().run(),
            can: () => this.editor.can().addColumnAfter()
          },
          {
            icon: 'delete-column',
            title: 'Delete Column',
            action: () => this.editor.chain().focus().deleteColumn().run(),
            can: () => this.editor.can().deleteColumn()
          },
          {
            icon: 'insert-row-top',
            title: 'Add Row Before',
            action: () => this.editor.chain().focus().addRowBefore().run(),
            can: () => this.editor.can().addRowBefore()
          },
          {
            icon: 'insert-row-bottom',
            title: 'Add Row After',
            action: () => this.editor.chain().focus().addRowAfter().run(),
            can: () => this.editor.can().addRowAfter()
          },
          {
            icon: 'delete-row',
            title: 'Delete Row',
            action: () => this.editor.chain().focus().deleteRow().run(),
            can: () => this.editor.can().deleteRow()
          },
          {
            icon: 'merge-cells-horizontal',
            title: 'Merge Cells',
            action: () => this.editor.chain().focus().mergeCells().run(),
            can: () => this.editor.can().mergeCells()
          },
          {
            icon: 'split-cells-horizontal',
            title: 'Split Cells',
            action: () => this.editor.chain().focus().splitCell().run(),
            can: () => this.editor.can().splitCell()
          },
          {
            icon: 'arrow-left-right-line',
            title: 'Merge or Split',
            action: () => this.editor.chain().focus().mergeOrSplit().run(),
            can: () => this.editor.can().mergeOrSplit()
          },
          {
            type: 'divider',
          },
          {
            icon: 'arrow-go-back-line',
            title: 'Undo',
            action: () => this.editor.chain().focus().undo().run(),
          },
          {
            icon: 'arrow-go-forward-line',
            title: 'Redo',
            action: () => this.editor.chain().focus().redo().run(),
          },
          {
            type: 'divider',
          },
          {
            icon: 'fullscreen-line',
            title: 'Fullscreen (Ctrl+Shift+F)',
            action: () =>  store.commit('SET_EDITOR_FULL_SCREEN', !this.storeEditor.fullscreen),
          },
          {
            icon: 'code-line',
            title: 'Source',
            action: () => this.openSourceWindow()
          }
        ],
      }
    },*/
  data() {
    return {
      items: [
        {
          icon: "bold",
          title: "Bold",
          action: () => this.editor.chain().focus().toggleBold().run(),
        },
        {
          icon: "italic",
          title: "Italic",
          action: () => this.editor.chain().focus().toggleItalic().run(),
        },
        {
          icon: "strikethrough",
          title: "Strike",
          action: () => this.editor.chain().focus().toggleStrike().run(),
        },
        {
          icon: "align-left",
          title: "Align Left",
          action: () => this.editor.chain().focus().setTextAlign("left").run(),
        },
        {
          icon: "align-center",
          title: "Align Center",
          action: () =>
            this.editor.chain().focus().setTextAlign("center").run(),
        },
        {
          icon: "align-right",
          title: "Align Right",
          action: () => this.editor.chain().focus().setTextAlign("right").run(),
        },
        {
          icon: "align-justify",
          title: "Align Justify",
          action: () =>
            this.editor.chain().focus().setTextAlign("justify").run(),
        },
        {
          icon: "code-view",
          title: "Code",
          action: () => this.editor.chain().focus().toggleCode().run(),
        },
        {
          icon: "mark-pen-line",
          title: "Highlight",
          action: () => this.editor.chain().focus().toggleHighlight().run(),
        },
        {
          type: "divider",
        },
        {
          icon: "link",
          title: "Link",
          action: () => this.openLinkWindow(),
        },
        {
          icon: "image-line",
          title: "Image",
          action: () => this.openImageWindow(),
        },
        {
          icon: "movie-line",
          title: "External Video",
          action: () => this.openExternalVideoWindow(),
        },
        {
          icon: "window-line",
          title: "External Iframe",
          action: () => this.openExternalIframeWindow(),
        },
        {
          type: "divider",
        },
        {
          icon: "h-1",
          title: "Heading 1",
          action: () =>
            this.editor.chain().focus().toggleHeading({ level: 1 }).run(),
        },
        {
          icon: "h-2",
          title: "Heading 2",
          action: () =>
            this.editor.chain().focus().toggleHeading({ level: 2 }).run(),
        },
        {
          icon: "h-3",
          title: "Heading 3",
          action: () =>
            this.editor.chain().focus().toggleHeading({ level: 3 }).run(),
        },
        {
          icon: "h-4",
          title: "Heading 4",
          action: () =>
            this.editor.chain().focus().toggleHeading({ level: 4 }).run(),
        },
        {
          icon: "paragraph",
          title: "Paragraph",
          action: () => this.editor.chain().focus().setParagraph().run(),
        },
        {
          icon: "list-unordered",
          title: "Bullet List",
          action: () => this.editor.chain().focus().toggleBulletList().run(),
        },
        {
          icon: "list-ordered",
          title: "Ordered List",
          action: () => this.editor.chain().focus().toggleOrderedList().run(),
        },
        {
          icon: "code-box-line",
          title: "Code Block",
          action: () => this.editor.chain().focus().toggleCodeBlock().run(),
        },
        {
          type: "divider",
        },
        {
          icon: "number-2",
          title: "Font size H2",
          action: () =>
            this.editor
              .chain()
              .focus()
              .updateAttributes("paragraph", { class: "text-2xl" })
              .run(),
        },
        {
          icon: "number-3",
          title: "Font size H3",
          action: () =>
            this.editor
              .chain()
              .focus()
              .updateAttributes("paragraph", { class: "text-xl" })
              .run(),
        },
        {
          icon: "number-4",
          title: "Font size H4",
          action: () =>
            this.editor
              .chain()
              .focus()
              .updateAttributes("paragraph", { class: "text-lg" })
              .run(),
        },
        {
          icon: "font-size",
          title: "Font size normal",
          action: () =>
            this.editor
              .chain()
              .focus()
              .updateAttributes("paragraph", { class: null })
              .run(),
        },
        {
          type: "divider",
        },
        {
          icon: "add-box-line",
          title: "Success Box",
          action: () =>
            this.editor
              .chain()
              .focus()
              .toggleDiv({ class: "alert-success" })
              .run(),
        },
        {
          icon: "checkbox-indeterminate-line",
          title: "Danger Box",
          action: () =>
            this.editor
              .chain()
              .focus()
              .toggleDiv({ class: "alert-danger" })
              .run(),
        },
        {
          icon: "information-line",
          title: "Info Box",
          action: () =>
            this.editor
              .chain()
              .focus()
              .toggleDiv({ class: "alert-info" })
              .run(),
        },
        {
          icon: "product-hunt-line",
          title: "Product Box",
          action: () =>
            this.editor
              .chain()
              .focus()
              .toggleDiv({ class: "product-info" })
              .run(),
        },
        {
          icon: "checkbox-blank-line",
          title: "Summary Box",
          action: () =>
            this.editor
              .chain()
              .focus()
              .toggleDiv({ class: "summary-box" })
              .run(),
        },
        {
          icon: "checkbox-blank-fill",
          title: "Primary Box",
          action: () =>
            this.editor
              .chain()
              .focus()
              .toggleDiv({ class: "alert-primary" })
              .run(),
        },
        {
          icon: "checkbox-multiple-blank-fill",
          title: "Secondary Box",
          action: () =>
            this.editor
              .chain()
              .focus()
              .toggleDiv({ class: "alert-secondary" })
              .run(),
        },
        {
          icon: "layout-bottom-line",
          title: "Intro Box",
          action: () => {
            this.editor
              .chain()
              .insertContentAt(
                this.editor.view.state.selection.anchor - 1,
                '<div class="intro-box"><div class="intro-box__summary"><p class="text-xl">...</p><ul><li>...</li></ul></div><div class="intro-box__how-to"><p class="text-xl">...</p><ul><li>...</li></ul></div></div>'
              )
              .focus()
              .run();
          },
        },
        {
          type: "divider",
        },
        {
          icon: "double-quotes-l",
          title: "Blockquote",
          action: () => this.editor.chain().focus().toggleBlockquote().run(),
        },
        {
          icon: "separator",
          title: "Horizontal Rule",
          action: () => this.editor.chain().focus().setHorizontalRule().run(),
        },
        {
          type: "divider",
        },
        {
          icon: "text-wrap",
          title: "Hard Break",
          action: () => this.editor.chain().focus().setHardBreak().run(),
        },
        {
          icon: "format-clear",
          title: "Clear Format",
          action: () =>
            this.editor.chain().focus().clearNodes().unsetAllMarks().run(),
        },
        {
          type: "divider",
        },
        {
          icon: "check-line",
          title: "Positive List",
          action: () =>
            this.editor
              .chain()
              .focus()
              .toggleBulletClass("positive-list")
              .run(),
        },
        {
          icon: "close-line",
          title: "Negative List",
          action: () =>
            this.editor
              .chain()
              .focus()
              .toggleBulletClass("negative-list")
              .run(),
        },
        {
          icon: "checkbox-blank-circle-line",
          title: "Neutral List",
          action: () =>
            this.editor.chain().focus().toggleBulletClass(null).run(),
        },
        {
          icon: "file-list-line",
          title: "Lean Navigation",
          action: () =>
            this.editor
              .chain()
              .focus()
              .toggleBulletClass("page-lean-navigation")
              .run(),
        },
        {
          icon: "file-list-fill",
          title: "Page Navigation",
          action: () =>
            this.editor
              .chain()
              .focus()
              .toggleBulletClass("page__navigation")
              .run(),
        },
        {
          type: "divider",
        },
        {
          icon: "table-line",
          title: "Insert Table",
          action: () =>
            this.editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run(),
        },
        {
          icon: "delete-bin-line",
          title: "Delete Table",
          action: () => this.editor.chain().focus().deleteTable().run(),
        },
        {
          icon: "insert-column-left",
          title: "Add Column Before",
          action: () => this.editor.chain().focus().addColumnBefore().run(),
        },
        {
          icon: "insert-column-right",
          title: "Add Column After",
          action: () => this.editor.chain().focus().addColumnAfter().run(),
        },
        {
          icon: "delete-column",
          title: "Delete Column",
          action: () => this.editor.chain().focus().deleteColumn().run(),
        },
        {
          icon: "insert-row-top",
          title: "Add Row Before",
          action: () => this.editor.chain().focus().addRowBefore().run(),
        },
        {
          icon: "insert-row-bottom",
          title: "Add Row After",
          action: () => this.editor.chain().focus().addRowAfter().run(),
        },
        {
          icon: "delete-row",
          title: "Delete Row",
          action: () => this.editor.chain().focus().deleteRow().run(),
        },
        {
          icon: "merge-cells-horizontal",
          title: "Merge Cells",
          action: () => this.editor.chain().focus().mergeCells().run(),
        },
        {
          icon: "split-cells-horizontal",
          title: "Split Cells",
          action: () => this.editor.chain().focus().splitCell().run(),
        },
        {
          icon: "arrow-left-right-line",
          title: "Merge or Split",
          action: () => this.editor.chain().focus().mergeOrSplit().run(),
        },
        {
          type: "divider",
        },
        {
          icon: "arrow-go-back-line",
          title: "Undo",
          action: () => this.editor.chain().focus().undo().run(),
        },
        {
          icon: "arrow-go-forward-line",
          title: "Redo",
          action: () => this.editor.chain().focus().redo().run(),
        },
        {
          type: "divider",
        },
        {
          icon: "code-line",
          title: "Source",
          action: () => this.openSourceWindow(),
        },
      ],
    };
  },
  methods: {
    openLinkWindow() {
      const WindowCtor = Vue.extend(LinkWindow);
      const windowInstance = new WindowCtor({
        propsData: {
          editor: this.editor,
          attributes: isEmpty(this.editor.getAttributes("link"))
            ? null
            : this.editor.getAttributes("link"),
        },
      });
      windowInstance.$mount();
      document.querySelector("body").appendChild(windowInstance.$el);
    },
    openImageWindow() {
      const ImageCtor = Vue.extend(ImageWindow);
      const windowInstance = new ImageCtor({
        propsData: {
          editor: this.editor,
          attributes: isEmpty(this.editor.getAttributes("image"))
            ? null
            : this.editor.getAttributes("image"),
        },
      });
      windowInstance.$mount();
      document.querySelector("body").appendChild(windowInstance.$el);
    },
    openExternalVideoWindow() {
      const ExternalVideoCtor = Vue.extend(ExternalVideoWindow);
      const windowInstance = new ExternalVideoCtor({
        propsData: {
          editor: this.editor,
          attributes: isEmpty(this.editor.getAttributes("external-video"))
            ? null
            : this.editor.getAttributes("external-video"),
        },
      });
      windowInstance.$mount();
      document.querySelector("body").appendChild(windowInstance.$el);
    },
    openExternalIframeWindow() {
      const ExternalIframeCtor = Vue.extend(ExternalIframeWindow);
      const windowInstance = new ExternalIframeCtor({
        propsData: {
          editor: this.editor,
          attributes: isEmpty(this.editor.getAttributes("external-iframe"))
            ? null
            : this.editor.getAttributes("external-iframe"),
        },
      });
      windowInstance.$mount();
      document.querySelector("body").appendChild(windowInstance.$el);
    },
    openSourceWindow() {
      const SourceCtor = Vue.extend(SourceWindow);
      const windowInstance = new SourceCtor({
        propsData: {
          editor: this.editor,
        },
      });
      windowInstance.$mount();
      document.querySelector("body").appendChild(windowInstance.$el);
    },
    /*toggleSpellCheck() {
        const spellcheckState = JSON.parse(window.document.querySelector('.ProseMirror').getAttribute('spellcheck'))

        const newSpellcheckState = `${!spellcheckState}`

        if (!['true', 'false'].includes(newSpellcheckState)) return

        this.editor.setOptions({
          editorProps: {
            attributes: {
              spellcheck: newSpellcheckState
            }
          }
        })

        this.spellcheck = !spellcheckState
      }*/
  },
  mounted() {
    //
  },
};
</script>
