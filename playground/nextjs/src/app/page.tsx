'use client'

import { EditableArea, EditableCancelTrigger, EditableEditTrigger, EditableInput, EditablePreview, EditableRoot, EditableSubmitTrigger } from 'reka-ui-react'
import { AccordionContent, AccordionHeader, AccordionItem, AccordionRoot, AccordionTrigger } from '../../../../packages/react/src/Accordion'

export default function Home() {
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
      </div>
    </div>
  )
}
