import type { NextPage } from "next";
import Image from "next/image";

const Home: NextPage = () => {
    return (
        <>
            <div id="top" className="h-[400px] flex items-center justify-center">
                <div id="title" className="flex items-center justify-center">
                    <div className="relative">
                        <Image
                            className="rounded-full"
                            alt="MangaUpdates logo"
                            src="/images/logo.png" 
                            width={170} 
                            height={170} 
                        />
                    </div>
                    <div className="ml-8">
                        <h1 className="font-kgcs text-4xl">MangaUpdates Bot</h1>
                        <h2 className="font-kgcs text-md w-[500px] mt-4">Track your favorite mangas, manhwas, or doujins and get every new chapter update sent to you!</h2>
                    </div>
                </div>
                <div>
                    
                </div>
            </div>
        </>
    );
};

export default Home;
