// app(dashboard)/track/[id]/page.tsx - versão com TrackPreview

import { createClient } from '@/utils/supabase/server'
import { fetchAuthData } from '@/utils/profileService'
import { fetchSpotifyTrackInfo, SpotifyTrack } from '@/utils/spotifyService'
import { countTrackOccurrences } from '@/utils/fetchTrackInfo'
import TrackClaimsMessages from '@/components/TrackClaimsMessages/TrackClaimsMessages'
import TrackClaimers from '@/components/TrackClaimers.tsx/TrackClaimers'
import TrackPreview from '@/components/TrackPreview/TrackPreview'

// UI Components from shadcn/ui
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
    Heart,
    Play,
    Share2,
    TrendingUp,
    Users,
    Clock,
    Calendar,
    Music,
    Award,
    Star,
} from 'lucide-react'

import Header from '@/components/Header/Header'
import Sidebar from '@/components/Sidebar/Sidebar'

export default async function TrackDetailsPage({
    params,
}: {
    params: { id: string }
}) {
    const { id: trackId } = params

    // Fetch authentication data
    const authData = await fetchAuthData()
    const isLoggedIn = authData?.user ? true : false

    // Fetch Spotify track information
    let trackInfo: SpotifyTrack | null = null
    if (trackId) {
        trackInfo = await fetchSpotifyTrackInfo(trackId)
        console.log({ trackInfo })
    }

    // Determine artist names and IDs
    const artists =
        trackInfo?.artists?.map((artist) => ({
            name: artist.name,
            id: artist.id,
        })) || []
    const artistNames =
        artists.map((artist) => artist.name).join(', ') ||
        'Artista Desconhecido'

    // Get album image URL
    const albumImageUrl =
        trackInfo?.album.images?.[0]?.url || '/placeholder.svg'

    // Fetch the total number of claims for this track
    let totalClaims = 0
    if (trackInfo?.uri) {
        totalClaims = await countTrackOccurrences(trackInfo.uri)
    }

    // Check if current user has already claimed this track
    let hasUserClaimed = false
    let userClaimPosition = null
    let userClaimYoutubeUrl = null

    if (isLoggedIn && trackInfo?.uri) {
        const supabase = createClient()
        const { data: userClaim, error } = await supabase
            .from('tracks')
            .select('position, youtube_url')
            .eq('user_id', authData.user?.id)
            .eq('track_uri', trackInfo.uri)
            .single()

        if (!error && userClaim) {
            hasUserClaimed = true
            userClaimPosition = userClaim.position
            userClaimYoutubeUrl = userClaim.youtube_url || null
        }
    }

    // Construct Spotify URL for the track
    const trackUrl = `https://open.spotify.com/track/${trackId}`

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid gap-8 lg:grid-cols-3">
                {/* Left Column - Music Info */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Hero Section */}
                    <Card className="overflow-hidden">
                        <CardContent className="p-0">
                            <div className="flex flex-col rounded-2xl bg-white p-8 shadow-sm dark:bg-slate-800 md:flex-row">
                                <div className="relative h-72 w-full md:w-72">
                                    <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-slate-800">
                                        <div className="group relative"></div>
                                        <Image
                                            src={albumImageUrl}
                                            alt={`Capa do álbum ${
                                                trackInfo?.album.name ||
                                                'Música'
                                            }`}
                                            fill
                                            className="rounded-xl shadow-lg"
                                        />
                                    </div>

                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity hover:opacity-100">
                                        <Button
                                            size="lg"
                                            className="h-16 w-16 rounded-full"
                                        >
                                            <Play className="h-6 w-6" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-4 p-6">
                                    <div>
                                        <Badge
                                            variant="secondary"
                                            className="mb-2"
                                        >
                                            <TrendingUp className="mr-1 h-3 w-3" />
                                            Em Alta
                                        </Badge>
                                        <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
                                            {trackInfo?.name ||
                                                'Música Desconhecida'}
                                        </h1>
                                        <p className="mb-1 text-xl text-gray-600">
                                            {artists.map((artist, index) => (
                                                <span key={artist.id}>
                                                    <Link
                                                        href={`/artist/${artist.id}`}
                                                        className="text-xl font-medium text-purple-600 dark:text-purple-400"
                                                    >
                                                        {artist.name}
                                                    </Link>
                                                    {index <
                                                        artists.length - 1 &&
                                                        ', '}
                                                </span>
                                            ))}
                                        </p>
                                        <p className="text-gray-500">
                                            {trackInfo?.album.name ||
                                                'Álbum Desconhecido'}{' '}
                                            •{' '}
                                            {trackInfo?.album.release_date
                                                ? new Date(
                                                      trackInfo.album.release_date
                                                  ).getFullYear()
                                                : 'Ano Desconhecido'}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {trackInfo
                                                ? `${Math.floor(
                                                      trackInfo.duration_ms /
                                                          60000
                                                  )}:${Math.floor(
                                                      (trackInfo.duration_ms %
                                                          60000) /
                                                          1000
                                                  )
                                                      .toString()
                                                      .padStart(2, '0')}`
                                                : 'N/A'}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            {trackInfo?.album.release_date ||
                                                'N/A'}
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        {trackInfo && (
                                            <TrackClaimsMessages
                                                trackUri={trackInfo.uri}
                                                trackUrl={trackUrl}
                                                trackTitle={trackInfo.name}
                                                artistName={artistNames}
                                                albumName={trackInfo.album.name}
                                                popularity={
                                                    trackInfo.popularity
                                                }
                                                trackThumbnail={albumImageUrl}
                                                initialClaimed={hasUserClaimed}
                                                userPosition={userClaimPosition}
                                                youtubeUrl={userClaimYoutubeUrl}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* NOVO: Track Preview Component */}
                    <TrackPreview trackId={trackId} />

                    {/* Stats Grid */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardContent className="p-6 text-center">
                                <div className="mb-2 text-3xl font-bold text-purple-600">
                                    {totalClaims}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Total de Reivindicações
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 text-center">
                                <div className="mb-2 text-3xl font-bold text-green-600">
                                    {trackInfo?.popularity || 'N/A'}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Popularidade Spotify
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 text-center">
                                <div className="mb-2 text-3xl font-bold text-orange-600">
                                    2.1B
                                </div>
                                <div className="text-sm text-gray-600">
                                    Reproduções Totais
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Popularity Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Tendência de Popularidade
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Popularidade Global</span>
                                    <span>
                                        {trackInfo?.popularity || 'N/A'}/100
                                    </span>
                                </div>
                                <Progress
                                    value={trackInfo?.popularity || 0}
                                    className="h-2"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Reivindicações esta semana</span>
                                    <span>156</span>
                                </div>
                                <Progress value={78} className="h-2" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Crescimento mensal</span>
                                    <span>+23%</span>
                                </div>
                                <Progress value={65} className="h-2" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Activity */}
                <div className="space-y-6">
                    {/* Recent Claims - substituído pelo TrackClaimers */}
                    {trackInfo && <TrackClaimers trackUri={trackInfo.uri} />}

                    {/* Top Claimers */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Award className="h-5 w-5" />
                                Top Reivindicadores
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                {
                                    name: 'MusicLover2024',
                                    claims: 47,
                                    rank: 1,
                                },
                                {
                                    name: 'SoundHunter',
                                    claims: 32,
                                    rank: 2,
                                },
                                {
                                    name: 'BeatCollector',
                                    claims: 28,
                                    rank: 3,
                                },
                            ].map((user, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3"
                                >
                                    <div
                                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                                            user.rank === 1
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : user.rank === 2
                                                  ? 'bg-gray-100 text-gray-800'
                                                  : 'bg-orange-100 text-orange-800'
                                        }`}
                                    >
                                        {user.rank}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {user.claims} reivindicações
                                        </p>
                                    </div>
                                    {user.rank === 1 && (
                                        <Star className="h-4 w-4 text-yellow-500" />
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Music Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Detalhes da Música</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">
                                    Gênero
                                </span>
                                <span className="text-sm font-medium">
                                    Synthpop, R&B
                                </span>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">
                                    Gravadora
                                </span>
                                <span className="text-sm font-medium">
                                    XO, Republic
                                </span>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">
                                    Produtores
                                </span>
                                <span className="text-sm font-medium">
                                    The Weeknd, Max Martin
                                </span>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">
                                    BPM
                                </span>
                                <span className="text-sm font-medium">171</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600">
                                    Chave
                                </span>
                                <span className="text-sm font-medium">
                                    F♯ menor
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
