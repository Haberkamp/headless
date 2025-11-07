'use client'

import { useEffect, useRef, useState } from 'react'
import { EditableArea, EditableCancelTrigger, EditableEditTrigger, EditableInput, EditablePreview, EditableRoot, EditableSubmitTrigger } from 'reka-ui-react'
import { AccordionContent, AccordionHeader, AccordionItem, AccordionRoot, AccordionTrigger } from '../../../../packages/react/src/Accordion'
import { ProgressIndicator, ProgressRoot } from '../../../../packages/react/src/Progress'
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from '../../../../packages/react/src/Tabs'

export default function Home() {
  const [progressValue, setProgressValue] = useState(0)
  const indexRef = useRef(0)

  useEffect(() => {
    const values = [0, 50, 100]

    const interval = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % values.length
      setProgressValue(values[indexRef.current])
    }, 2_000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full min-h-dvh flex flex-col items-center bg-black">
      <div className="max-w-6xl w-full flex flex-col lg:grid lg:grid-cols-3 gap-4 pt-40 pb-40">
        <div className="w-full h-full grid place-items-center rounded-xl border border-stone-700 p-6 min-h-[300px]">
          <EditableRoot defaultValue="Default Value" selectOnFocus>
            {props => (
              <>
                <EditableArea className="text-gray-300 dark:text-white w-[250px]">
                  <EditablePreview data-testid="preview" />

                  <EditableInput data-testid="input" className="w-full placeholder:text-700 dark:placeholder:text-white" />
                </EditableArea>

                {props.isEditing
                  ? (
                      <div className="flex gap-2">
                        <EditableSubmitTrigger className="inline-flex items-center justify-center rounded-lg font-medium text-sm px-3 py-2 bg-white text-sky-700 w-max cursor-pointer" />
                        <EditableCancelTrigger className="inline-flex items-center justify-center rounded-lg font-medium text-sm px-3 py-2 bg-red-600 text-white w-max cursor-pointer" />
                      </div>
                    )
                  : (
                      <EditableEditTrigger className="inline-flex items-center justify-center rounded-lg font-medium text-sm px-3 py-2 bg-white text-sky-700 w-max cursor-pointer" />
                    )}
              </>
            )}
          </EditableRoot>
        </div>

        <div className="w-full h-full grid place-items-center rounded-xl border border-stone-700 p-6 min-h-[300px]">
          <AccordionRoot className="w-full max-w-md">
            <AccordionItem value="item-1">
              <AccordionHeader>
                <AccordionTrigger className="text-white">
                  Accordion Item 1
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent className="text-gray-300 p-4">
                This is the content for accordion item 1.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionHeader>
                <AccordionTrigger className="text-white">
                  Accordion Item 2
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent className="text-gray-300 p-4">
                This is the content for accordion item 2.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionHeader>
                <AccordionTrigger className="text-white">
                  Accordion Item 3
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent className="text-gray-300 p-4">
                This is the content for accordion item 3.
              </AccordionContent>
            </AccordionItem>
          </AccordionRoot>
        </div>

        <div className="w-full h-full grid place-items-center rounded-xl border border-stone-700 p-6 min-h-[300px]">
          <TabsRoot defaultValue="account" className="w-full max-w-md">
            <TabsList className="flex border-b border-stone-600">
              <TabsTrigger value="account" className="px-4 py-2 text-gray-300 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white">
                Account
              </TabsTrigger>
              <TabsTrigger value="password" className="px-4 py-2 text-gray-300 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white">
                Password
              </TabsTrigger>
              <TabsTrigger value="settings" className="px-4 py-2 text-gray-300 data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-white">
                Settings
              </TabsTrigger>
            </TabsList>
            <TabsContent value="account" className="text-gray-300 p-4">
              Make changes to your account here. Click save when you&apos;re done.
            </TabsContent>
            <TabsContent value="password" className="text-gray-300 p-4">
              Change your password here. After saving, you&apos;ll be logged out.
            </TabsContent>
            <TabsContent value="settings" className="text-gray-300 p-4">
              Manage your application settings and preferences here.
            </TabsContent>
          </TabsRoot>
        </div>

        <div className="w-full h-full grid place-items-center rounded-xl border border-stone-700 p-6 min-h-[300px]">
          <ProgressRoot modelValue={progressValue} className="rounded-full relative h-4 w-full overflow-hidden bg-white dark:bg-stone-950 border border-muted">
            <ProgressIndicator
              className="indicator rounded-full block relative w-full h-full bg-green-500 transition-transform overflow-hidden duration-[660ms] ease-[cubic-bezier(0.65,0,0.35,1)] after:animate-progress after:content-[''] after:absolute after:inset-0 after:bg-[linear-gradient(-45deg,_rgba(255,255,255,0.2)_25%,_transparent_25%,_transparent_50%,_rgba(255,255,255,0.2)_50%,_rgba(255,255,255,0.2)_75%,_transparent_75%,_transparent)] after:bg-[length:30px_30px]"
              style={{ transform: `translateX(-${100 - progressValue}%)` }}
            />
          </ProgressRoot>
        </div>
      </div>
    </div>
  )
}
