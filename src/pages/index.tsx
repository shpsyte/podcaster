import { GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '../services/axios';
import { format, parseISO } from 'date-fns';
import { convertDuationToTimeString } from '../utils/convertDuationToTimeString';
import styles from './home.module.scss';
import React from 'react';
import { usePlayer } from '../contexts/PlayerContext';
import Head from 'next/head'

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

type HomeProps = {
  allEpisodes: Episode[];
  latestEdisodes: Episode[];
};

export default function Home({ allEpisodes, latestEdisodes }: HomeProps) {
  const { playList } = usePlayer();

  const episodeList = [...latestEdisodes, ...allEpisodes];
  return (
    <div className={styles.homePage}>
      <Head>
        <title>Podcaster</title>
      </Head>
      <section className={styles.latestEdipodes}>
        <h2>Fresh publish </h2>
        <ul>
          {latestEdisodes.map((episode, index) => {
            return (
              <li key={episode.id}>
                <Image
                  width={192}
                  height={192}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit="cover"
                />
                <div className={styles.episodeDetails}>
                  <Link href={`/episode/${episode.id}`}>{episode.title}</Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button
                  type="button"
                  onClick={() => playList(episodeList, index)}
                >
                  <img src="/play-green.svg" alt="Play" />
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>All Episodes</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Members</th>
              <th>Data</th>
              <th>Duration</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((episode, index) => {
              return (
                <tr key={episode.id}>
                  <td style={{ width: 72 }}>
                    <Image
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episode/${episode.id}`}>{episode.title}</Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 100 }}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() =>
                        playList(episodeList, index + latestEdisodes.length)
                      }
                    >
                      <img src="/play-green.svg" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc',
    },
  });

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy'),
      duration: Number(episode.file.duration),
      durationAsString: convertDuationToTimeString(
        Number(episode.file.duration),
      ),
      description: episode.description,
      url: episode.file.url,
    };
  });

  const latestEdisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      allEpisodes,
      latestEdisodes,
    },
    revalidate: 60 * 60 * 8, /// 8 horas
  };
};
