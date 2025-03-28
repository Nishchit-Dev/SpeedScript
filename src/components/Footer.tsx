import Image from 'next/image'

const Footer = () => {
    return (
        <>
            <div className=' pt-10'>
                <Image
                    src={'/footer/Footerlogo.svg'}
                    height={0}
                    width={0}
                    alt=""
                    className="w-full h-max "
                />
            </div>
        </>
    )
}

export default Footer
