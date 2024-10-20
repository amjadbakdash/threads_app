import ThreadCard from "@/component/cards/ThreadCard";
import Comment from "@/component/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { ThreadsInterface } from "@/modules/Threads.types";
import { UserDataInterface } from "@/modules/user.types";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function Page({ params }: { params: { id: string } }) {

    if (!params.id) return null

    const user = await currentUser()
    if (!user) return null

    const userInfo: UserDataInterface = await fetchUser(user.id)
    if (!userInfo?.onboarded) redirect("/onboarding")

    const thread: ThreadsInterface = await fetchThreadById(params.id)

    console.log(thread.children)

    return (
        <section className="relative">
            <div>
                < ThreadCard
                    key={thread._id}
                    id={thread._id}
                    currentUserId={user?.id}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={thread.author}
                    community={thread.community}
                    createdAt={thread.createdAt}
                    comments={thread.children}
                />
            </div>
            <div className="mt-7">
                <Comment
                    threadId={thread._id}
                    currentUserImage={userInfo.image}
                    currentUserId={userInfo._id || ""}
                />
            </div>

            <div className="mt-5">
                {thread.children.map((comment: ThreadsInterface) => (
                    <ThreadCard
                        key={comment._id}
                        id={comment._id}
                        currentUserId={user?.id}
                        parentId={comment.parentId}
                        content={comment.text}
                        author={comment.author}
                        community={comment.community}
                        createdAt={comment.createdAt}
                        comments={comment.children}
                        isComment
                    />
                ))}
            </div>

        </section>
    )
}

export default Page

