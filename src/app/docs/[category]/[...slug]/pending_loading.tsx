import React from 'react'

const Loading = () => {
  return (
    <div className="w-full h-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="h-full shadow rounded-md p-4 mx-auto">
        <div className="animate-pulse px-4 flex flex-col">
          <div className="my-6 h-4 w-1/5 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded col-span-2"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded col-span-1"></div>
              </div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Loading
