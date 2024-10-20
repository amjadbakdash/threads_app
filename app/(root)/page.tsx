import { fetchThreads } from "@/lib/actions/thread.actions";
import { currentUser } from "@clerk/nextjs/server";
import ThreadCard from "@/component/cards/ThreadCard";

export default async function Home() {
  const currentUserId = await currentUser()

  const posts = await fetchThreads(1, 10)


  return (
    <main>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-10 flex flex-col gap-10 ">
        {posts.Posts.length === 0 ? (
          <p className="no-result">No Threads Found !</p>
        ) : (
          <>
            {posts.Posts.map((post) => (
              < ThreadCard
                key={post._id}
                id={post._id}
                currentUserId={currentUserId?.id}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ))}
          </>
        )}
      </section>
    </main>
  );
}
