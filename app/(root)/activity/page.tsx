import React, { act } from 'react'
import { currentUser } from '@clerk/nextjs/server'
import { fetchUser, getActivity } from '@/lib/actions/user.actions'
import { UserDataInterface } from '@/modules/user.types'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { ThreadsInterface } from '@/modules/Threads.types'
import Link from 'next/link'
import moment from "moment"

type SearchUserDataType = {
    users: UserDataInterface[],
    isNext: boolean
}

const Page = async () => {

    const user = await currentUser()
    if (!user) return null

    const userData: UserDataInterface = await fetchUser(user.id)

    if (!userData?.onboarded) redirect('/onboarding')

    const activities: ThreadsInterface[] | undefined = await getActivity(userData._id || "")
    console.log(activities);

    return (
        <section>
            <h1 className='head-text mb-10'>Activity</h1>
            <section className='mt-10 flex flex-col gap-5'>
                {activities?.length === 0 ? (
                    <p className='text-light-2'>
                        No Activity Yet
                    </p>
                ) : (
                    <>
                        {activities?.map((activity) => (
                            <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                                <article className='activity-card'>
                                    <Image
                                        src={activity.author.image}
                                        alt='Profile Picture'
                                        width={24}
                                        height={24}
                                        className="rounded-full object-cover"
                                    />
                                    <p className='!text-small-regular text-light-1'>
                                        <span className='mr-1 text-primary-500 text-small-semibold'>{activity.author.name}</span>
                                        Replied to your Thread.
                                        <span className='ml-2 text-gray-400'>{activity?.createdAt ? moment(activity.createdAt).startOf('day').fromNow() : ""}</span>
                                    </p>
                                </article>
                            </Link>
                        ))}  
                    </>
                )}
            </section>
        </section>
    )
}

export default Page