import Container from "@/app/_components/container";
import { HeroPost } from "@/app/_components/hero-post";
import { Intro } from "@/app/_components/intro";
import { MoreStories } from "@/app/_components/more-stories";
import { getAllPosts, getMainIntroduction } from "@/lib/api";
import LandingHero from "@/app/_components/landing-hero";

export default function Index() {
  const allPosts = getAllPosts();

  const mainIntroduction = getMainIntroduction();

  const morePosts = allPosts;

  return (
    <main>
      <LandingHero />
      <section id="home-content">
        <Container>
          <Intro />
          <HeroPost
            title={mainIntroduction.title}
            coverImage={mainIntroduction.coverImage}
            date={mainIntroduction.date}
            author={mainIntroduction.author}
            slug={mainIntroduction.slug}
            excerpt={mainIntroduction.excerpt}
          />
          {morePosts.length > 0 && <MoreStories posts={morePosts} />}
        </Container>
      </section>
    </main>
  );
}
