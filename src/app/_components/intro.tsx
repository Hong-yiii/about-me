import { CMS_NAME } from "@/lib/constants";

export function Intro() {
  return (
    <section className="flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12">
      <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8">
        I Build Things.
      </h1>
      <h4 className="text-center md:text-left text-lg mt-5 md:pl-8">
        Let's chat! Drop me a text!{" "}
        <a
          href="mailto:hongyilin.mail@gmail.com"
          className="underline hover:text-blue-600 duration-200 transition-colors"
        >
        <div></div>
          Email
        </a>{" "}
        <div></div>
        <a
          href="https://www.linkedin.com/in/hong-yi-lin-793b8b23b/"
          className="underline hover:text-blue-600 duration-200 transition-colors"
        >
          LinkedIn
        </a>{" "}
      </h4>
    </section>
  );
}
