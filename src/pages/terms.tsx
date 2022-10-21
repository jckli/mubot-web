import type { NextPage } from "next";
import Link from "next/link";

const Terms: NextPage = () => {
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
                            <h1 className="font-kgcs"><b>Terms of Service</b></h1>
                        </div>
                        <br />
                        <div>
                        <h2 className="mb-4 font-kgcs text-2xl"><b>Introduction</b></h2>
                        <p className="font-normal text-lg mb-4">
                            This Terms of Service (“Terms”) is a legal agreement between you and the MangaUpdates Bot team (“we”, “us”, “our”). By using the 
                            Picsiv application (“Application”), you agree to these Terms. You acknowledge that you have read these Terms and agree to be bound of them.
                        </p>
                        <p className="font-normal text-lg mb-4">
                            If you do not agree with (or cannot comply with) these Terms, then you may not use the Application.
                            These Terms apply to all visitors, users and others who access or use the Application.
                        </p>
                    </div>
                    <div>
                        <h2 className="mb-4 font-kgcs text-2xl"><b>Access to external resources</b></h2>
                        <p className="font-normal text-lg mb-4">
                            The Service may use external resources, including content, data, links, and tools (“External Resources”), from third parties.
                            External Resources are not under our control and are not under our responsibility and is therefore not responsible for their content and availability.
                        </p>
                        <p className="font-normal text-lg mb-4">
                            In particular, this includes the Application&apos;s main functions, which use third party information to display images. The Picsiv team does not control 
                            or moderate the images displayed in the Applications. If users request any images, they will be interacting with third parties responsible for the 
                            display of the images.
                        </p>
                        <p className="font-normal text-lg mb-4">
                            The Picsiv team is not responsible for any matters resulting from such interaction with third parties, such as anything
                            resulting from visiting third-party websites, requesting third-party content, or seeing third-party images.
                        </p>
                    </div>
                    <div>
                        <h2 className="mb-4 font-kgcs text-2xl"><b>Use by Minors</b></h2>
                        <p className="font-normal text-lg mb-4">
                            Though use is minors is permitted, since the MangaUpdates Bot team does not moderate the manga tracked by the bot, it is the responsibility of the user to
                            ensure that the manga tracked by the bot are appropriate for minors. The MangaUpdates Bot team does not control the content of the manga. If you are under the age of 18, you are prohibited
                            from adding &quot;over 18&quot; manga to the bot and tracking them.
                        </p>
                        <p className="font-normal text-lg mb-4">
                            Due to there being no safeguards in place to prevent minors from adding &quot;over 18&quot; manga to the bot, 
                            the MangaUpdates Bot team will not be held responsible for any &quot;over 18&quot; manga tracked by minors. Users are responsible for 
                            ensuring that the manga tracked by the bot are appropriate for minors.
                        </p>
                    </div>
                    <div>
                        <h2 className="mb-4 font-kgcs text-2xl"><b>Disclaimer of Warranty</b></h2>
                        <p className="font-normal text-lg mb-4">
                            THESE SERVICES ARE PROVIDED BY COMPANY ON AN “AS IS” AND “AS AVAILABLE” BASIS. COMPANY MAKES NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, AS TO THE OPERATION OF THEIR SERVICES, OR THE INFORMATION, CONTENT OR MATERIALS INCLUDED THEREIN. YOU EXPRESSLY AGREE THAT YOUR USE OF THESE SERVICES, THEIR CONTENT, AND ANY SERVICES OR ITEMS OBTAINED FROM US IS AT YOUR SOLE RISK.
                        </p>
                        <p className="font-normal text-lg mb-4">
                            COMPANY HEREBY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF MERCHANTABILITY, NON-INFRINGEMENT, AND FITNESS FOR PARTICULAR PURPOSE.
                        </p>
                        <p className="font-normal text-lg mb-4">
                            THE FOREGOING DOES NOT AFFECT ANY WARRANTIES WHICH CANNOT BE EXCLUDED OR LIMITED UNDER APPLICABLE LAW.
                        </p>
                    </div>
                    <div>
                        <h2 className="mb-4 font-kgcs text-2xl"><b>Changes to Services</b></h2>
                        <p className="font-normal text-lg mb-4">
                            We reserve the right to withdraw or amend our Application, and any service or material we provide via Application, in our sole discretion without notice.
                            We will not be liable if for any reason all or any part of Application is unavailable at any time or for any period. From time to time, we may restrict access 
                            to some parts of Application, or the entire Application, to users and servers.
                        </p>
                    </div>
                    <div>
                        <h2 className="mb-4 font-kgcs text-2xl"><b>Amendments To Terms</b></h2>
                        <p className="font-normal text-lg mb-4">
                            We may amend Terms at any time by posting the amended terms on this site. It is your responsibility to review these Terms periodically.
                        </p>
                        <p className="font-normal text-lg mb-4">
                            Your continued use of the Application after any such changes constitutes your binding acceptance of the new Terms. If you do not agree to the new terms, you are no longer authorized to use Service.
                            You are expected to check this page frequently so you are aware of any changes, as they are binding on you.
                        </p>
                    </div>
                    <div>
                        <h2 className="mb-4 font-kgcs text-2xl"><b>Acknowledgement</b></h2>
                        <p className="font-normal text-lg mb-4">
                            BY USING THIS APPLICATION OR OTHER APPLICATION PROVIDED BY US, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF SERVICE AND AGREE TO BE BOUND BY THEM.
                        </p>
                    </div>
                    <div>
                        <h2 className="mb-4 font-kgcs text-2xl"><b>Contact Us</b></h2>
                        <p className="font-normal text-lg mb-4">
                            If you have any questions, feedback, or requests, please contact us:
                        </p>
                        <p className="font-normal text-lg mb-4">
                            By email: <a className="text-[#494e53] transition-all ease-in-out duration-300 hover:text-[#a385b3] mb-6" href="mailto:jack@jackli.dev">
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

export default Terms;