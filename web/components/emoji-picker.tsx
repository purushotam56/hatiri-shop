'use client'

import { useState } from 'react'
import { Button } from '@heroui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@heroui/popover'

interface EmojiPickerProps {
  value: string
  onChange: (emoji: string) => void
  label?: string
}

const POPULAR_EMOJIS = [
  '📦', '📱', '👕', '👟', '🍔', '🍕', '🍎', '🥗',
  '🏠', '🛋️', '🪑', '🛏️', '📚', '✏️', '📝', '🎮',
  '⚽', '🏀', '🎾', '🏋️', '💻', '⌚', '👜', '👔',
  '🌟', '❤️', '💎', '🔥', '✨', '🎁', '🎉', '🎊',
  '📸', '🎬', '🎵', '🎤', '🎸', '🍰', '☕', '🌺',
]

export function EmojiPicker({ value, onChange, label = 'Select Emoji' }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="bordered"
          className="w-full justify-start text-lg h-14"
        >
          <span className="text-2xl">{value}</span>
          <span className="flex-1 text-left ml-2 text-gray-600">{label}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="px-4 py-3">
          <p className="text-sm font-semibold mb-3 text-gray-700">Popular Emojis</p>
          <div className="grid grid-cols-8 gap-2">
            {POPULAR_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  onChange(emoji)
                  setIsOpen(false)
                }}
                className={`w-10 h-10 text-xl flex items-center justify-center rounded-lg transition-all ${
                  value === emoji
                    ? 'bg-primary text-white scale-110'
                    : 'hover:bg-gray-100 active:scale-95'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
          <div className="mt-4 border-t pt-3">
            <p className="text-xs text-gray-600 mb-2">Or type any emoji:</p>
            <input
              type="text"
              maxLength={2}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Paste emoji here"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg text-center"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
