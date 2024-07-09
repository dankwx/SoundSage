import Header from '../components/Header/Header'
import Sidebar from '../components/Sidebar/Sidebar'
import GetLatestClaims from '@/components/GetLatestClaims/GetLatestClaims'
import ClaimTrack from '@/components/ClaimTrack/ClaimTrack'

export default async function Home() {
    return (
        <main className="flex min-h-screen flex-col">
            <Header />
            <div className="flex min-h-full w-full flex-1 flex-col justify-between font-mono text-sm">
                <div className="flex h-full flex-1">
                    <Sidebar />
                    <div className="flex flex-col">
                        {/* <GetLatestClaims /> */}
                        <ClaimTrack />
                    </div>
                </div>
            </div>
        </main>
    )
}
