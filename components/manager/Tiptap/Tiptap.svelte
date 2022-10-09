<script>
    import { onMount, onDestroy, createEventDispatcher } from "svelte";
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



    let element;
    // HTML content of editor can be accessed through editor.getHTML()
    let editor;
    let bubbleMenu;
    let dispatch = createEventDispatcher();


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
            dispatch('change', {
                html: editor.getHTML()
            })
        });
    });

    onDestroy(() => {
        editor.destroy();
    });
</script>

<div class="wrapper">
    <FixedMenu editor={editor} />
    <div class="element-view">
        <div class="element-wrapper" bind:this={element} />
    </div>
</div>


<style>
    .wrapper {
        height: 100%;
        width: 100%;
        flex-direction: column;
    }

    .element-view {
        height: 495px;
        width: 100%;
        overflow-y: auto;
    }

    .element-wrapper {
        padding: 1rem;
        flex: 1 1 0%;
        overflow-y: auto;
        padding-top: 10px;
        height: fit-content;
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

    .ProseMirror > h1 {
        font-family: 'goth';
        font-size: 24px;
    }

    .ProseMirror > h2 {
        font-family: 'goth';
        font-size: 22px;
    }

    .ProseMirror > h3 {
        font-family: 'goth';
        font-size: 20px;
    }

    .ProseMirror > p {
        font-size: 19px;
        font-family: 'goth';
    }
</style>
