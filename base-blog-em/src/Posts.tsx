import { useState } from 'react';
import { useQuery } from 'react-query';
import { Post } from 'types';

import { PostDetail } from './PostDetail';
const maxPostPage = 10;

async function fetchPosts(pageNum: number) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}`
  );
  return response.json();
}

const fakeApiStartPage = 1;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(fakeApiStartPage);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // replace with useQuery
  const { data, error, isError, isLoading } = useQuery(
    ["posts", currentPage],
    () => fetchPosts(currentPage),
    { staleTime: 2000 }
  );

  if (isLoading) {
    return (
      <h3>
        Loading...
      </h3>
    );
  }
  if (isError) {
    return <>
      <h3>Error!</h3>
      <p>{(error as Error).toString()}</p>
      </>
  }
  return (
    <>
      <ul>
        {data.map((post: Post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button disabled={currentPage <= fakeApiStartPage} onClick={() => {
          setCurrentPage((previousValue) => previousValue - 1);
        }}>
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage >= maxPostPage}
          onClick={() => {
            setCurrentPage((previousValue) => previousValue + 1);
          }}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
