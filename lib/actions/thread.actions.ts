"use server"
import { revalidatePath } from "next/cache"
import Thread from "../models/thread.model"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"
import { ThreadsInterface } from "@/modules/Threads.types"

interface CreateThreadParams {
    text: string,
    author: string,
    communityId: string | null,
    path: string

}

interface AddCommentInterface {
    threadId: string,
    commentText: string,
    userId: string,
    path: string
}

export async function createThread({ text, author, communityId, path }: CreateThreadParams) {
    await connectToDB()

    // Create Thread 

    const CreatedThread = await Thread.create({
        text,
        author,
        community: null,
    })

    // Update User Threads ...

    await User.findByIdAndUpdate(author, { $push: { threads: CreatedThread._id } })

    revalidatePath(path)

}
export async function fetchThreads(pageNumber = 1, pageSize = 20) {
    connectToDB()

    // Calculate the Number of Post to Skip

    const SkipAmount = (pageNumber - 1) * pageSize

    // Fetching the Posts That have no Parent (Top Level Without Comments)

    const postQuery = Thread.find({ parentId: { $in: [null, undefined] } })
        .sort({ createdAt: "desc" })
        .skip(SkipAmount)
        .limit(pageSize)
        .populate({ path: "author", model: User, select: "-_id" })
        .populate({
            path: "children",
            populate: {
                path: "author",
                model: User,
                select: "_id name parentId image"
            }
        })

    const totalPostsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined] } })

    const Posts: ThreadsInterface[] = await postQuery.exec()

    const isNext = totalPostsCount > SkipAmount + Posts.length

    return { Posts, isNext }
}

export async function fetchThreadById(id: string) {
    connectToDB()

    try {
        const thread = Thread.findById(id)
            .populate({
                path: "author",
                model: "User",
                select: "_id id name image"
            })
            .populate({
                path: "children",
                populate: [
                    {
                        path: "author",
                        model: "User",
                        select: "_id id name parentId image"
                    },
                    {
                        path: "children",
                        model: "Thread",
                        populate: {
                            path: "author",
                            model: "User",
                            select: "_id id name parentId image"
                        }
                    }
                ]
            }).exec()

        return thread

    } catch (err: any) {
        console.log(err.message);
    }
}

export async function addCommentToThread({ threadId, commentText, userId, path }: AddCommentInterface) {

    connectToDB()

    try {
        const originalThread = await Thread.findById(threadId)
        if (!originalThread) throw new Error("Thread Not Found")

        // Create a New Thread (Comment) 
        const commentThread = new Thread({
            text: commentText,
            author: userId,
            parentId: threadId
        })

        const savedCommentThread = await commentThread.save()

        // Update the Original Thread To Include The New Comment

        originalThread.children.push(savedCommentThread._id)
        await originalThread.save()

    } catch (err: any) {
        console.log(err.message);
    }

}