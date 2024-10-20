import { OrganizationSwitcher, SignedIn, SignOutButton } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import Image from 'next/image'
import Link from 'next/link'

const TopSidebar = () => {
    return (
        <nav className='topbar'>
            <Link href="/" className='flex items-center gap-4'>
                <Image src="/assets/logo.svg" alt='' width={28} height={28}></Image>
                <p className='text-heading3-bold text-light-1 max-sm:hidden'>Threads</p>
            </Link>

            <div className='flex items-center gap-2'>
                <div className='block md:hidden'>
                    <SignOutButton>
                        <div className='cursor-pointer'>
                            <Image src="/assets/logout.svg" alt='logout' width={24} height={24} />
                        </div>
                    </SignOutButton>
                </div>
                <OrganizationSwitcher
                    appearance={{
                        baseTheme: dark,
                        elements: {
                            organizationSwitcherTrigger:
                                "py-2 px-4"
                        }
                    }}
                />
            </div>
        </nav>

    )
}

export default TopSidebar