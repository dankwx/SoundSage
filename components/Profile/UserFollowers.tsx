import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import FollowButton from './FollowButton'

interface User {
    id: string
    first_name: string
    last_name: string
    avatar_url: string | null
    username: string | null
    followingId: string
}

interface Rating {
    id: string
    rating: number
}

interface FollowersFollowingSectionProps {
    totalFollowers: User[]
    totalFollowing: User[]
    rating: Rating[]
    isOwnProfile: boolean
    isLoggedIn: boolean
    followingId: string
}

const FollowersFollowingSection: React.FC<FollowersFollowingSectionProps> = ({
    totalFollowers,
    totalFollowing,
    rating,
    isOwnProfile,
    isLoggedIn,
    followingId,
}) => {
    console.log('loggeid do componente baixo', isLoggedIn)
    return (
        <div className="mt-2 flex items-center space-x-4 font-sans">
            <Dialog>
                <DialogTrigger asChild>
                    <div className="flex cursor-pointer flex-col items-center hover:opacity-80">
                        <span className="text-sm text-gray-600">
                            {totalFollowers.length} Seguidores
                        </span>
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Seguidores</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        {totalFollowers.map((user) => (
                            <div
                                key={user.id}
                                className="flex flex-row items-center justify-between"
                            >
                                <div className="flex items-center justify-center">
                                    <Avatar className="mr-4 h-16 w-16 overflow-hidden rounded-full">
                                        {user.avatar_url ? (
                                            <AvatarImage
                                                src={user.avatar_url}
                                            />
                                        ) : (
                                            <AvatarFallback>PF</AvatarFallback>
                                        )}
                                    </Avatar>

                                    <a
                                        href={`/user/${user.last_name}`}
                                        className="text-gray-800 hover:text-blue-500"
                                    >
                                        {user.last_name}
                                    </a>
                                </div>

                                <Button variant="outline" size="sm">
                                    Unfollow
                                </Button>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog>
                <DialogTrigger asChild>
                    <div className="flex">
                        <div className="flex cursor-pointer flex-row items-center hover:opacity-80">
                            <span className="text-sm text-gray-600">
                                {totalFollowing.length} Seguindo
                            </span>
                        </div>
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Seguindo</DialogTitle>
                    </DialogHeader>

                    <div className="py-4">
                        {totalFollowing.map((user) => (
                            <div
                                key={user.id}
                                className="flex flex-row items-center justify-between"
                            >
                                <div className="flex items-center justify-center">
                                    <Avatar className="mr-4 h-16 w-16 overflow-hidden rounded-full">
                                        {user.avatar_url ? (
                                            <AvatarImage
                                                src={
                                                    user.avatar_url
                                                        ? user.avatar_url
                                                        : 'https://tqprioqqitimssshcrcr.supabase.co/storage/v1/object/public/user-profile-images/default.jpg'
                                                }
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <AvatarFallback>PF</AvatarFallback>
                                        )}
                                    </Avatar>

                                    <a
                                        href={`/user/${user.last_name}`}
                                        className="text-gray-800 hover:text-blue-500"
                                    >
                                        {user.last_name}
                                    </a>
                                </div>
                                {isOwnProfile && !isLoggedIn && (
                                    <div>
                                        <FollowButton
                                            followingId={user.id}
                                            initialIsFollowing={true} // Você pode ajustar isso conforme necessário
                                            type="text"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
            <div>
                <Badge variant="secondary">
                    {rating.length > 0 ? rating[0].rating : 'N/A'} points
                </Badge>
            </div>
        </div>
    )
}

export default FollowersFollowingSection
