'use client'

import React, { useEffect, useState } from 'react'
import Header from '../../components/Header/Header'
import Sidebar from '../../components/Sidebar/Sidebar'
import { getAuth } from 'firebase/auth'
import firebaseConfig from '../firebase-config'
import { initializeApp } from 'firebase/app'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'

interface UserVideo {
    video_url: string
    position: number
    title: string
    channelTitle: string
    channelSubs: number
    thumbnailUrl: string
    viewCount: number // Adicionado para armazenar o número de visualizações
}

export default function NewClaimedVideos() {
    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)
    const supabase = createClientComponentClient()

    const [userUsername, setUserUsername] = useState('')
    const [authStateChangedComplete, setAuthStateChangedComplete] =
        useState(false)
    const [loggedUser, setLoggedUser] = useState<unknown | null>(null)
    const [user_id, setUser_id] = useState<string | null>(null)
    const [userVideos, setUserVideos] = useState<UserVideo[]>([])
    const [loadingVideos, setLoadingVideos] = useState(true) // Estado para controlar o carregamento dos vídeos

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUserUsername(user.uid)
                setLoggedUser(user.uid)
                console.log('logado')
            } else {
                setUserUsername('')
                console.log('não logado')
            }
            setAuthStateChangedComplete(true)
        })

        return () => unsubscribe()
    }, [auth])

    const handleAddCollection = async () => {
        console.log('iniciando')
        if (authStateChangedComplete) {
            try {
                const { data: users, error: usersError } = await supabase
                    .from('users')
                    .select('id')
                    .eq('uid', loggedUser)
                    .single()

                if (usersError) {
                    throw usersError
                }

                const user_id = users ? users.id : null
                setUser_id(user_id)

                const { data: userVideosData, error } = await supabase
                    .from('videosnew')
                    .select(
                        'video_url, position, video_title, channel_name, subscribers_count, video_thumbnail, views_count'
                    )
                    .eq('user_id', user_id)

                if (error) {
                    throw error
                }

                const videosWithDetails: UserVideo[] = userVideosData.map(
                    (video) => ({
                        video_url: video.video_url,
                        position: video.position,
                        title: video.video_title,
                        channelTitle: video.channel_name,
                        channelSubs: video.subscribers_count,
                        thumbnailUrl: video.video_thumbnail,
                        viewCount: video.views_count,
                    })
                )

                setUserVideos(videosWithDetails)
                setLoadingVideos(false) // Quando os vídeos são carregados, definimos o estado para false
            } catch (error) {
                console.error('Erro ao reinvidicar vídeo:', error)
            }
        }
    }

    useEffect(() => {
        if (authStateChangedComplete) {
            handleAddCollection()
        }
    }, [authStateChangedComplete])

    return (
        <main className="flex min-h-screen flex-col">
            <Header />
            <div className="flex min-h-full w-full flex-1 flex-col justify-between font-sans text-sm">
                <div className="flex h-full flex-1">
                    <Sidebar />
                    <div className="flex flex-col p-4">
                        <p className="mb-4 text-lg font-semibold">
                            Vídeos reivindicados por:{' '}
                            {auth.currentUser?.displayName}
                        </p>
                        <div className="grid grid-cols-4 gap-4">
                            {loadingVideos ? (
                                <>
                                    <div className="flex flex-col space-y-3">
                                        <Skeleton className="h-[125px] w-[280px] rounded-xl" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-[250px]" />
                                            <Skeleton className="h-4 w-[200px]" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col space-y-3">
                                        <Skeleton className="h-[125px] w-[280px] rounded-xl" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-[250px]" />
                                            <Skeleton className="h-4 w-[200px]" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col space-y-3">
                                        <Skeleton className="h-[125px] w-[280px] rounded-xl" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-[250px]" />
                                            <Skeleton className="h-4 w-[200px]" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col space-y-3">
                                        <Skeleton className="h-[125px] w-[280px] rounded-xl" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-[250px]" />
                                            <Skeleton className="h-4 w-[200px]" />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                userVideos.map((video, index) => (
                                    <Card key={index} className="max-w-72">
                                        <CardHeader>
                                            <Link
                                                href={video.video_url}
                                                target="_blank"
                                            >
                                                <img
                                                    src={video.thumbnailUrl}
                                                    alt="Thumbnail do vídeo"
                                                    className="mb-2"
                                                    style={{
                                                        maxWidth: 'auto',
                                                        height: 'auto',
                                                    }}
                                                    loading="lazy"
                                                />
                                            </Link>
                                            <CardTitle className="text-md">
                                                <Link
                                                    href={video.video_url}
                                                    target="_blank"
                                                >
                                                    {video.title}
                                                </Link>
                                            </CardTitle>
                                            <CardDescription className="text-sm">
                                                {video.channelTitle}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardFooter>
                                            <p>Subs: {video.channelSubs}</p>
                                            <p>
                                                Views:{' '}
                                                <strong className="text-green-500">
                                                    {video.viewCount}
                                                </strong>
                                            </p>
                                            <p>Position: {video.position}</p>
                                        </CardFooter>
                                    </Card>
                                ))
                            )}
                        </div>
                        <div className="flex flex-col space-y-2"></div>
                    </div>
                </div>
            </div>
        </main>
    )
}
