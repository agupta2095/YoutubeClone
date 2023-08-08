'use client';
import Image from "next/image";
import styles from "./navbar.module.css";
import Link from "next/link";
import SignIn from "./sign-in";
import {User} from 'firebase/auth';
import { onAuthStateChangedHelper } from "../firebase/firebase";
import { useEffect, useState } from "react";

export default function Navbar() {
    // Initialize user state
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const unsubscribe = onAuthStateChangedHelper((user) => {
            setUser(user);
        });
      // Cleanup subscription on unmount
      return () => unsubscribe();
    }, []);

    return (
        <nav className={styles.nav}>
            <Link href="/">
                <span className={styles.logoContainer}>
                    <Image className={styles.logo} width={90} height={20} src="/youtube-logo.svg" alt="Youtube Logo" />
                </span>
            </Link>
            <SignIn user={user} />
        </nav>
    );
}