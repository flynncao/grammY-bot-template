import type { Context, SessionFlavor } from 'grammy'
import type {
  Conversation,
  ConversationFlavor,
} from '@grammyjs/conversations'
import type { Post } from './blog.js'

export interface mySession {
  total?: number
  dbpost?: Post
  postID?: number
  myStateIdentifier?: string
}

export type MyContext = Context & SessionFlavor<mySession> & ConversationFlavor

export type MyConversation = Conversation<MyContext>
