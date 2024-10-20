import React from 'react'
import { currentUser } from '@clerk/nextjs/server'
import { fetchUser } from '@/lib/actions/user.actions'
import { UserDataInterface } from '@/modules/user.types'
import { redirect } from 'next/navigation'
import PostThread from '@/component/forms/PostThread'

async function Page() {

    const user = await currentUser()

    if (!user) return null
    const userData: UserDataInterface = await fetchUser(user.id)
    if (!userData?.onboarded) redirect('/onboarding')

    return (
        <>
            <div className='head-text'>Create Thread</div>
            <PostThread userID={userData._id || ""} />
        </>
    )
}

export default Page