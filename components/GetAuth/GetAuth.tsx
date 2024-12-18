import firebaseConfig from '../../app/firebase-config'
import { initializeApp } from 'firebase/app'
import {
    QueryDocumentSnapshot,
    DocumentData,
    doc,
    getDocs,
    getFirestore,
    collection,
    query,
    onSnapshot,
    addDoc,
    DocumentReference,
    orderBy,
    deleteDoc,
    QuerySnapshot,
    Timestamp,
} from 'firebase/firestore'
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'

import Link from 'next/link'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '../ui/button'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Deslog from '@/app/logout/page'
import LoginModalButton from '../LoginModalButton/LoginModalButton'
export default async function GetAuth() {
    const supabase = createClient()

    const { data, error } = await supabase.auth.getUser()

    const username = data.user?.user_metadata?.username || 'User'

    return (
        <div className="flex">
            {!data.user ? (
                <LoginModalButton />
            ) : (
                <div>
                    <Dialog>
                        <DialogTrigger>{username}</DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Log In</DialogTitle>
                                <DialogDescription>
                                    By continuing, you agree to our User
                                    Agreement and acknowledge that you
                                    understand the Privacy Policy.
                                </DialogDescription>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label
                                            htmlFor="name"
                                            className="text-right"
                                        >
                                            Email
                                        </Label>
                                        {/* <Input
                                        id="name"
                                        className="col-span-3"
                                        value={name}
                                        placeholder="email@email.com"
                                        onChange={(event) => {
                                            setName(event.target.value)
                                            setLoginEmail(event.target.value)
                                        }}
                                    /> */}
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label
                                        htmlFor="username"
                                        className="text-right"
                                    >
                                        Password
                                    </Label>
                                    <Input
                                        id="password"
                                        className="col-span-3"
                                        type="password"
                                        placeholder="*******"
                                        // value={paswrd}
                                        // onChange={(event) => {
                                        //     setPaswrd(event.target.value)
                                        //     setLoginPassword(event.target.value)
                                        // }}
                                    />
                                </div>
                                <DialogDescription className="pt-4 text-blue-600">
                                    Forgot Password?
                                </DialogDescription>
                                <DialogDescription className="pt-4 text-blue-600">
                                    Doesn&apos;t Have an account? Register
                                </DialogDescription>

                                <DialogFooter>
                                    <Button type="submit">Log In</Button>
                                </DialogFooter>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger className="ml-2 outline-none">
                            {supabase.auth ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-chevron-down outline-none focus:outline-none"
                                >
                                    <path d="m6 9 6 6 6-6" />
                                </svg>
                            ) : (
                                <p></p>
                            )}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Link href={`/user/${username}`}>Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Help</DropdownMenuItem>
                            <DropdownMenuItem>Privacy Policy</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer">
                                <Deslog />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
        </div>
    )
}
