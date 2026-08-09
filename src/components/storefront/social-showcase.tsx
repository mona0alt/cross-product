/* eslint-disable @next/next/no-img-element */
import React from 'react';

export type SocialShowcasePost = {
  id: string;
  platform: string;
  imageUrl: string;
  targetUrl: string;
};

export function SocialShowcase({
  copy,
  posts
}: {
  copy: {
    title: string;
  };
  posts: SocialShowcasePost[];
}) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="bg-[var(--mk-bg)] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--mk-highlight)]">
            SOCIAL MEDIA
          </p>
          <h2 className="mk-display-font mt-2 text-3xl font-semibold text-[var(--mk-accent)]">
            {copy.title}
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((post) => (
            <a
              key={post.id}
              href={post.targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-[9/16] overflow-hidden rounded-[22px] border border-[var(--mk-border)] bg-[var(--mk-bg-muted)] shadow-[0_20px_48px_rgba(112,89,81,0.12)] transition duration-500 hover:-translate-y-1"
            >
              <img
                src={post.imageUrl}
                alt={copy.title}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
