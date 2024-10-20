import { UserDataInterface } from '@/modules/user.types'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface threadCardInterface {
    id: string,
    currentUserId: string | undefined,
    parentId: string | null,
    content: string,
    author: any,
    community: {
        id: string,
        name: string,
        image: string
    } | null,
    createdAt: Date,
    comments: {
        author: {
            image: string
        }
    }[],
    isComment?: boolean
}


async function ThreadCard({ id, currentUserId, parentId, content, author, community, createdAt, comments, isComment }: threadCardInterface) {
    return (
        <article className={` w-full flex flex-col rounded-xl  ${isComment ? "px-0 xs:p-7" : "bg-dark-2 p-7"}`}>
            <div className=' w-full flex flex-row gap-5'>
                <div className=' flex flex-col items-center justify-center'>
                    <Link href={`/profile/${author?.id}`} className='relative h-11 w-11'>
                        <Image
                            src={author.image}
                            alt='profile Photo'
                            width={40}
                            height={40}
                            className='rounded-full cursor-pointer'
                        />
                    </Link>
                    <div className='thread-card_bar' />
                </div>
                <div className='flex flex-col '>
                    <div>
                        <Link href={`/profile/${author?.id}`}>
                            <h3 className='text-light-1 text-base-semibold cursor-pointer'>{author.name}</h3>
                        </Link>
                        <p className=' text-small-regular text-light-2 mt-2'>{content}</p>
                    </div>
                    <div className='mt-5 flex flex-col gap-3'>
                        <div className='flex gap-3.5'>
                            <Image
                                src="/assets/heart-gray.svg"
                                alt='Heart'
                                width={22}
                                height={22}
                                className='cursor-pointer object-contain'
                            />
                            <Link href={`/thread/${id}`}>
                                <Image
                                    src="/assets/reply.svg"
                                    alt='Reply'
                                    width={22}
                                    height={22}
                                    className='cursor-pointer object-contain'
                                />
                            </Link>
                            <Image
                                src="/assets/repost.svg"
                                alt='Repost'
                                width={22}
                                height={22}
                                className='cursor-pointer object-contain'
                            />
                            <Image
                                src="/assets/share.svg"
                                alt='Share'
                                width={22}
                                height={22}
                                className='cursor-pointer object-contain'
                            />
                        </div>
                        {isComment && comments.length > 0 && (
                            <Link href={`/thread/${id}`}>
                                <p className='mt-1 text-subtle-medium text-gray-1'>
                                    {comments.length} replies
                                </p>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

        </article>
    )
}

export default ThreadCard