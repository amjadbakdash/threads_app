"use client"
import { threadValidation } from '@/lib/validations/thread'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/component/ui/form"
import { Input } from '@/component/ui/input'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { createThread } from '@/lib/actions/thread.actions'

const PostThread = ({ userID }: { userID: string }) => {

    const router = useRouter()
    const pathname = usePathname()

    const form = useForm<z.infer<typeof threadValidation>>({
        resolver: zodResolver(threadValidation),
        defaultValues: {
            thread: "",
            accountID: userID
        },
    })

    const onSubmit = async (value: z.infer<typeof threadValidation>) => {
        await createThread({
            text: value.thread,
            author: userID,
            communityId: null,
            path: pathname
        })
        router.push("/")
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-10 mt-10">
                <FormField
                    control={form.control}
                    name="thread"
                    render={({ field }) => (
                        <FormItem className='flex flex-col gap-2'>
                            <FormLabel className='text-base-semibold text-light-2 '>
                                Content
                            </FormLabel>
                            <FormControl className='border border-dark-4 bg-dark-3 text-light-1'>
                                <Textarea
                                    rows={15}
                                    placeholder='Enter Your Name...'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type='submit' className='bg-primary-500'>
                    Post Thread
                </Button>
            </form>
        </Form>
    )
}

export default PostThread