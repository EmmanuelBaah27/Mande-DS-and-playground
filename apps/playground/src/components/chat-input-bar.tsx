"use client"

import { useRef, useState } from "react"
import { ChatInput, Icon } from "@mande/ui"
import { AttachmentPreview } from "./shared/attachment-preview"

export function ChatInputBar({
  placeholder,
  onSend,
}: {
  placeholder: string
  onSend: (text: string) => void
}) {
  const [value, setValue] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    if (!value.trim() && attachments.length === 0) return
    onSend(value.trim())
    setValue("")
    setAttachments([])
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    setAttachments((prev) => [...prev, ...files])
    e.target.value = ""
  }

  return (
    <div className="px-4 pb-4 bg-subtle shrink-0">
      <div className="max-w-3xl mx-auto">
        <ChatInput
          value={value}
          onChange={setValue}
          onSend={handleSend}
          placeholder={placeholder}
          sendDisabled={!value.trim() && attachments.length === 0}
          hint="Mande is AI and can make mistakes. Please double-check responses."
          topSlot={
            attachments.length > 0
              ? attachments.map((file, i) => (
                  <AttachmentPreview
                    key={i}
                    file={file}
                    onDismiss={() => setAttachments((prev) => prev.filter((_, j) => j !== i))}
                  />
                ))
              : undefined
          }
          actionsSlot={
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="size-5 flex items-center justify-center text-tertiary hover:text-muted-foreground hover:bg-muted rounded-1 transition-colors"
            >
              <Icon name="IconPaperclip2" size={16} />
            </button>
          }
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  )
}
