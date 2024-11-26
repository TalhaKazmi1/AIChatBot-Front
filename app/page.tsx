// pages/index.tsx
import Chatbot from '@/components/ChatBot';
import Head from 'next/head';

const Home = () => {
  return (
    <div>
      <Head>
        <title>Chatbot</title>
        <meta name="description" content="Chatbot using OpenAI API" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Chatbot />
    </div>
  );
};

export default Home;
