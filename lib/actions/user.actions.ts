"use server"
import { revalidatePath } from "next/cache"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"
import { FilterQuery, SortOrder } from "mongoose"
import Threads from "../models/thread.model"
import { ThreadsInterface } from "@/modules/Threads.types"

interface UpdateUserInterface {
    userId: string,
    username: string,
    name: string,
    bio: string,
    image: string,
    path: string,
}

interface fetchUsersInterface {
    userId: string,
    searchString?: string,
    pageNumber?: number,
    pageSize?: number,
    sortBy?: SortOrder
}

export async function updateUser({ userId, username, name, bio, image, path }: UpdateUserInterface): Promise<void> {

    connectToDB()

    try {
        await User.findOneAndUpdate(
            { id: userId },
            { username: username, name: name, bio: bio, image: image, onboarded: true },
            { upsert: true }
        )

        if (path === "/profile/edit") {
            revalidatePath(path)
        }
    } catch (err: any) {
        console.log(err)
    }

}

export async function fetchUser(userId: string) {
    connectToDB()

    return await User.findOne({ id: userId })
        .catch((err) => console.log(err.message))

}

export async function fetchUserPost(userId: string) {

    connectToDB()

    try {
        const threads = await User.findOne({ id: userId })
            .populate({
                path: "threads",
                model: "Thread",
                populate: {
                    path: "children",
                    model: "Thread",
                    populate: {
                        path: "author",
                        model: "User",
                        select: 'name image id '
                    }
                }
            })

        return threads

    } catch (err: any) {
        console.log(err.message);
    }
}

export async function fetchUsers({ userId, searchString = "", pageNumber = 1, pageSize = 20, sortBy = "desc" }: fetchUsersInterface) {

    try {
        connectToDB()

        const skipAmount = (pageNumber - 1) * pageSize
        const regex = new RegExp(searchString, "i")

        // const query: FilterQuery<typeof User> = {
        //     id: { $ne: userId }
        // }
        const query: FilterQuery<typeof User> = {
            id: { $in: userId }
        }


        if (searchString.trim() !== "") {
            query.$or = [
                { username: { $regex: regex } },
                { name: { $regex: regex } }
            ]
        }

        const sortOptions = { createdAt: sortBy }

        const userQuery = User.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize)

        const totalUsersCount = await User.countDocuments(query)

        const users = await userQuery.exec()

        const isNext = totalUsersCount > skipAmount + User.length

        return { users, isNext }

    } catch (err: any) {
        console.log(err.message);
    }
}


export async function getActivity(userId: string) {

    try {
        connectToDB()

        const userThreads = await Threads.find({ author: userId })

        // Getting the Comments and Add it Into Array

        const childrenThreadIDs = userThreads.reduce((acc, userThread) => {
            return acc.concat(userThread.children)
        }, [])

        const replies = await Threads.find({
            _id: { $in: childrenThreadIDs },
            // author: { $ne: userId }  TODO : (WHEN I ADD USERS)
        }).populate({
            path: "author",
            model: User,
            select: "name image _id"
        })

        return replies

    } catch (err: any) {
        console.log(err.message);
    }
}