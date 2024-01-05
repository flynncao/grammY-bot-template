import type { Context, SessionFlavor } from 'grammy'
import type { Post } from './blog.js'

export interface mySession {
  total?: number | undefined
  dbpost?: Post | undefined
}
export type MyContext = Context & SessionFlavor<mySession>
