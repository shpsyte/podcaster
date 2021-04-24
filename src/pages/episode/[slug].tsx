import { format, parseISO } from 'date-fns';
import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext } from 'react';
import { api } from '../../services/axios';
import { convertDuationToTimeString } from '../../utils/convertDuationToTimeString';
import styles from './episode.module.scss';
import { usePlayer } from '../../contexts/PlayerContext';
import Head from 'next/head';

type Episode = {
  id: string;
  title: string;
  members: string;
  publishedAt: string;
  duration: number;
  durationAsString: string;
  description: string;
  thumbnail: string;
  url: string;
};

type EpisodeProps = {
  episode: Episode;
};

export default function Episode({ episode }: EpisodeProps) {
  const { play } = usePlayer();

  return (
    <div className={styles.episode}>
      <Head>
        <title>{episode.title}</title>
        <meta name="title" content={episode.title} />
        <meta name="description" content={episode.description} />

        <meta property="og:image" content={episode.thumbnail} />

        <meta property="twitter:card" content={episode.thumbnail} />
        <meta property="twitter:title" content={episode.title} />
        <meta property="twitter:description" content={episode.description} />
        <meta property="twitter:image" content={episode.thumbnail} />
      </Head>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" />
          </button>
        </Link>
        <Image
          width={700}
          height={160}
          src={episode.thumbnail}
          alt={episode.title}
          objectFit="cover"
        />
        <button type="button" onClick={() => play(episode)}>
          <img src="/play.svg" />
        </button>
      </div>
      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>
      <div className={styles.description}>
        <div dangerouslySetInnerHTML={{ __html: episode.description }} />
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 2,
      _sort: 'published_at',
      _order: 'desc',
    },
  });
  const paths = data.map(episode => {
    return {
      params: {
        slug: episode.id,
      },
    };
  });
  return {
    paths: paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ctx => {
  const { slug } = ctx.params;
  const { data } = await api.get(`/episodes/${slug}`);

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy'),
    duration: Number(data.file.duration),
    durationAsString: convertDuationToTimeString(Number(data.file.duration)),
    description: data.description,
    url: data.file.url,
  };

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24, // 24h
  };
};
