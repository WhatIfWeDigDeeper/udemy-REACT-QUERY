import { useQuery } from "react-query";

import { Comment, Post } from "./types";

async function fetchComments(postId: number) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );
  return response.json();
}

async function deletePost(postId: number) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "DELETE" }
  );
  return response.json();
}


async function updatePost(postId: number) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        data: {
          title: "REACT QUERY FOREVER!!!!"
        }
      })
    }
  );
  return response.json();
}

export function PostDetail({ post } : { post: Post }) {
  // replace with useQuery
  const { data: commentData, error, isError, isLoading } = useQuery(`post-comments-${post.id}`, () => {
    return fetchComments(post.id)
  }, { staleTime: 2000 });

  if (isLoading) {
    return <h3>Loading...</h3>;
  }
  if (isError) {
    return (
      <>
        <h3>Error!</h3>
        <p>{(error as Error).toString()}</p>
      </>
    );
  }

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <button onClick={() => deletePost(post.id)}>Delete</button> <button>Update title</button>
      <p>{post.body}</p>
      <h4>Comments</h4>
      {commentData.map((comment: Comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
