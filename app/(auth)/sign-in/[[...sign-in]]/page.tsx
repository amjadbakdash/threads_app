import { SignIn } from '@clerk/nextjs'

export default function Page() {
    return (
        <div className='bg-dark-1'>
            <SignIn />
        </div>
    )
}