import type { NextPage } from "next";
import Link from "next/link";

const Privacy: NextPage = () => {
    return (
        <>
            <div className="w-full flex flex-col items-center justify-center text-white text-3xl font-semibold">
                <div className="my-12 md:my-20 mx-6 md:mx-20 max-w-[1200px] bg-[#212129] rounded-xl">
                    <div className="p-10">
                        <div className="text-center">
                            <div className="mb-6">
                                <Link href="/">
                                    <a className="text-[#494e53] transition-all ease-in-out duration-300 hover:text-[#a385b3] font-kgcs text-2xl">Go Home</a>
                                </Link>
                            </div>
                            <h1 className="font-kgcs"><b>Privacy Policy</b></h1>
                        </div>
                        <br />
                        <div>
                            <h2 className="mb-4 font-kgcs text-2xl"><b>Introduction</b></h2>
                            <p className="font-normal text-lg mb-4">
                                MangaUpdates Bot was developed as an open source application. This service is provided as is, and by the MangaUpdates Bot team at no cost.
                                This page is used to inform users regarding our policies with the collection, use, and disclosure of Personal Information.
                            </p>
                        </div>
                        <div>
                            <h2 className="mb-4 font-kgcs text-2xl"><b>Information Collection and Use</b></h2>
                            <p className="font-normal text-lg mb-4">
                                We currently store a bit of information about you, such as your ids and mangas. If you send updates to a server channel,
                                we will store your server ID and your server&apos;s channel ID that was set. If you send updates to your personal direct messages,
                                we will store your user ID. These IDs are used to identify where to send the chapter update. We also store manga titles and mangaupdates&apos;
                                manga IDs for each manga added to your list. This is used to identify which manga you want to be notified for. 
                                We, however, do not store any personal information like usernames, profile pictures, etc.
                            </p>
                            <p className="font-normal text-lg mb-4">
                                You can remove your data by running the delete command provided by the bot. For server&apos;s, you can also remove your server&apos;s data by 
                                simply removing the bot from the server. Users will need to use the delete command provided the bot.
                            </p>
                        </div>
                        <div>
                            <h2 className="mb-4 font-kgcs text-2xl"><b>Data Storage</b></h2>
                            <p className="font-normal text-lg mb-4">
                                We store your data in a database. We use MongoDB to securely store your data.
                            </p>
                        </div>
                        <div>
                            <h2 className="mb-4 font-kgcs text-2xl"><b>Contact Us</b></h2>
                            <p className="font-normal text-lg mb-4">
                                If you have any questions about this Privacy Policy, please contact us at: <a className="text-[#494e53] transition-all ease-in-out duration-300 hover:text-[#a385b3] mb-6" href="mailto:jack@jackli.dev">
                                    jack@jackli.dev
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Privacy;