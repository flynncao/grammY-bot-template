import { Schema, model } from 'mongoose'

export interface IPost {
  id: number
  title: string
  content: string
  author: string
  created_at: Date | null
  updated_at: Date | null
}

const postSchema = new Schema<IPost>({
  id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
    default: '',
  },
  author: {
    type: String,
    required: true,
    default: '',
  },
  created_at: {
    type: Date,
    required: true,
    default: new Date(),
  },
  updated_at: {
    type: Date,
    required: false,
    default: null,
  },
})

const User = model<IPost>('Post', postSchema)

export function findOrCreateUser(id: number) {
  console.log('User :>> ', User.base)
  return User.findOneAndUpdate(
    // filter
    { id },
    // update
    {},
    // config
    {
      upsert: true,
      new: true,
    },
  )
}
export function editPost(id: number, content: string, updated_at: Date) {
  return User.findOneAndUpdate(
    { id },
    { content, updated_at },
    {
      upsert: true,
      new: true,
    },
  )
}