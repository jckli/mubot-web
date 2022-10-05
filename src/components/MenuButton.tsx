import { motion } from "framer-motion";
import Image from "next/image";

export const MenuButton = (props: any) => {
    return (
        <motion.a
            className="flex flex-col items-center"
            href={props.link}
            target="_blank"
            whileHover={{ scale: 1.05 }}
        >
            <Image
                className="rounded-xl"
                alt={`${props.name} image`}
                src={props.imagelink}
                width={125}
                height={125}
            />
            <span className="font-kgcs mt-2 text-lg">{props.name}</span>
        </motion.a>
    )
}