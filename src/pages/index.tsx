import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';
import Head from 'next/head';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

type Card = {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
};

type IInfiniteQueryResponse = {
  after: number | null;
  data: Card[];
};

export default function Home(): JSX.Element {
  const getImages = async ({ pageParam = null }): Promise<IInfiniteQueryResponse> => {
    const { data } = await api.get('/api/images', { params: { after: pageParam } });

    return data;
  };

  const { data, isLoading, isError, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery<
    unknown,
    unknown,
    IInfiniteQueryResponse
  >('images', getImages, {
    getNextPageParam: (lastPage: { after: number }) => lastPage.after,
  });

  const formattedData = useMemo(() => data?.pages.map(page => page.data).flat(), [data]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Head>
        <title>UpFi</title>

        <link rel="shortcut icon" href="logo.svg" />
      </Head>

      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />

        {hasNextPage && (
          <Button onClick={() => fetchNextPage()} mt="8">
            {isFetchingNextPage ? 'Carregando' : 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}
