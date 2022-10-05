<script>
    import { onMount, onDestroy } from "svelte";
    import { writable } from "svelte/store";
    import { Editor } from "@tiptap/core";
    import StarterKit from "@tiptap/starter-kit";
    import Document from '@tiptap/extension-document'
    import Paragraph from "@tiptap/extension-paragraph";
    import Text from '@tiptap/extension-text'

    // @todo this throws a 'process is not defined' error in the Svelte REPL.
    // Uncomment the next line to see the REPL issue.
    // import BubbleMenu from '@tiptap/extension-bubble-menu'
    import FixedMenu from "./FixedMenu.svelte";

    export let content = "";

    const contentStore = writable(content);

    let element;
    // HTML content of editor can be accessed through editor.getHTML()
    let editor;
    let bubbleMenu;


    onMount(() => {
        editor = new Editor({
            element,
            extensions: [StarterKit, Document, Paragraph, Text],
            content,
            onTransaction: () => {
                editor = editor;
            },
        });
        editor.on("update", ({ editor }) => {
            console.log("editor html", editor.getHTML());
            contentStore.set(editor.getHTML());
        });
    });

    onDestroy(() => {
        editor.destroy();
    });
</script>

<div class="wrapper">
    <FixedMenu editor={editor} />
    <div class="element-wrapper" bind:this={element} />
</div>


<style>
    .wrapper {
        height: 100%;
        width: 100%;
        flex-direction: column;
    }

    .element-wrapper {
        padding: 1rem;
        flex: 1 1 0%;
        overflow-y: auto;
        padding-top: 10px;
    }

    .element-wrapper :global(p:first-of-type) {
        margin-top: 0;
    }

    .element-wrapper :global(p:last-of-type) {
        margin-bottom: 0;
    }

    .element-wrapper > :global(.ProseMirror) {
        outline: 0;
    }

    .html-output {
        max-height: 200px;
        overflow: hidden;
        overflow-y: auto;
        border: 1px solid #ccc;
    }

    .text-2xl {
        font-size: 1.5rem !important;
        line-height: 2rem !important;
    }
    .text-xl {
        font-size: 1.25rem !important;
        line-height: 1.75rem !important;
    }
    .text-lg {
        font-size: 1.125rem !important;
        line-height: 1.75rem !important;
    }
</style>
