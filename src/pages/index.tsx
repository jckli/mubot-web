import type { NextPage } from "next";
import Image from "next/image";
import { MenuButton } from "../components/MenuButton";

const Home: NextPage = () => {
    return (
        <>
            <div id="top" className="h-[600px] flex flex-col items-center justify-center">
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
                <div className="mt-14 flex gap-8">
                    <MenuButton 
                        name="Invite"
                        link="https://jackli.dev/mangaupdates"
                        imagelink="/images/nav/nav1.png"
                    />
                    <MenuButton
                        name="Docs"
                        link="#docs"
                        imagelink="/images/nav/nav2.png"
                    />
                    <MenuButton
                        name="Support"
                        link="https://discord.gg/UcYspqftTF"
                        imagelink="/images/nav/nav3.png"
                    />
                    <MenuButton
                        name="GitHub"
                        link="https://github.com/jckli/mangaupdates-bot"
                        imagelink="/images/nav/nav4.png"
                    />
                </div>
            </div>
        </>
    );
};

export default Home;
