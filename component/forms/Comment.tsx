"use client"
import { CommentValidation } from '@/lib/validations/thread'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
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
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import Image from 'next/image'
import { addCommentToThread } from '@/lib/actions/thread.actions'


interface CommentInterface {
    threadId: string,
    currentUserImage: string,
    currentUserId: string
}

function Comment({ threadId, currentUserImage, currentUserId }: CommentInterface) {
    const router = useRouter()
    const pathname = usePathname()

    const form = useForm<z.infer<typeof CommentValidation>>({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            thread: "",
        },
    })

    const onSubmit = async (value: z.infer<typeof CommentValidation>) => {
        await addCommentToThread({
            threadId: threadId,
            commentText: value.thread,
            userId: currentUserId,
            path: pathname
        })
        form.reset()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form w-full">
                <FormField
                    control={form.control}
                    name="thread"
                    render={({ field }) => (
                        <FormItem className='flex w-full justify-between items-center gap-2'>
                            <FormLabel className='pr-2'>
                                <Image src={currentUserImage}
                                    alt='Profile Image'
                                    width={48}
                                    height={48}
                                    className='rounded-full object-cover'
                                />
                            </FormLabel>
                            <FormControl className='border-none bg-transparent text-light-2 '>
                                <Input
                                    type="text"
                                    placeholder='Comment ...'
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type='submit' className='comment-form_btn'>
                    Reply
                </Button>
            </form>
        </Form>
    )
}

export default Comment