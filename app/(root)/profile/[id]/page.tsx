import React from 'react'
import { currentUser } from '@clerk/nextjs/server'
import { fetchUser } from '@/lib/actions/user.actions'
import { UserDataInterface } from '@/modules/user.types'
import { redirect } from 'next/navigation'
import PostThread from '@/component/forms/PostThread'
import ProfileHeader from '@/component/shared/ProfileHeader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/component/ui/tabs"
import { profileTabs } from '@/constants'
import Image from 'next/image'
import ThreadsTab from '@/component/shared/ThreadsTab'


const Page = async ({ params }: { params: { id: string } }) => {

    const user = await currentUser()
    if (!user) return null

    const userData: UserDataInterface = await fetchUser(params.id)
    if (!userData?.onboarded) redirect('/onboarding')

    return (
        <section>
            <ProfileHeader
                accountId={userData.id}
                currentUserId={user.id}
                name={userData.name}
                username={userData.name}
                imgUrl={userData.image}
                bio={userData.bio}
            />

            <div className='mt-9'>
                <Tabs defaultValue="threads" className='w-full' >
                    <TabsList className='tab'>
                        {profileTabs.map((tab) => (
                            <TabsTrigger key={tab.label} value={tab.value} className='tab'>
                                <Image
                                    src={tab.icon}
                                    alt={tab.label}
                                    width={24}
                                    height={24}
                                    className='object-contain'
                                />
                                <p className='max-sm:hidden'>{tab.label}</p>
                                {tab.label === "Threads" && (
                                    <p className='ml-1 rounded-md bg-light-3 px-2  '>
                                        {userData?.threads?.length}
                                    </p>
                                )}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {profileTabs.map((tab) => (
                        <TabsContent
                            key={`content-${tab.label}`}
                            value={tab.value}
                            className='w-full text-light-1'
                        >
                            <ThreadsTab
                                currentUserId={user.id}
                                accountId={userData.id}
                                accountType="User"
                            />
                        </TabsContent>

                    ))}
                </Tabs>
            </div>

        </section >
    )
}

export default Page