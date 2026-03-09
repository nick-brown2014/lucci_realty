const Footer = () => (
  <div className='w-full bg-foreground px-8 pt-4 pb-12 flex flex-col items-center'>
    <div className='justify-center flex w-full mt-6'>
      <div className='justify-between lg:items-center gap-8 max-w-[1200px] w-full flex flex-col lg:flex-row'>
        <div className='flex flex-col gap-4'>
          <p className='text-background text-sm hidden lg:block'>
            Built by{' '}
            <a
              href='https://sunnybrown.dev'
              target='_blank'
              rel='noopener noreferrer'
              className='text-amber-500 hover:text-amber-400 transition-colors'
            >
              Sunshine Web Development
            </a>
          </p>
        </div>
        <div className='flex flex-col gap-2 ml-6 lg:ml-0 lg:self-end max-w-[600px]'>
          <p className='text-background text-sm block lg:hidden'>
            Built by{' '}
            <a
              href='https://sunnybrown.dev'
              target='_blank'
              rel='noopener noreferrer'
              className='text-amber-500 hover:text-amber-400 transition-colors'
            >
              Sunshine Web Development
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
)

export default Footer