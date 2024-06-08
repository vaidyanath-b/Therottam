/**
 * v0 by Vercel.
 * @see https://v0.dev/t/xw2xOHpiyaU
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link"
import {prisma} from "@/lib/prisma" 
const getData = async () => {
    const quizes = await prisma.quiz.findMany() // need change include quizTopic
    return quizes
}

export default async function Component() {
  const quizes = await getData();
  return (
    <div className="w-full max-w-5xl mx-auto py-12 md:py-16 lg:py-20 px-4 md:px-6">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Your Quizes</h1>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto">
            Quizes created by you
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {quizes.map((quiz) => (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">{quiz.id}</h2> {/* change needed */}
                <p className="text-gray-500 mb-4">{"description"}</p>  
                <Link
                  href={`/quiz/${quiz.id}`}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  prefetch={false}
                >
                  View
                </Link>
              </div>
    </div>
  ))}
</div>
</div>
</div>
)
}