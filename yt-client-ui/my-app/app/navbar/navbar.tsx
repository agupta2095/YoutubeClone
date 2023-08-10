'use client';
import Image from "next/image";
import styles from "./navbar.module.css";
import Link from "next/link";
import SignIn from "./sign-in";
import Upload from "./upload";
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
                    <Image className={styles.logo} width={90} height={20} 
                    src="/youtube-logo.svg" alt="Youtube Logo" />
            </Link>
                {   //This won't render the Upload component if user is null, not show
                    // it when the user is signed out.
                    user && <Upload />
                }
            
            <SignIn user={user} />
        </nav>
    );
}