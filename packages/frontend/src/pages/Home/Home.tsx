import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { useEffect, useState } from 'react';
import nft1 from 'assets/nft1.png';
import nft2 from 'assets/nft2.png';
import nft3 from 'assets/nft3.png';
import nft4 from 'assets/nft4.png';
import nft5 from 'assets/nft5.png';
import axios from 'axios';

import { ApeNFT, BackgroundPaper } from './Home.style';
import { useAudio } from 'hooks';

import coin from '../../assets/coin.mp3';
import kumo from 'assets/kumo.svg';
import { useAsync } from 'react-use';

const client = axios.create({
  baseURL: process.env.VITE_API_URL,
});

interface ApeNFTProps {
  id: string;
  positionX: number;
  positionY: number;
  src: string;
}

interface ApeNFTData {
  id: string;
  positionX: number;
  positionY: number;
  imageIndex: number;
}

// TODO : Adapt Backend Lambdas (Response Format, Routes...)

const ApeNFTImgs = [nft1, nft2, nft3, nft4, nft5];

const Home = (): JSX.Element => {
  const [score, setScore] = useState(0);

  const [apeNFTs, setApeNFTs] = useState<ApeNFTProps[]>([]);

  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => setUserId(Math.floor(Math.random() * 10000 + 1)), []);

  useAsync(async () => {
    if (!userId) return;
    const { data } = await client.get<{
      balance: number;
      nftsList: ApeNFTData[];
    }>(`/nfts/${userId}`);
    setApeNFTs(
      data.nftsList.map(apeNFT => ({
        ...apeNFT,
        src: ApeNFTImgs[apeNFT.imageIndex],
      })),
    );
    setScore(data.balance);
  }, [userId]);

  const buyApeNFT = async () => {
    const { data } = await client.post<{ balance: number; newNft: ApeNFTData }>(
      `/nfts/${userId}`,
    );

    setApeNFTs(prevApeNFTs =>
      prevApeNFTs.concat({
        ...data.newNft,
        src: ApeNFTImgs[data.newNft.imageIndex],
      }),
    );
    setScore(data.balance);
  };

  const sellApeNFT = async (apeNFTId: string) => {
    const { data } = await client.delete<{ balance: number }>(
      `/nfts/${apeNFTId}?owner=${userId}`,
    );

    setApeNFTs(prevApeNFTs => prevApeNFTs.filter(({ id }) => id !== apeNFTId));
    setScore(data.balance);
  };
  const audio = useAudio(coin, { volume: 0.8, playbackRate: 1 });

  return (
    <Box display="flex" flexDirection="column" height="100vh" maxWidth="100%">
      <AppBar position="sticky">
        <Toolbar style={{ backgroundColor: '#181173' }}>
          <Button>
            <a href="https://dev.to/kumo">
              <img
                src={kumo}
                width="auto"
                height="50px"
                style={{ marginTop: '15px' }}
              />
            </a>
          </Button>
          <Typography variant="h1" sx={{ flexGrow: 1 }}>
            {'Learn Serverless with Bored Apes'}
          </Typography>
          <Typography variant="h1" sx={{ flexGrow: 1 }}>
            {`UserId: ${userId}`}
          </Typography>
          <Typography
            variant="h1"
            color={score > 0 ? 'green' : 'red'}
            style={{
              padding: '10px',
              backgroundColor: '#f2b056',
              marginTop: '5px',
              marginBottom: '5px',
            }}
            border={score > 0 ? '4mm solid green' : '4mm solid red'}
          >
            {`Score: ${score.toString().padStart(10, ' ')} $`}
          </Typography>
        </Toolbar>
      </AppBar>
      <BackgroundPaper>
        <Box
          display="flex"
          flexDirection="row"
          height="100vh"
          paddingLeft="10%"
          paddingRight="10%"
          justifyContent="space-between"
          maxWidth="100%"
        >
          <Box>
            {apeNFTs.map(apeNFT => (
              <ApeNFT
                height="100px"
                key={apeNFT.id}
                {...apeNFT}
                onClick={() => {
                  sellApeNFT(apeNFT.id);
                  audio.play();
                }}
              ></ApeNFT>
            ))}
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignContent="center"
            textAlign="center"
            style={{
              position: 'absolute',
              top: '35%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <Button onClick={buyApeNFT}>
              <Typography color="lightblue" fontSize={50}>
                {'Buy ApeNFT'}
              </Typography>
            </Button>
          </Box>
        </Box>
      </BackgroundPaper>
    </Box>
  );
};

export default Home;
