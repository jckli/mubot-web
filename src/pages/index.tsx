import type { NextPage } from "next";
import Image from "next/image";
import { MenuButton } from "../components/MenuButton";

const Home: NextPage = () => {
    return (
        <>
            <div id="top" className="min-h-[600px] flex flex-col items-center justify-center">
                <div id="title" className="flex flex-col pt-16 md:flex-row items-center justify-center">
                    <div className="relative w-[125px] h-[125px] md:w-[170px] md:h-[170px]">
                        <Image
                            className="rounded-full"
                            alt="MangaUpdates logo"
                            src="/images/logo.png" 
                            layout="fill"
                        />
                    </div>
                    <div className="text-center mt-4 md:mt-0 md:text-left md:ml-8">
                        <h1 className="font-kgcs text-2xl md:text-4xl">MangaUpdates Bot</h1>
                        <h2 className="font-kgcs text-sm md:text-base max-w-[500px] mt-4 px-6 md:px-0">Track your favorite mangas, manhwas, or doujins and get every new chapter update sent to you!</h2>
                    </div>
                </div>
                <div className="mt-14 px-8 flex flex-wrap gap-8 justify-center items-center">
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
