import type { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import { MenuButton } from "../components/MenuButton";
import { useLanyard } from "use-lanyard";

const discord_id = "326498384758308875";

const Home:NextPage = () => {
    const lanyardData = useLanyard(discord_id);
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
                        <h2 className="font-kgcs text-sm md:text-base max-w-[500px] mt-4 px-6 md:px-0">Track your favorite mangas, manhwas, or doujins and get every new update sent to you!</h2>
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
            <div id="content" className="flex justify-center items-center my-10">
                <div className="px-6">
                    <div className="bg-[#212129] max-w-[650px] rounded-2xl">
                        <div className="p-10 font-kgcs">
                            <div className="flex flex-col items-center">
                                <p className="text-[10px]">developed with 🤍 by</p>
                                <div className="mt-4 w-[84px] h-[84px] relative rounded-[50%] overflow-hidden">
                                    <Image
                                        alt="ohashi icon"
                                        src={`https://cdn.discordapp.com/avatars/${lanyardData.data?.discord_user.id}/${lanyardData.data?.discord_user.avatar}.png?size=1024`}
                                        layout="fill"
                                    />
                                </div>
                                <p className="text-md">ohashi</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="footer" className="my-10 mx-40 flex justify-center items-center font-kgcs">
                <div className="w-[750px] text-center flex flex-col justify-center items-center">
                    <p>© copyright 2022 <a href="https://github.com/jckli" className="underline underline-offset-1">jckli</a></p>
                    <div className="flex gap-2 underline underline-offset-1">
                        <Link href="/terms">
                            <a>terms</a>
                        </Link>
                        <Link href="/privacy">
                            <a>privacy</a>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};  

export default Home;
