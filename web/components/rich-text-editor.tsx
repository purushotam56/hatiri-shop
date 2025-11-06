'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'
import { Button } from '@heroui/button'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  disabled?: boolean
}

export default function RichTextEditor({ content, onChange, placeholder, disabled }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || 'Enter product details...',
      }),
    ],
    content,
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled)
    }
  }, [disabled, editor])

  if (!editor) {
    return null
  }

  return (
    <div className="border border-default-200 rounded-lg overflow-hidden bg-white dark:bg-default-100">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-default-200 bg-default-50">
        <Button
          size="sm"
          variant={editor.isActive('bold') ? 'solid' : 'light'}
          isIconOnly
          onPress={() => editor.chain().focus().toggleBold().run()}
          disabled={disabled}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
          </svg>
        </Button>
        
        <Button
          size="sm"
          variant={editor.isActive('italic') ? 'solid' : 'light'}
          isIconOnly
          onPress={() => editor.chain().focus().toggleItalic().run()}
          disabled={disabled}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 4h4m-4 16h4m-1-16l-2 16" />
          </svg>
        </Button>

        <Button
          size="sm"
          variant={editor.isActive('heading', { level: 2 }) ? 'solid' : 'light'}
          isIconOnly
          onPress={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          disabled={disabled}
        >
          H2
        </Button>

        <Button
          size="sm"
          variant={editor.isActive('heading', { level: 3 }) ? 'solid' : 'light'}
          isIconOnly
          onPress={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          disabled={disabled}
        >
          H3
        </Button>

        <Button
          size="sm"
          variant={editor.isActive('bulletList') ? 'solid' : 'light'}
          isIconOnly
          onPress={() => editor.chain().focus().toggleBulletList().run()}
          disabled={disabled}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Button>

        <Button
          size="sm"
          variant={editor.isActive('orderedList') ? 'solid' : 'light'}
          isIconOnly
          onPress={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={disabled}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </Button>

        <div className="w-px h-6 bg-default-200 mx-1" />

        <Button
          size="sm"
          variant="light"
          isIconOnly
          onPress={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo() || disabled}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </Button>

        <Button
          size="sm"
          variant="light"
          isIconOnly
          onPress={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo() || disabled}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
          </svg>
        </Button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} className="prose prose-sm max-w-none p-4 min-h-[200px] focus:outline-none dark:prose-invert" />
    </div>
  )
}
