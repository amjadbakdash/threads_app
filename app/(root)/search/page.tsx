import React from 'react'
import { currentUser } from '@clerk/nextjs/server'
import { fetchUser, fetchUsers } from '@/lib/actions/user.actions'
import { UserDataInterface } from '@/modules/user.types'
import { redirect } from 'next/navigation'
import UserCard from '@/component/cards/UserCard'

type SearchUserDataType = {
    users: UserDataInterface[],
    isNext: boolean
}

const Page = async () => {

    const user = await currentUser()
    if (!user) return null

    const userData: UserDataInterface = await fetchUser(user.id)
    if (!userData?.onboarded) redirect('/onboarding')

    const result: SearchUserDataType | undefined = await fetchUsers({ userId: user.id, searchString: "", pageNumber: 1, pageSize: 25, sortBy: "desc" })
    console.log(result);



    return (
        <section>
            <h1 className='head-text mb-10'>Search</h1>\

            {/* Search Bar */}

            <div className='mt-10 flex flex-col gap-9'>
                {result?.users.length === 0 ?
                    (
                        <p className='no-result'>No Users</p>
                    ) :
                    (
                        <>
                            {result?.users.map((userData) => (
                                <UserCard
                                    key={userData.id}
                                    id={userData.id || ""}
                                    name={userData.name}
                                    username={userData.username}
                                    imageUrl={userData.image}
                                    bio={userData.bio}
                                    personType="User"
                                />
                            ))}
                        </>
                    )
                }
            </div>
        </section>
    )
}

export default Page