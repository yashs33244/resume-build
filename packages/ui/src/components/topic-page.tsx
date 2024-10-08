/**
* This code was generated by v0 by Vercel.
* @see https://v0.dev/t/CKEnVS2VO8z
* Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
*/

/** Add fonts into your Next.js project:

import { Libre_Franklin } from 'next/font/google'
import { Archivo } from 'next/font/google'

libre_franklin({
  subsets: ['latin'],
  display: 'swap',
})

archivo({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
import { Card, CardContent } from "@ui/components/ui/card"

export function Topicpage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <Card className="flex flex-col md:flex-row items-center bg-background shadow-lg rounded-lg overflow-hidden">
            <img
              src="/placeholder.svg"
              alt="Main Topic"
              width={500}
              height={300}
              className="w-full md:w-1/2 h-64 md:h-auto object-cover"
            />
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-2">Main Topic</h2>
              <p className="text-muted-foreground mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut risus in augue luctus venenatis.
              </p>
            </div>
          </Card>
        </div>
        <div className="col-span-1 bg-background shadow-lg rounded-lg overflow-hidden">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">Subtopic 1</h3>
              <p className="text-muted-foreground">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-1 bg-background shadow-lg rounded-lg overflow-hidden">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">Subtopic 2</h3>
              <p className="text-muted-foreground">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-1 bg-background shadow-lg rounded-lg overflow-hidden">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">Subtopic 3</h3>
              <p className="text-muted-foreground">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
