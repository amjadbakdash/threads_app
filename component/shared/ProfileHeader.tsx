import Image from 'next/image'
import React from 'react'

interface ProfileHeaderInterface {
    accountId: string,
    currentUserId: string,
    name: string,
    username: string,
    imgUrl: string,
    bio: string
}


const ProfileHeader = ({ accountId, currentUserId, name, username, imgUrl, bio }: ProfileHeaderInterface) => {
    return (
        <div className='flex flex-col justify-start'>
            <div className='flex justify-between items-center'>
                <div className='flex gap-3 w-1/2 h-full relative'>
                    <div>
                        <Image
                            src={imgUrl}
                            alt='Profile Image'
                            width={60}
                            height={60}
                            className='rounded-full object-cover shadow-2xl'
                        />
                    </div>
                    <div className='flex-1'>
                        <h2 className='text-left text-heading3-bold text-light-1'>{name}</h2>
                        <p className='text-base-medium text-gray-1'>@{username}</p>
                    </div>
                </div>
            </div>
            <div className='mt-6 max-w-lg text-base-regular text-light-2'>
                {bio}
            </div>
            <div className=' mt-12 h-0.5 bg-dark-3 w-full' />
        </div>
    )
}

export default ProfileHeader