import { fetchUserPost } from '@/lib/actions/user.actions'
import { UserDataInterface } from '@/modules/user.types'
import { redirect } from 'next/navigation'
import React from 'react'
import ThreadCard from '../cards/ThreadCard'

interface ThreadsTabInterface {
    currentUserId: string,
    accountId: string,
    accountType: string
}

const ThreadsTab = async ({ currentUserId, accountId, accountType }: ThreadsTabInterface) => {
    let data = await fetchUserPost(accountId)

    console.log(data);

    if (!data) redirect("/")

    return (
        <section className=' mt-10 flex flex-col gap-10'>
            {data.threads.map((thread: any) => (
                <ThreadCard
                    key={thread._id}
                    id={thread.id}
                    currentUserId={currentUserId}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={
                        accountType === "User" ?
                            { name: data.name, image: data.image, id: data.id }
                            :
                            { name: thread.author.name, image: thread.author.image, id: thread.author.id }
                    }
                    community={thread.community}
                    createdAt={thread.createdAt}
                    comments={thread.children}
                />
            ))}
        </section>
    )
}
export default ThreadsTab