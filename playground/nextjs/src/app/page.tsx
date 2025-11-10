'use client'

import { useEffect, useRef, useState } from 'react'
import { EditableArea, EditableCancelTrigger, EditableEditTrigger, EditableInput, EditablePreview, EditableRoot, EditableSubmitTrigger } from 'reka-ui-react'
import { AccordionContent, AccordionHeader, AccordionItem, AccordionRoot, AccordionTrigger } from '../../../../packages/react/src/Accordion'
import { AspectRatio } from '../../../../packages/react/src/AspectRatio'
import { AvatarFallback, AvatarImage, AvatarRoot } from '../../../../packages/react/src/Avatar'
import { CheckboxGroupRoot, CheckboxIndicator, CheckboxRoot } from '../../../../packages/react/src/Checkbox'
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from '../../../../packages/react/src/Collapsible'
import { PaginationEllipsis, PaginationFirst, PaginationLast, PaginationList, PaginationListItem, PaginationNext, PaginationPrev, PaginationRoot } from '../../../../packages/react/src/Pagination'
import { ProgressIndicator, ProgressRoot } from '../../../../packages/react/src/Progress'
import { RadioGroupIndicator, RadioGroupItem, RadioGroupRoot } from '../../../../packages/react/src/RadioGroup'
import { Separator } from '../../../../packages/react/src/Separator'
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from '../../../../packages/react/src/Slider'
import { SwitchRoot, SwitchThumb } from '../../../../packages/react/src/Switch'
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from '../../../../packages/react/src/Tabs'

function ChevronLeft() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64038 12.0535 8.32396 12.0433 8.1351 11.8419L4.3851 7.84188C4.20408 7.64955 4.20408 7.35027 4.3851 7.15794L8.1351 3.15794C8.32396 2.9565 8.64038 2.94629 8.84182 3.13514Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.15803 3.13508C6.35953 2.94621 6.67605 2.95642 6.86492 3.15792L10.6149 7.15792C10.7959 7.3502 10.7959 7.64949 10.6149 7.84182L6.86492 11.8418C6.67605 12.0433 6.35953 12.0535 6.15803 11.8646C5.95654 11.6757 5.94633 11.3592 6.1352 11.1577L9.56503 7.49985L6.1352 3.84182C5.94633 3.64032 5.95654 3.32381 6.15803 3.13508Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  )
}

function DoubleChevronLeft() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7L6.85355 10.1464C7.04882 10.3417 7.04882 10.6583 6.85355 10.8536C6.65829 11.0488 6.34171 11.0488 6.14645 10.8536L2.14645 6.85355C1.95118 6.65829 1.95118 6.34171 2.14645 6.14645L6.14645 2.14645C6.34171 1.95118 6.65829 1.95118 6.85355 2.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
      <path d="M12.8536 3.14645C13.0488 3.34171 13.0488 3.65829 12.8536 3.85355L9.70711 7L12.8536 10.1464C13.0488 10.3417 13.0488 10.6583 12.8536 10.8536C12.6583 11.0488 12.3417 11.0488 12.1464 10.8536L8.14645 6.85355C7.95118 6.65829 7.95118 6.34171 8.14645 6.14645L12.1464 2.14645C12.3417 1.95118 12.6583 1.95118 12.8536 2.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  )
}

function DoubleChevronRight() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.14645 11.1464C1.95118 10.9512 1.95118 10.6346 2.14645 10.4394L5.29289 7.29289L2.14645 4.14645C1.95118 3.95118 1.95118 3.6346 2.14645 3.43934C2.34171 3.24408 2.65829 3.24408 2.85355 3.43934L6.85355 7.43934C7.04882 7.6346 7.04882 7.95118 6.85355 8.14645L2.85355 12.1464C2.65829 12.3417 2.34171 12.3417 2.14645 12.1464Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
      <path d="M8.14645 11.1464C7.95118 10.9512 7.95118 10.6346 8.14645 10.4394L11.2929 7.29289L8.14645 4.14645C7.95118 3.95118 7.95118 3.6346 8.14645 3.43934C8.34171 3.24408 8.65829 3.24408 8.85355 3.43934L12.8536 7.43934C13.0488 7.6346 13.0488 7.95118 12.8536 8.14645L8.85355 12.1464C8.65829 12.3417 8.34171 12.3417 8.14645 12.1464Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  )
}

export default function Home() {
  const [progressValue, setProgressValue] = useState(0)
  const [sliderValue, setSliderValue] = useState([50])
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

        <div className="w-full h-full grid place-items-center rounded-xl border border-stone-700 p-6 min-h-[300px]">
          <div className="flex flex-col gap-4 items-center">
            <label htmlFor="airplane-mode" className="text-white">Airplane mode</label>
            <SwitchRoot
              id="airplane-mode"
              aria-label="Airplane mode"
              className="w-11 h-6 rounded-full bg-stone-700 data-[state=checked]:bg-white transition-colors focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
            >
              <SwitchThumb className="block w-5 h-5 bg-white rounded-full translate-x-0.5 data-[state=checked]:translate-x-[22px] data-[state=checked]:bg-black transition-all" />
            </SwitchRoot>
          </div>
        </div>

        <div className="w-full h-full grid place-items-center rounded-xl border border-stone-700 p-6 min-h-[300px]">
          <AvatarRoot className="bg-blackA3 inline-flex h-[45px] w-[45px] select-none items-center justify-center overflow-hidden rounded-full align-middle">
            <AvatarImage
              className="h-full w-full rounded-[inherit] object-cover"
              src="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
              alt="Colm Tuite"
            />
            <AvatarFallback className="text-violet11 leading-1 flex h-full w-full items-center justify-center bg-white text-[15px] font-medium">
              CT
            </AvatarFallback>
          </AvatarRoot>
        </div>

        <div className="w-full h-full grid place-items-center rounded-xl border border-stone-700 p-6 min-h-[300px]">
          <CheckboxGroupRoot className="flex flex-col gap-2.5">
            <div className="flex flex-row gap-4 items-center">
              <CheckboxRoot value="option1" id="option1" aria-label="Option 1" className="shadow-blackA7 hover:bg-violet3 flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-[4px] bg-white shadow-[0_2px_10px] outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black focus:shadow-[0_0_0_3px_rgba(255,255,255,0.5)]">
                <CheckboxIndicator className="bg-white h-full w-full rounded flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.022C7.29783 11.1911 7.13556 11.3197 6.93852 11.3864C6.74147 11.4531 6.52387 11.4531 6.32682 11.3864C6.12978 11.3197 5.96751 11.1911 5.86735 11.022L3.35735 7.36998C3.16845 7.08108 3.24955 6.69374 3.53845 6.50484C3.82735 6.31594 4.21469 6.39704 4.40359 6.68594L6.59852 9.78484L10.6016 3.91084C10.7905 3.62194 11.1778 3.54084 11.4669 3.72684Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                  </svg>
                </CheckboxIndicator>
              </CheckboxRoot>
              <label htmlFor="option1" className="select-none text-white cursor-pointer">
                Option 1
              </label>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <CheckboxRoot value="option2" id="option2" aria-label="Option 2" className="shadow-blackA7 hover:bg-violet3 flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-[4px] bg-white shadow-[0_2px_10px] outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black focus:shadow-[0_0_0_3px_rgba(255,255,255,0.5)]">
                <CheckboxIndicator className="bg-white h-full w-full rounded flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.022C7.29783 11.1911 7.13556 11.3197 6.93852 11.3864C6.74147 11.4531 6.52387 11.4531 6.32682 11.3864C6.12978 11.3197 5.96751 11.1911 5.86735 11.022L3.35735 7.36998C3.16845 7.08108 3.24955 6.69374 3.53845 6.50484C3.82735 6.31594 4.21469 6.39704 4.40359 6.68594L6.59852 9.78484L10.6016 3.91084C10.7905 3.62194 11.1778 3.54084 11.4669 3.72684Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                  </svg>
                </CheckboxIndicator>
              </CheckboxRoot>
              <label htmlFor="option2" className="select-none text-white cursor-pointer">
                Option 2
              </label>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <CheckboxRoot value="option3" id="option3" aria-label="Option 3" className="shadow-blackA7 hover:bg-violet3 flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-[4px] bg-white shadow-[0_2px_10px] outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black focus:shadow-[0_0_0_3px_rgba(255,255,255,0.5)]">
                <CheckboxIndicator className="bg-white h-full w-full rounded flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.022C7.29783 11.1911 7.13556 11.3197 6.93852 11.3864C6.74147 11.4531 6.52387 11.4531 6.32682 11.3864C6.12978 11.3197 5.96751 11.1911 5.86735 11.022L3.35735 7.36998C3.16845 7.08108 3.24955 6.69374 3.53845 6.50484C3.82735 6.31594 4.21469 6.39704 4.40359 6.68594L6.59852 9.78484L10.6016 3.91084C10.7905 3.62194 11.1778 3.54084 11.4669 3.72684Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                  </svg>
                </CheckboxIndicator>
              </CheckboxRoot>
              <label htmlFor="option3" className="select-none text-white cursor-pointer">
                Option 3
              </label>
            </div>
          </CheckboxGroupRoot>
        </div>

        <div className="w-full h-full grid place-items-center rounded-xl border border-stone-700 p-6 min-h-[300px]">
          <CollapsibleRoot className="w-full max-w-md">
            <CollapsibleTrigger className="w-full px-4 py-2 text-left text-white bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors">
              Collapsible Trigger
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 px-4 py-2 text-gray-300 bg-stone-800 rounded-lg">
              This is the collapsible content. Click the trigger to toggle visibility.
            </CollapsibleContent>
          </CollapsibleRoot>
        </div>

        <div className="w-full h-full grid place-items-center rounded-xl border border-stone-700 p-6 min-h-[300px]">
          <div className="w-full max-w-[300px]">
            <div className="text-white text-[15px] leading-5 font-medium">
              Reka UI
            </div>
            <div className="text-white text-[15px] leading-5">
              An open-source UI component library.
            </div>
            <Separator
              decorative
              className="bg-[#d7cff9] data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-[15px]"
            />
            <div className="flex h-5 items-center">
              <div className="text-white text-[15px] leading-5">
                Blog
              </div>
              <Separator
                className="bg-[#d7cff9] data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px mx-[15px]"
                decorative
                orientation="vertical"
              />
              <div className="text-white text-[15px] leading-5">
                Docs
              </div>
              <Separator
                className="bg-[#d7cff9] data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px mx-[15px]"
                decorative
                orientation="vertical"
              />
              <div className="text-white text-[15px] leading-5">
                Source
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-full grid place-items-center rounded-xl border border-stone-700 p-6 min-h-[300px]">
          <AspectRatio ratio={16 / 9} className="w-full max-w-md">
            <img
              className="h-full w-full object-cover rounded-lg"
              src="https://images.unsplash.com/photo-1498855926480-d98e83099315?w=800&dpr=2&q=80"
              alt="Landscape photograph by Tobias Tullius"
            />
          </AspectRatio>
        </div>

        <div className="w-full h-full grid place-items-center rounded-xl border border-stone-700 p-6 min-h-[300px]">
          <div className="w-full max-w-md flex flex-col gap-4">
            <div className="text-white text-[15px] leading-5 font-medium">
              Volume:
              {' '}
              {sliderValue[0]}
            </div>
            <SliderRoot
              value={sliderValue}
              onChange={v => v && setSliderValue(v)}
              className="relative flex items-center select-none touch-none w-full h-5"
              min={0}
              max={100}
              step={1}
            >
              <SliderTrack className="bg-stone-700 relative grow rounded-full h-[3px]">
                <SliderRange className="absolute bg-white rounded-full h-full" />
              </SliderTrack>
              <SliderThumb className="block w-5 h-5 bg-white shadow-[0_2px_10px] shadow-blackA7 rounded-[10px] hover:bg-stone-100 focus:outline-none focus:shadow-[0_0_0_5px] focus:shadow-white/20" />
            </SliderRoot>
          </div>
        </div>

        <div className="w-full h-full grid place-items-center rounded-xl border border-stone-700 p-6 min-h-[300px]">
          <RadioGroupRoot className="flex flex-col gap-2.5" aria-label="View density" orientation="vertical">
            <div className="flex items-center">
              <RadioGroupItem
                id="r1"
                value="default"
                className="bg-white w-[25px] h-[25px] rounded-full shadow-[0_2px_10px] shadow-blackA7 hover:bg-violet3 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black focus:shadow-[0_0_0_3px_rgba(255,255,255,0.5)] focus:outline-none outline-none cursor-default data-[disabled]:bg-gray-400"
              >
                <RadioGroupIndicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[11px] after:h-[11px] after:rounded-[50%] after:bg-black" />
              </RadioGroupItem>
              <label htmlFor="r1" className="text-white text-[15px] leading-none pl-[15px] cursor-pointer">
                Default
              </label>
            </div>
            <div className="flex items-center">
              <RadioGroupItem
                id="r2"
                value="comfortable"
                disabled
                className="bg-white w-[25px] h-[25px] rounded-full shadow-[0_2px_10px] shadow-blackA7 hover:bg-violet3 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black focus:shadow-[0_0_0_3px_rgba(255,255,255,0.5)] focus:outline-none outline-none cursor-default data-[disabled]:bg-gray-400"
              >
                <RadioGroupIndicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[11px] after:h-[11px] after:rounded-[50%] after:bg-black" />
              </RadioGroupItem>
              <label htmlFor="r2" className="text-white text-[15px] leading-none pl-[15px] cursor-pointer">
                Comfortable
              </label>
            </div>
            <div className="flex items-center">
              <RadioGroupItem
                id="r3"
                value="compact"
                className="bg-white w-[25px] h-[25px] rounded-full shadow-[0_2px_10px] shadow-blackA7 hover:bg-violet3 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black focus:shadow-[0_0_0_3px_rgba(255,255,255,0.5)] focus:outline-none outline-none cursor-default"
              >
                <RadioGroupIndicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[11px] after:h-[11px] after:rounded-[50%] after:bg-black" />
              </RadioGroupItem>
              <label htmlFor="r3" className="text-white text-[15px] leading-none pl-[15px] cursor-pointer">
                Compact
              </label>
            </div>
          </RadioGroupRoot>
        </div>

        <div className="w-full h-full grid place-items-center rounded-xl border border-stone-700 p-6 min-h-[300px] lg:col-span-2">
          <div className="w-full max-w-[700px] flex items-center py-12 sm:py-[100px] justify-center">
            <PaginationRoot itemsPerPage={10} total={100} siblingCount={1} showEdges defaultPage={2}>
              <PaginationList className="flex items-center gap-1 text-white">
                {({ items }: { items: Array<{ type: 'ellipsis' } | { type: 'page', value: number }> }) => (
                  <>
                    <PaginationFirst className="w-9 h-9 flex items-center justify-center bg-transparent hover:bg-white dark:hover:bg-stone-700/70 hover:text-black transition disabled:opacity-50 rounded-lg text-white">
                      <DoubleChevronLeft />
                    </PaginationFirst>
                    <PaginationPrev className="w-9 h-9 flex items-center justify-center bg-transparent hover:bg-white dark:hover:bg-stone-700/70 hover:text-black transition mr-4 disabled:opacity-50 rounded-lg text-white">
                      <ChevronLeft />
                    </PaginationPrev>
                    {items.map((pageItem, index) => (
                      pageItem.type === 'page'
                        ? (
                            <PaginationListItem
                              key={index}
                              value={pageItem.value}
                              className="w-9 h-9 border dark:border-stone-800 rounded-lg data-[selected]:!bg-white data-[selected]:shadow-sm data-[selected]:!text-black hover:bg-white dark:hover:bg-stone-700/70 hover:text-black transition flex items-center justify-center text-white"
                            >
                              {pageItem.value}
                            </PaginationListItem>
                          )
                        : (
                            <PaginationEllipsis
                              key={index}
                              className="w-9 h-9 flex items-center justify-center text-white"
                            >
                              …
                            </PaginationEllipsis>
                          )
                    ))}
                    <PaginationNext className="w-9 h-9 flex items-center justify-center bg-transparent hover:bg-white dark:hover:bg-stone-700/70 hover:text-black transition ml-4 disabled:opacity-50 rounded-lg text-white">
                      <ChevronRight />
                    </PaginationNext>
                    <PaginationLast className="w-9 h-9 flex items-center justify-center bg-transparent hover:bg-white dark:hover:bg-stone-700/70 hover:text-black transition disabled:opacity-50 rounded-lg text-white">
                      <DoubleChevronRight />
                    </PaginationLast>
                  </>
                )}
              </PaginationList>
            </PaginationRoot>
          </div>
        </div>
      </div>
    </div>
  )
}
