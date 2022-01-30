import { useMutation, useQuery } from "react-query";
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
  const { data: commentData, error, isError, isLoading } = useQuery(`post-comments-${post.id}`, () => {
    return fetchComments(post.id)
  }, { staleTime: 2000 });

  const deleteMutation = useMutation((postId: number) => deletePost(postId));
  const updateMutation = useMutation((postId: number) => updatePost(postId));

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
      <button onClick={() => deleteMutation.mutate(post.id)}>Delete</button>
      {deleteMutation.error && (
        <p style={{ color: 'red' }}>Error deleting post {post.id} - {(deleteMutation.error as Error).toString()}</p>
      )}
      {deleteMutation.isLoading && (
        <p style={{ color: 'purple' }}>Deleting post...</p>
      )}
      {deleteMutation.isSuccess && (
        <p style={{ color: 'green' }}>Successfully deleted post</p>
      )}

      <button onClick={() => updateMutation.mutate(post.id)}>Update Title</button>
      {updateMutation.error && (
        <p style={{ color: 'red' }}>Error updating post {post.id} - {(updateMutation.error as Error).toString()}</p>
      )}
      {updateMutation.isLoading && (
        <p style={{ color: 'purple' }}>Updating post...</p>
      )}
      {updateMutation.isSuccess && (
        <p style={{ color: 'green' }}>Successfully updated post</p>
      )}

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
