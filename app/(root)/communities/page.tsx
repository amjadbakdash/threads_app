import { addMemberToCommunity, createCommunity, fetchCommunities, fetchCommunityDetails, removeMemberFromCommunity, updateCommunityInfo } from '@/lib/actions/community.actions'
import { fetchUser } from '@/lib/actions/user.actions'
import { CommunityInterface } from '@/modules/community.types'
import { UserDataInterface } from '@/modules/user.types'
import { currentUser } from '@clerk/nextjs/server'
import React from 'react'

const Page = async () => {

    const user = await currentUser()
    if (!user) return null


    const userData: UserDataInterface = await fetchUser(user.id)
    if (!userData._id) return console.log("No User");

    // const createdCommunity: CommunityInterface = await createCommunity({
    //     id: "89247983264936498",
    //     name: "Next.js Dragons",
    //     username: "@Next.js",
    //     image: userData.image,
    //     bio: "The Search of Incredible in Full Stack",
    //     createdBy: user.id
    // })


    // const communityOwner: CommunityInterface = await fetchCommunityDetails("89247983264936498")

    // const communities = await fetchCommunities({})

    // const removeMember = await removeMemberFromCommunity({ communityId: "89247983264936498", userId: user.id })

    // const addMember = await addMemberToCommunity({ communityId: "89247983264936498", userId: user.id })

    // const updateCommunity: CommunityInterface = await updateCommunityInfo("89247983264936498", "Next.js Dinosaurs", "@Next-MongoDB", userData.image)

    // console.log(updateCommunity);


    // console.log(removeMember);

    // console.log(userData);
    return (
        <div>Page</div>
    )
}

export default Page