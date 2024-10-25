"use client"
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { userValidation } from '@/lib/validations/user'
import { z } from 'zod'
import { Button } from "@/component/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/component/ui/form"
import { Input } from "@/component/ui/input"
import Image from 'next/image'
import { Textarea } from '../ui/textarea'
import { isBase64Image } from '@/lib/utils'
import { useUploadThing } from '@/lib/uploadthing'
import { updateUser } from '@/lib/actions/user.actions'
import { usePathname, useRouter } from 'next/navigation'

interface Props {
    user: {
        id: string,
        objectId: string,
        username: string,
        name: string,
        bio: string,
        image: string
    }
    btnTitle: string
}


const AccountProfile = ({ user, btnTitle }: Props) => {
    const { startUpload } = useUploadThing("media");
    const pathname = usePathname()
    const router = useRouter()

    const [files, setFile] = useState<File[]>([])

    const form = useForm<z.infer<typeof userValidation>>({
        resolver: zodResolver(userValidation),
        defaultValues: {
            profile_photo: user?.image || "",
            name: user.name || "",
            username: user.username || "",
            bio: user.bio || "",
        },
    })


    const handleImage = (e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
        e.preventDefault()

        if (e.target.files && e.target.files?.length > 0) {
            const file = e.target?.files[0]
            setFile(Array.from(e.target.files))
            const fileReader = new FileReader()

            if (!file.type.includes("image")) return;

            fileReader.onload = async (event) => {
                const imageData = event.target?.result?.toString() || ""
                fieldChange(imageData)
            }
            fileReader.readAsDataURL(file)
        }
    }


    async function onSubmit(values: z.infer<typeof userValidation>) {

        const blob = values.profile_photo;

        const hasImageChanged = isBase64Image(blob);

        if (hasImageChanged) {
            const imgRes = await startUpload(files);

            if (imgRes && imgRes[0].url) {
                values.profile_photo = imgRes[0].url || user.image;
            }
        }

        await updateUser({
            userId: user.id,
            username: values.username,
            name: values.name,
            bio: values.bio,
            image: values.profile_photo,
            path: pathname
        })

        if (pathname === "/profile/edit") {
            router.back()
        } else {
            router.push("/")
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-10">
                <FormField
                    control={form.control}
                    name="profile_photo"
                    render={({ field }) => (
                        <FormItem className='flex items-center gap-4'>
                            <FormLabel className='account-form_image-label'>
                                {field.value ?
                                    <Image
                                        src={field.value}
                                        alt='Profile Photo'
                                        width={96}
                                        height={96}
                                        priority
                                        className='rounded-full object-cover'
                                    />
                                    : (
                                        <Image
                                            src="/assets/profile.svg"
                                            alt='Profile Photo'
                                            width={24}
                                            height={24}
                                            className='object-contain'
                                        />
                                    )}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type='file'
                                    accept='image/*'
                                    placeholder='Upload a Photo'
                                    className='account-form_image-input'
                                    onChange={(e) => handleImage(e, field.onChange)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className='flex flex-col gap-2'>
                            <FormLabel className='text-base-semibold text-light-2 '>
                                Name
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type='text'
                                    placeholder='Enter Your Name...'
                                    className='account-form_input no-focus'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem className='flex flex-col gap-2'>
                            <FormLabel className='text-base-semibold text-light-2 text-start '>
                                Username
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type='text'
                                    placeholder='Enter Your Name...'
                                    className='account-form_input no-focus'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem className='flex flex-col gap-2'>
                            <FormLabel className='text-base-semibold text-light-2 '>
                                Bio
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    rows={10}
                                    placeholder='Enter Your Name...'
                                    className='account-form_input no-focus'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className='bg-primary-500'>Submit</Button>
            </form>
        </Form>
    )
}

export default AccountProfile