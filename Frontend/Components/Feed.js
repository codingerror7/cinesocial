
import React from 'react'
import Herocard from './Herocard'
import Postcard from './Postcard'

const Feed = () => {
  return (
    <>
      <div className="w-[800px]
max-sm:w-full
mx-auto
max-sm:ml-0
px-3
max-sm:px-1
py-8
max-sm:py-2
grid
grid-cols-1
xl:grid-cols-[1fr_320px]
gap-4
overflow-x-hidden">

        {/* LEFT FEED */}
        <div className="max-sm:w-full">
          <Herocard />

          <div className="space-y-5 mt-12 lg:mt-0 max-sm:space-y-4">
            <Postcard />
          </div>
        </div>

      </div>
    </>
  )
}

export default Feed