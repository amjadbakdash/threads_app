"use client"
import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

interface UserCardInterface {
    id: string,
    name: string,
    username: string,
    imageUrl: string,
    bio: string,
    personType: string
}


const UserCard = ({ id, name, username, imageUrl, bio, personType }: UserCardInterface) => {
    const rout = useRouter()
    return (
        <article className='user-card'>
            <div className='user-card_avatar'>
                <Image
                    src={imageUrl}
                    alt='Logo'
                    width={48}
                    height={48}
                    className='rounded-full object-contain'
                />
                <div className='flex-1 text-ellipsis'>
                    <h1 className='text-base-semibold text-light-1'>{name}</h1>
                    <p className='text-small-medium text-gray-1'>@{username}</p>
                </div>
            </div>

            <Button
                className='user-card_btn'
                onClick={() => rout.push(`/profile/${id}`)}
            >
                View
            </Button>
        </article>
    )
}

export default UserCard