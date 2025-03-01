import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { CrownIcon } from 'lucide-react'
import clsx from 'clsx'
import { useUser } from '@clerk/nextjs'

import useRandomColor from '@/app/hooks/useRandomColor'
import { getBadgeImage } from '@/components/BadgeComponent'

const GameState = {
  CONNECTING: 'connecting',
  WAITING: 'waiting',
  COUNTDOWN: 'countdown',
  IN_PROGRESS: 'in_progress',
  FINISHED: 'finished',
  GAME_RESET: 'game_reset',
} as const

interface ScoreBoardMessage {
  username: string
  wpm: number
}

const AdminScoreBoard = ({
  roomData,
  isAdmin,
  roomAdmin,
}: {
  roomData: ScoreBoardMessage[]
  isAdmin: boolean
  roomAdmin: string
}) => {
  const { user } = useUser()
  const { colors } = useRandomColor()

  // Local state to store and sort the scoreboard data
  const [scoreData, setScoreData] = useState<ScoreBoardMessage[]>([])

  useEffect(() => {
    // Sort roomData by descending WPM whenever roomData changes
    const sorted = [...roomData].sort((a, b) => b.wpm - a.wpm)
    setScoreData(sorted)
  }, [roomData])

  return (
    <div className="flex flex-1 justify-center items-center">
      {scoreData.length <= 0 ? null : (
        <div className="m-5 font-jetBrainsMono w-max flex flex-col items-center justify-center">
          {/* AnimatePresence helps with mount/unmount animations; 
              layout prop helps animate reordering within the list */}
          <AnimatePresence>
            {scoreData.map((player, index) => {
              const { username, wpm } = player
              const rank = index + 1

              return (
                <motion.div
                  key={username}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="flex w-full px-0 py-2 justify-center items-center"
                >
                  {/* Admin Crown */}
                  <div className="mr-3 ">
                    {roomAdmin === username ? (
                      <div className="p-2 rounded-full bg-yellow-500">
                        <CrownIcon size={18} />
                      </div>
                    ) : (
                      // Keep this div to preserve layout even for non-admin players
                      <div className="invisible p-2 rounded-full bg-yellow-500">
                        <CrownIcon size={18} />
                      </div>
                    )}
                  </div>

                  {/* Rank + Trophy */}
                  <div className="flex flex-row gap-4 justify-center items-center">
                    <p className="text-black/70 font-semibold">#{rank}</p>
                    <Image
                      src={`/throphies/badges/${getBadgeImage(
                        Math.round(Number(wpm))
                      )}`}
                      alt="badge"
                      width={60}
                      height={60}
                    />
                  </div>

                  {/* Username & WPM */}
                  <div
                    className={clsx(
                      `flex p-2 flex-1 items-center justify-between gap-1 cursor-pointer`
                    )}
                  >
                    <p>{username}</p>
                    {user?.username === username ? (
                      <span className="bg-green-500 text-white rounded-full px-2 text-xs mr-3">
                        you
                      </span>
                    ) : null}
                    <span
                      className={clsx(
                        `${colors[index]} w-2 h-7 rounded-full flex`
                      )}
                    />
                    <span
                      className={clsx(
                        `bg-white w-12 h-12 rounded-full flex justify-center items-center`
                      )}
                    >
                      {wpm}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default AdminScoreBoard
