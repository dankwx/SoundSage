import React from 'react'
import { fetchSongs } from '@/utils/fetchSongs'
import { Badge } from '../ui/badge'
import { CircleIcon, ClockIcon, StarIcon, TrendingUpIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'

type Song = {
    id: string
    track_url: string
    track_uri: string
    track_title: string
    artist_name: string
    album_name: string
    popularity: number
    discover_rating: number,
    track_thumbnail: string
    claimedat: string
}

type SongsListProps = {
    songs: Song[]
}

const SongsList: React.FC<SongsListProps> = ({ songs }) => {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {songs.map((song) => (
                <Card key={song.id} className="overflow-hidden">
                    <div className="relative aspect-square">
                        <img
                            src={song.track_thumbnail}
                            alt={song.track_title}
                            className="object-cover"
                            style={{ aspectRatio: '1/1', objectFit: 'cover' }}
                        />

                        <div className="absolute inset-0 flex items-center justify-center bg-black/70 p-4 opacity-0 transition-opacity hover:opacity-100">
                            <div className="space-y-2 text-center text-white">
                                <div className="flex items-center justify-center gap-2">
                                    <ClockIcon className="h-5 w-5" />
                                    <span className="text-sm">
                                        Claimed on:{' '}
                                        {new Date(
                                            song.claimedat
                                        ).toLocaleDateString('pt-BR')}
                                    </span>
                                </div>
                                <div className="flex items-center justify-center gap-2">
                                    <TrendingUpIcon className="h-5 w-5" />
                                    <span className="text-sm">
                                        Discover Score: {song.discover_rating}
                                    </span>
                                </div>
                                <div className="mt-2 text-xs opacity-75">
                                    {song.popularity > 80
                                        ? '🔥 Hot track! Trending worldwide'
                                        : song.popularity > 50
                                          ? '🚀 Gaining momentum'
                                          : '🌱 Underground gem'}
                                </div>
                            </div>
                        </div>
                    </div>
                    <CardContent className="p-4">
                        <h3 className="truncate font-semibold">
                            {song.track_title}
                        </h3>
                        <p className="truncate text-sm text-muted-foreground">
                            {song.artist_name}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                            <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-800"
                            >
                                <CircleIcon className="mr-1 h-3 w-3 -translate-x-1 animate-pulse fill-green-300 text-green-300" />
                                Listened before it went viral
                            </Badge>
                            <Badge
                                variant="secondary"
                                className="bg-orange-100 text-orange-800"
                            >
                                <StarIcon className="mr-1 h-3 w-3 -translate-x-1 animate-pulse fill-orange-300 text-orange-300" />
                                Rare find
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export async function getServerSideProps(context: {
    params: { userId: string }
}) {
    const { userId } = context.params
    const songs = await fetchSongs(userId)
    return { props: { songs } }
}

export default SongsList
