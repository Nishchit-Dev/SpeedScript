import { useEffect, useState } from 'react'

const useBeta = () => {
    const [betaTester, setBetaTester] = useState(false)

    useEffect(() => {
        function isBetaRoute() {
            if (typeof window !== 'undefined') {
                const urlParams = new URLSearchParams(window.location.search)
                return urlParams.get('beta') === '1'
            }
            return false
        }
        if (isBetaRoute()) {
            const beta = localStorage.getItem('Beta') || 'false'

            if (!betaTester && !JSON.parse(beta)) {
                localStorage.setItem('Beta', JSON.stringify(true))
                setBetaTester(true)
            }
        }
    }, [])

    return { betaTester }
}

export default useBeta
