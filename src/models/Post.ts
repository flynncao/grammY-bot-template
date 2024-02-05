import { getModelForClass, prop } from '@typegoose/typegoose'

export interface IPost {
  id: number
  title: string
  content: string
  author: string
  created_at: Date | null
  updated_at: Date | null
}

export class Post {
  @prop({ required: true, unique: true, index: true })
  public id!: number

  @prop({ required: true })
  public title!: string

  @prop({ required: false, default: '' })
  public content!: string

  @prop({ required: false, default: '' })
  public author!: string

  @prop({ required: false, default: () => new Date() })
  public created_at!: Date

  @prop({ required: false, default: null })
  public updated_at?: Date
}

// const postSchema = new Schema<IPost>({
//   id: {
//     type: Number,
//     required: true,
//   },
//   title: {
//     type: String,
//     required: true,
//   },
//   content: {
//     type: String,
//     required: true,
//     default: '',
//   },
//   author: {
//     type: String,
//     required: true,
//     default: '',
//   },
//   created_at: {
//     type: Date,
//     required: true,
//     default: new Date(),
//   },
//   updated_at: {
//     type: Date,
//     required: false,
//     default: null,
//   },
// })

// const User = model<IPost>('Post', postSchema)

const PostModel = getModelForClass(Post)

// TODO: Use menu to operate database
export function findOrCreateUser(id: number) {
  return PostModel.findOneAndUpdate(
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
export function editPost(id: number, content: string, updated_at?: Date) {
  if (!updated_at)
    updated_at = new Date()
  return PostModel.findOneAndUpdate(
    { id },
    { content, updated_at },
    {
      upsert: true,
      new: true,
    },
  )
}
