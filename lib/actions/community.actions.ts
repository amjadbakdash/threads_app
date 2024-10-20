import { UserDataInterface } from "@/modules/user.types"
import Community from "../models/community.model"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"
import { CommunityInterface } from "@/modules/community.types"
import { SortOrder, FilterQuery } from "mongoose"

interface fetchCommunitiesInterface {
    searchString?: string,
    pageNumber?: number,
    pageSize?: number,
    sortBy?: SortOrder
}

export async function createCommunity({ id, name, username, image, bio, createdBy }: CommunityInterface) {
    try {
        connectToDB()

        const user: UserDataInterface | null = await User.findOne({ id: createdBy })
        if (!user) throw new Error("User Not Found")

        const newCommunity = new Community({
            id,
            name,
            username,
            image,
            bio,
            createdBy: user._id
        })

        const createdCommunity: CommunityInterface = await newCommunity.save()

        if (createdCommunity?._id) {
            user.communities.push(createdCommunity._id);
        } else {
            throw new Error("Community creation failed");
        }

        return createdCommunity

    } catch (err: any) {
        throw new Error(err.message)
    }
}

export async function fetchCommunityDetails(id: string) {

    try {
        connectToDB()

        const community = Community.findOne({ id })
            .populate({
                path: "createdBy",
                model: "User",
                select: "name username image _id id"
            })

        return community
    } catch (err: any) {
        throw new Error(err.message)
    }


}

export async function fetchCommunityThreads(id: string) {

    try {
        connectToDB()
        const communityThreads = Community.find({ id })
            .populate({
                path: "threads",
                model: "Thread",
                populate: [
                    {
                        path: "author",
                        model: "User",
                        select: "name image id"
                    },
                    {
                        path: "children",
                        model: "Thread",
                        populate: {
                            path: "author",
                            model: "User",
                            select: "name image id"
                        }
                    }
                ]
            })
        return communityThreads
    } catch (err: any) {
        throw new Error(err.message)
    }
}

export async function fetchCommunities({ searchString = "", pageNumber = 1, pageSize = 20, sortBy = "desc" }: fetchCommunitiesInterface) {

    try {
        connectToDB()

        const skipAmount = (pageNumber - 1) * pageSize

        const regex = new RegExp(searchString, "i")

        const query: FilterQuery<typeof Community> = {}

        if (searchString.trim() !== "") {
            query.$or = [
                { username: { $regex: regex } },
                { name: { $regex: regex } }
            ]
        }

        const sortOptions = { createdAt: sortBy }

        const communityQuery = Community.find(query)
            .skip(skipAmount)
            .limit(pageSize)
            .sort(sortOptions)

        const totalCommunitiesCount = await Community.countDocuments(query)

        const communities: CommunityInterface[] = await communityQuery.exec()

        const isNext = totalCommunitiesCount < skipAmount + communities.length

        return { communities, isNext }

    } catch (err: any) {
        throw new Error(err.message)
    }

}

export async function addMemberToCommunity({ communityId, userId }: { communityId: string, userId: string }) {

    try {
        connectToDB()

        const community: CommunityInterface | null = await Community.findOne({ id: communityId })
        if (!community?._id) throw new Error("Community Not Found ")


        const user: UserDataInterface | null = await User.findOne({ id: userId })
        if (!user?._id) throw new Error("User Not Found")

        if (community.members.includes(user?._id)) throw new Error("User is Already in the Community")

        community.members.push(user._id)
        await community.save()

        user.communities.push(community._id)
        await user.save()

        return community

    } catch (err: any) {
        throw new Error(err.message)
    }
}

export async function removeMemberFromCommunity({ communityId, userId }: { communityId: string, userId: string }) {

    try {
        connectToDB()

        const community: { _id: string, members: string[] } | null = await Community.findOne({ id: communityId }, { _id: 1, members: 1 })
        if (!community?._id) throw new Error("Community Not Found")

        const user = await User.findOne({ id: userId }, { _id: 1 })
        if (!user._id) throw new Error("User Not Found")

        if (community?.members.includes(user._id)) {
            await Community.updateOne({ _id: community._id }, { $pull: { members: user._id } })
            await User.updateOne({ _id: user._id }, { $pull: { communities: community._id } })
            return { success: true }
        } else {
            return { success: false }
        }


    } catch (err: any) {
        throw new Error(err.message)
    }
}

export async function updateCommunityInfo(communityId: string, name: string, username: string, image: string) {

    try {
        connectToDB()

        const updatedCommunity = await Community.findOneAndUpdate(
            { id: communityId },
            { name, username, image }
        )

        if (!updatedCommunity) throw new Error("Community Not Found")

        return updatedCommunity
    } catch (err: any) {
        throw new Error(err.message)
    }
}