/**
 * v0 by Vercel.
 * @see https://v0.dev/t/nIFhuynT24G
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function Modules() {
  const [customSections, setCustomSections] = useState([
    {
      title: "",
      link: "",
      resources: "",
    },
  ])
  const handleAddCustomSection = () => {
    setCustomSections([
      ...customSections,
      {
        title: "",
        link: "",
        resources: "",
      },
    ])
  }
  const handleCustomSectionChange = (index, field, value) => {
    const updatedCustomSections = [...customSections]
    updatedCustomSections[index][field] = value
    setCustomSections(updatedCustomSections)
  }
  return (
    <main className="w-full max-w-4xl mx-auto py-12 md:py-20 lg:py-28 px-4 md:px-6">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
              Easy
            </div>
            <h3 className="text-2xl font-bold">Easy Section</h3>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="easy-title">Title</Label>
              <Input type="text" id="easy-title" placeholder="Enter a title" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="easy-link">Link</Label>
              <Input type="text" id="easy-link" placeholder="Enter a link" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="easy-resources">Resources</Label>
              <Textarea id="easy-resources" placeholder="Enter resources" rows={3} />
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              Medium
            </div>
            <h3 className="text-2xl font-bold">Medium Section</h3>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="medium-title">Title</Label>
              <Input type="text" id="medium-title" placeholder="Enter a title" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="medium-link">Link</Label>
              <Input type="text" id="medium-link" placeholder="Enter a link" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="medium-resources">Resources</Label>
              <Textarea id="medium-resources" placeholder="Enter resources" rows={3} />
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-red-100 px-3 py-1 text-sm font-medium text-red-800 dark:bg-red-900 dark:text-red-200">
              Hard
            </div>
            <h3 className="text-2xl font-bold">Hard Section</h3>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="hard-title">Title</Label>
              <Input type="text" id="hard-title" placeholder="Enter a title" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hard-link">Link</Label>
              <Input type="text" id="hard-link" placeholder="Enter a link" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hard-resources">Resources</Label>
              <Textarea id="hard-resources" placeholder="Enter resources" rows={3} />
            </div>
          </div>
        </div>
        {customSections.map((section, index) => (
          <div key={index} className="space-y-6">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Custom
              </div>
              <h3 className="text-2xl font-bold">Custom Section {index + 1}</h3>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor={`custom-title-${index}`}>Title</Label>
                <Input
                  type="text"
                  id={`custom-title-${index}`}
                  placeholder="Enter a title"
                  value={section.title}
                  onChange={(e) => handleCustomSectionChange(index, "title", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`custom-link-${index}`}>Link</Label>
                <Input
                  type="text"
                  id={`custom-link-${index}`}
                  placeholder="Enter a link"
                  value={section.link}
                  onChange={(e) => handleCustomSectionChange(index, "link", e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`custom-resources-${index}`}>Resources</Label>
                <Textarea
                  id={`custom-resources-${index}`}
                  placeholder="Enter resources"
                  rows={3}
                  value={section.resources}
                  onChange={(e) => handleCustomSectionChange(index, "resources", e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
        <div className="col-span-4 flex justify-end">
          <Button onClick={handleAddCustomSection}>Add Custom Section</Button>
        </div>
      </div>
    </main>
  )
}