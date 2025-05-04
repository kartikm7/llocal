import { clsx, ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Adds a new line before the ending </customtag>
 * */
export function formatCustomBlock(message: string, tagName: string): string {
  const tag = `</${tagName}>`
  let response = ""
  if (!message.includes(tag)) response = message
  else {
    const position = message.indexOf(tag)
    response = message.slice(0, position) + "\n" + message.slice(position)
  }
  return response
}

/**
 * Checks whether or not both opening and closing tags exist.
 * Inherently the above two checks result in understanding whether the tag exists/is complete.
 * */
export function customTagValidator(message: string, tagName: string): boolean {
  let validator = false // validating flag initialized as false
  const tag = [`<${tagName}>`, `</${tagName}>`] // defining the opening and closing tag
  for (const type of tag) {
    validator = message.includes(type)
  }
  return validator
}

/**
 * A wrapper function over window.api.translate(key:string, options) => string;
 * just to reduce the overhead
 * */
export function t(key: string, options = {}): string {
  return window.api.translate(key, options)
}
