import Image from "next/image";
import styles from "./navbar.module.css";
import Link from "next/link";

export default function Navbar() {
    return (
        <nav className={styles.nac}>
            <Link className={styles.logoContainer} href="/">
                <Image width={100} height={30} src="/youtube-logo.svg" alt="Youtube Logo" />
            </Link>
        </nav>
    );
}